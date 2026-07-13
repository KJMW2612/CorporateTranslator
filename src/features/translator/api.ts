import { TranslationRequest, TranslationResponse } from "./types";

export async function convertText(
  data: TranslationRequest,
): Promise<TranslationResponse> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "AI 말투 번역에 실패했습니다.");
  }

  return response.json();
}
