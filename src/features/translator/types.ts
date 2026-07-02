export type TargetAudience = "상사" | "동료" | "후배" | "거래처";
export type DeliveryChannel = "사내 메신저" | "이메일" | "보고서";

export interface TranslationRequest {
  text: string;
  target: TargetAudience;
  channel: DeliveryChannel;
}

export interface TranslationResponse {
  originalText: string;
  softText: string; // 부드럽게 표현된 문장
  formalText: string; // 격식있게 표현된 문장
  target: TargetAudience;
  channel: DeliveryChannel;
}
