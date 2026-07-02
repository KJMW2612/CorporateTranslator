import { TranslationRequest, TranslationResponse } from "./types";

export async function convertText(
  data: TranslationRequest,
): Promise<TranslationResponse> {
  // 모의 딜레이 대신 3단계에서 구축한 내부 API 주소로 요청을 위임합니다.
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // 서버가 에러 메시지를 반환한 경우 이를 파싱하여 던집니다.
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "AI 말투 변환에 실패했습니다.");
  }

  return response.json();
}
