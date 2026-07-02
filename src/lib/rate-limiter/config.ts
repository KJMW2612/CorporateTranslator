export interface RateLimiterConfig {
  MAX_REQUEST_PER_MINUTE: number; // 분당 최대 요청 가능 횟수
  BLOCK_SECONDS: number; // 차단 지속 시간 (초)

  MAX_DUPLICATE_REQUEST: number; // 동일 내용 반복 허용 횟수
  DUPLICATE_WINDOW_SECONDS: number; // 동일 내용 감지 범위 시간 (초)

  SHORT_TEXT_LENGTH: number; // '너무 짧은 입력'으로 분류할 글자수 임계치
  MAX_SHORT_TEXT_REQUESTS: number; // 짧은 입력 반복 허용 횟수
  SHORT_TEXT_WINDOW_SECONDS: number; // 짧은 입력 감지 범위 시간 (초)
}

export const DEFAULT_LIMITER_CONFIG: RateLimiterConfig = {
  MAX_REQUEST_PER_MINUTE: 20,
  BLOCK_SECONDS: 30,

  MAX_DUPLICATE_REQUEST: 5,
  DUPLICATE_WINDOW_SECONDS: 30,

  SHORT_TEXT_LENGTH: 3,
  MAX_SHORT_TEXT_REQUESTS: 3, // 30초 내에 3자 이하 짧은 글을 3회 반복 입력 시 차단
  SHORT_TEXT_WINDOW_SECONDS: 30,
};
