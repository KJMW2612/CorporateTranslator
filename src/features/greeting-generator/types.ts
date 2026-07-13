export type GreetingType = "시작 인사" | "마무리 인사";
export type GreetingPurpose =
  | "인사"
  | "환영"
  | "초대"
  | "안내"
  | "감사"
  | "사과"
  | "축하"
  | "격려";

// 요구사항 반영: '참석자' 제거 및 수신 대상 유형 정리
export type GreetingReceiver =
  | "상사"
  | "동료"
  | "후배"
  | "임직원"
  | "거래처"
  | "고객"
  | "일반 대중";

// 요구사항 반영: 사용 상황을 4가지 정식 표기 형식으로 일치화 [1]
export type GreetingContext =
  | "이메일"
  | "사내 발표"
  | "행사 사회"
  | "대중 연설";

export type GreetingLength = "짧게" | "보통" | "길게";

export interface GreetingRequest {
  greetingType: GreetingType;
  purpose: GreetingPurpose;
  receiver: GreetingReceiver;
  context: GreetingContext;
  length: GreetingLength;
  useDate: boolean;
  customDate?: string; // YYYY-MM-DD
  useTime: boolean;
  customTime?: string; // 오전/오후
  useWeather: boolean;
  customWeather?: string; // 맑음/비
  eventKeyword?: string;
}

export interface GreetingResponse {
  softText: string;
  formalText: string;
}
