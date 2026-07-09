import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SubjectRequest } from "@/features/subject-generator/types";
import { RateLimiter } from "@/lib/rate-limiter";
import { UserIdentifier } from "@/lib/rate-limiter/identifier";

// 빌드 최적화 우회 (중요!)
export const dynamic = "force-dynamic";

const rateLimiter = new RateLimiter();

export async function POST(req: NextRequest) {
  const identity = UserIdentifier.identify(req);
  const userId = identity.id;
  const userType = identity.type;

  try {
    const body: SubjectRequest = await req.json();

    // ◀ 변수명 정밀 대조부: keyword, purpose, receiver 값 수신 ▶
    const { keyword, purpose, receiver } = body;

    if (!keyword || !purpose || !receiver) {
      return NextResponse.json(
        { error: "필수 요청 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    const check = rateLimiter.canRequest(userId, userType, keyword);
    if (!check.allowed) {
      return NextResponse.json(
        { error: check.reason || "비정상적인 요청이 감지되었습니다." },
        { status: check.statusCode },
      );
    }

    rateLimiter.registerRequest(userId, userType, keyword);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const purposeTagInstruction =
      purpose === "없음"
        ? "주의: 사용자가 메일 성격을 '없음'으로 요청했으므로, 스타일 A와 B의 제목 맨 앞에 대괄호 머리말([보고], [요청] 등)을 절대 붙이지 마십시오. 대괄호 없이 안건 요점 단축어로만 문장을 구성해야 합니다."
        : `반드시 모든 스타일 결과물 앞에 메일 성격을 표시하는 [${purpose}] 태그 또는 상황에 적합한 수식 태그(예: [${purpose} 협조요청] 등)를 맨 처음에 씌워서 정갈하게 작성하십시오.`;

    const prompt = `당신은 대한민국 최고의 대기업 비즈니스 커뮤니케이션 코치이자 국문 작문 전문가입니다.
사용자가 입력한 핵심 내용(안건)을 바탕으로 상황에 맞는 스마트한 이메일 제목 3가지를 조립해 주세요.

[상황 조건]
- 핵심 안건: "${keyword.trim()}"
- 메일의 성격: [${purpose}]
- 수신 대상: [${receiver}]

[대괄호 태그 규칙]
${purposeTagInstruction}

결과는 정확히 아래의 JSON 형식으로만 채워 반환해야 합니다. 다른 서론, 설명, 마크다운 기호 없이 오직 JSON 텍스트 자체만 출력하세요.

JSON 형식:
{
  "direct": "[직관명료형] 군더더기 없이 수신자와 목적, 핵심 안건이 일목요연하고 압축적으로 조립되어 한눈에 메일 내용이 인지되는 표준 비즈니스 이메일 제목",
  "polite": "[정중격식형] 수신인인 [${receiver}]를 최고 수준으로 배려하며 소통 장벽을 낮추는 부드럽고 우아하며 겸손한 문어체의 완곡어법 이메일 제목",
  "deadline": "[기한강조형] 바쁜 직장인의 성급한 메일 흐름 속에서도 빠른 행동과 확인 일정을 기한과 함께 한눈에 강제하여 액션을 유도하는 직관형 이메일 제목 (제목 맨 앞에 [기한: 7/15] 또는 [회신 요청] 등을 결합하여 작성)"
}`;

    const modelName = process.env.OPENAI_MODEL_NAME || "gpt-4o-mini";

    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "system",
          content: "You are a professional assistant designed to output JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const resultText = response.choices[0].message.content;
    if (!resultText) {
      throw new Error("AI 분석 결과를 가져오지 못했습니다.");
    }

    const parsedResult = JSON.parse(resultText);

    return NextResponse.json(parsedResult);
  } catch (error: unknown) {
    console.error("Subject Generator Error:", error);

    let errorMessage =
      "이메일 제목 생성 중 일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    const rawMessage = error instanceof Error ? error.message : String(error);

    if (
      rawMessage.includes("insufficient_quota") ||
      rawMessage.includes("billing")
    ) {
      errorMessage =
        "현재 서버 결제 한도 또는 무료 한도가 초과되었습니다. 관리자 확인이 필요합니다.";
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (userId) {
      rateLimiter.releaseConcurrency(userId);
    }
  }
}
