import crypto from "crypto";
import { DEFAULT_LIMITER_CONFIG, RateLimiterConfig } from "./config";
import { InMemoryRateLimitStore } from "./store";
import { RateLimiterLogger } from "./logger";

export class RateLimiter {
  private store = new InMemoryRateLimitStore();
  private config: RateLimiterConfig;

  constructor(config: Partial<RateLimiterConfig> = {}) {
    this.config = { ...DEFAULT_LIMITER_CONFIG, ...config };
  }

  /**
   * 데이터 암호화 표준 SHA-256을 활용해 원본 내용을 마스킹한 고유 해시 값을 연산합니다.
   */
  public computeHash(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex");
  }

  /**
   * 사용자의 차단 여부를 체크하고 남은 유효 시간을 초 단위로 돌려줍니다.
   */
  public isBlocked(userId: string): {
    blocked: boolean;
    remainingSeconds: number;
    reason: string | null;
  } {
    const state = this.store.getOrCreate(userId);
    const now = Date.now();

    if (now < state.blockedUntil) {
      return {
        blocked: true,
        remainingSeconds: Math.ceil((state.blockedUntil - now) / 1000),
        reason: state.blockReason,
      };
    }

    return { blocked: false, remainingSeconds: 0, reason: null };
  }

  /**
   * 비정상 요청을 사전 필터링하고 차단 여부를 도출합니다. (SOLID 단일 책임 원칙 준수)
   */
  public canRequest(
    userId: string,
    userType: string,
    text: string,
  ): { allowed: boolean; reason?: string; statusCode: number } {
    const now = Date.now();
    const state = this.store.getOrCreate(userId);
    const hash = this.computeHash(text);
    const textLength = text.length;

    // 대량 누적 예방을 위해 매 요청 검증 시 무효 데이터 가비지 컬렉터 가동
    this.store.cleanUp();

    // 1. 기존의 블랙리스트(차단) 상태인지 확인
    const blockStatus = this.isBlocked(userId);
    if (blockStatus.blocked) {
      this.writeLog(
        userId,
        userType,
        hash,
        textLength,
        true,
        blockStatus.reason || "EXCEEDED_LIMITS",
      );
      return {
        allowed: false,
        reason: blockStatus.reason || "요청이 일시적으로 정지되었습니다.",
        statusCode: 429,
      };
    }

    // 2. [가장 중요] 동일 사용자 동시 요청 제한 (Concurrency Lock)
    if (state.activeRequest) {
      this.writeLog(
        userId,
        userType,
        hash,
        textLength,
        true,
        "CONCURRENT_REQUEST_LIMIT",
      );
      return {
        allowed: false,
        reason: "이미 AI가 문장을 변환하고 있습니다. 잠시만 기다려주세요.",
        statusCode: 429,
      };
    }

    // 3. 분당 요청수 검증 (Sliding Window 적용)
    const rpmCutoff = now - 60 * 1000;
    state.requestTimestamps = state.requestTimestamps.filter(
      (t) => t > rpmCutoff,
    );

    if (state.requestTimestamps.length >= this.config.MAX_REQUEST_PER_MINUTE) {
      this.blockUser(
        userId,
        this.config.BLOCK_SECONDS,
        "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
      );
      this.writeLog(
        userId,
        userType,
        hash,
        textLength,
        true,
        "EXCEEDED_MAX_REQUESTS_PER_MINUTE",
      );
      return {
        allowed: false,
        reason: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        statusCode: 429,
      };
    }

    // 4. 동일한 입력 내용 반복 감지 (Hash 기준 30초 내 5회)
    const dupCutoff = now - this.config.DUPLICATE_WINDOW_SECONDS * 1000;
    let dupTimestamps = state.duplicateMap.get(hash) || [];
    dupTimestamps = dupTimestamps.filter((t) => t > dupCutoff);
    state.duplicateMap.set(hash, dupTimestamps);

    if (dupTimestamps.length >= this.config.MAX_DUPLICATE_REQUEST) {
      this.blockUser(
        userId,
        this.config.BLOCK_SECONDS,
        "동일한 내용의 반복 입력(도배)으로 인해 이용이 차단되었습니다.",
      );
      this.writeLog(
        userId,
        userType,
        hash,
        textLength,
        true,
        "EXCEEDED_MAX_DUPLICATE_REQUESTS",
      );
      return {
        allowed: false,
        reason:
          "동일한 내용의 반복 입력(도배)으로 인해 일시적으로 차단되었습니다. 잠시 후 다시 시도해주세요.",
        statusCode: 429,
      };
    }

    // 5. 너무 짧은 입력 반복 감지
    if (textLength < this.config.SHORT_TEXT_LENGTH) {
      const shortCutoff = now - this.config.SHORT_TEXT_WINDOW_SECONDS * 1000;
      state.shortTextTimestamps = state.shortTextTimestamps.filter(
        (t) => t > shortCutoff,
      );

      if (
        state.shortTextTimestamps.length >= this.config.MAX_SHORT_TEXT_REQUESTS
      ) {
        this.blockUser(
          userId,
          this.config.BLOCK_SECONDS,
          "무의미한 짧은 입력의 반복 호출로 인해 이용이 차단되었습니다.",
        );
        this.writeLog(
          userId,
          userType,
          hash,
          textLength,
          true,
          "EXCEEDED_SHORT_TEXT_SPAM_LIMIT",
        );
        return {
          allowed: false,
          reason:
            "의미 없는 짧은 입력의 반복 요청으로 인해 일시적으로 차단되었습니다. 잠시 후 다시 시도해주세요.",
          statusCode: 429,
        };
      }
    }

    return { allowed: true, statusCode: 200 };
  }

  /**
   * 비정상 위협을 통과한 요청에 한해 계수 토큰을 부여하고 동시성 락을 체결합니다.
   */
  public registerRequest(userId: string, userType: string, text: string): void {
    const now = Date.now();
    const state = this.store.getOrCreate(userId);
    const hash = this.computeHash(text);
    const textLength = text.length;

    // 1. 다른 요청 차단 락(Concurrency Lock) 동작
    state.activeRequest = true;

    // 2. 가용 토큰 및 윈도우 기록 가산
    state.requestTimestamps.push(now);

    const dupTimestamps = state.duplicateMap.get(hash) || [];
    dupTimestamps.push(now);
    state.duplicateMap.set(hash, dupTimestamps);

    if (textLength < this.config.SHORT_TEXT_LENGTH) {
      state.shortTextTimestamps.push(now);
    }

    this.writeLog(userId, userType, hash, textLength, false);
  }

  /**
   * 사용자 대상 블랙리스트 차단을 집행합니다.
   */
  public blockUser(
    userId: string,
    durationSeconds: number,
    reason: string,
  ): void {
    const state = this.store.getOrCreate(userId);
    state.blockedUntil = Date.now() + durationSeconds * 1000;
    state.blockReason = reason;
  }

  /**
   * API 로직이 정상 종료되거나 에러를 던진 후, 해당 유저의 동시성 락을 정밀히 해제합니다.
   */
  public releaseConcurrency(userId: string): void {
    const state = this.store.getOrCreate(userId);
    state.activeRequest = false;
  }

  public reset(userId: string): void {
    this.store.reset(userId);
  }

  private writeLog(
    userId: string,
    userType: string,
    hash: string,
    length: number,
    isBlocked: boolean,
    reason?: string,
  ): void {
    RateLimiterLogger.log({
      timestamp: new Date().toISOString(),
      userId,
      userType,
      inputHash: hash,
      inputLength: length,
      isBlocked,
      blockReason: reason,
    });
  }
}
