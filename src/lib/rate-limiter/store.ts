export interface UserState {
  activeRequest: boolean; // 동시 요청 락 (Concurrency Lock)
  blockedUntil: number; // 차단 만료 시각 (Timestamp)
  blockReason: string | null; // 차단 사유
  requestTimestamps: number[]; // 최근 요청 시각들
  duplicateMap: Map<string, number[]>; // 입력 해시별 요청 시각 기록
  shortTextTimestamps: number[]; // 짧은 글 입력 시각들
}

export class InMemoryRateLimitStore {
  private store = new Map<string, UserState>();

  public getOrCreate(userId: string): UserState {
    let state = this.store.get(userId);
    if (!state) {
      state = {
        activeRequest: false,
        blockedUntil: 0,
        blockReason: null,
        requestTimestamps: [],
        duplicateMap: new Map(),
        shortTextTimestamps: [],
      };
      this.store.set(userId, state);
    }
    return state;
  }

  public reset(userId: string): void {
    this.store.delete(userId);
  }

  /**
   * 오래 활동이 없는 휴면 유저 데이터를 메모리에서 자동으로 정리(GC)하여 서버 자원을 보호합니다.
   * @param maxIdleMs 유저 상태를 유지할 최대 시간 (기본값: 1시간)
   */
  public cleanUp(maxIdleMs: number = 3600000): void {
    const now = Date.now();
    for (const [userId, state] of this.store.entries()) {
      const lastRequest =
        state.requestTimestamps[state.requestTimestamps.length - 1] || 0;

      // 차단 상태도 아니고, 활성화된 요청도 없고, 오랫동안 요청이 없었다면 메모리 해제
      if (
        now > state.blockedUntil &&
        !state.activeRequest &&
        now - lastRequest > maxIdleMs
      ) {
        this.store.delete(userId);
      }
    }
  }
}
