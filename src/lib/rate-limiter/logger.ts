export interface RateLimitLogEntry {
  timestamp: string;
  userId: string;
  userType: string;
  inputHash: string;
  inputLength: number;
  isBlocked: boolean;
  blockReason?: string;
}

export class RateLimiterLogger {
  /**
   * 컴플라이언스를 저해하지 않는 수준에서 AI 남용 탐지 로그를 중앙 가시성 서버 형식으로 출력합니다.
   */
  public static log(entry: RateLimitLogEntry): void {
    const level = entry.isBlocked ? "WARN" : "INFO";

    // 이 로그 문자열은 나중에 Datadog, AWS CloudWatch, Winston 등 수집 서버로 전달하기 용이합니다.
    const logString = JSON.stringify({
      level,
      message: "Rate Limiter Request Evaluated",
      ...entry,
    });

    console.log(`[RateLimiter] ${logString}`);
  }
}
