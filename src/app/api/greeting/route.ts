import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  GreetingRequest,
  GreetingReceiver,
  GreetingContext,
} from "@/features/greeting-generator/types";
import { RateLimiter } from "@/lib/rate-limiter";
import { UserIdentifier } from "@/lib/rate-limiter/identifier";

// Next.js 빌드 최적화 우회 (동적 라우팅 규격 강제) [1, 2]
export const dynamic = "force-dynamic";

// 어뷰징 및 트래픽 과소비 방지용 레이트 리미터 가동
const rateLimiter = new RateLimiter();

/**
 * [1단계 표준 삭망월 파서]
 * 자바스크립트 내장 Intl 국제화 엔진을 이용해, 양력 날짜를 순수 음력 월/일 정수로 변환합니다.
 */
function getLunarMonthAndDay(date: Date): { month: number; day: number } {
  try {
    const formatter = new Intl.DateTimeFormat("ko-KR-u-ca-chinese", {
      month: "numeric",
      day: "numeric",
    });
    const formatted = formatter.format(date);
    const matches = formatted.match(/\d+/g);

    if (matches && matches.length >= 2) {
      return {
        month: parseInt(matches[0], 10),
        day: parseInt(matches[1], 10),
      };
    }
  } catch (e) {
    console.error("Lunisolar calendar parse error:", e);
  }
  // 브라우저/서버 환경 미지원 시 대비 폴백 (양력으로 변환)
  return { month: date.getMonth() + 1, day: date.getDate() };
}

/**
 * [2단계 실시간 명절 탐색 알고리즘]
 * 입력받은 연도(Year)의 설날(음력 1/1)과 추석(음력 8/15) 당일의 양력 Date 객체를 실시간 스캔하여 찾아냅니다.
 */
function findHolidaysForYear(year: number): {
  seolnal: Date | null;
  chuseok: Date | null;
} {
  let seolnal: Date | null = null;
  let chuseok: Date | null = null;

  // A. 설날 스캔: 통상 양력 1월 중순 ~ 2월 말 사이에 위치함
  for (let month = 1; month <= 2; month++) {
    for (let day = 1; day <= 31; day++) {
      const testDate = new Date(year, month - 1, day);
      if (testDate.getFullYear() !== year) continue; // 존재하지 않는 가상 일자 무시

      const lunar = getLunarMonthAndDay(testDate);
      if (lunar.month === 1 && lunar.day === 1) {
        seolnal = testDate;
        break;
      }
    }
    if (seolnal) break;
  }

  // B. 추석 스캔: 통상 양력 9월 초 ~ 10월 말 사이에 위치함
  for (let month = 9; month <= 10; month++) {
    for (let day = 1; day <= 31; day++) {
      const testDate = new Date(year, month - 1, day);
      if (testDate.getFullYear() !== year) continue;

      const lunar = getLunarMonthAndDay(testDate);
      if (lunar.month === 8 && lunar.day === 15) {
        chuseok = testDate;
        break;
      }
    }
    if (chuseok) break;
  }

  return { seolnal, chuseok };
}

// 7대 수신 대상에 대한 비즈니스 문맥 프롬프트 맵 [2]
const TARGET_PROMPTS: Record<GreetingReceiver, string> = {
  상사: "수신 대상은 '상사'입니다. 예의와 존칭의 격을 극대화하고, 보고의 형식을 취하며 상사를 존중하는 극존칭을 사용하십시오.",
  동료: "수신 대상은 '사내 동료'입니다. 수평적이면서 협조적이고 사적인 선을 넘지 않는 친근하고 다정한 비즈니스 어조를 구사하십시오.",
  후배: "수신 대상은 '사내 후배'입니다. 다정하면서도 요청 사항이 명확하게 이해되도록 격려와 수평적인 존중을 섞어 주십시오.",
  임직원:
    "수신 대상은 '사내 임직원 전체(경영 공지 또는 단체 연설)'입니다. 전사적 리더십, 품격, 공적 정중함과 유대감을 불어넣는 세련된 공지/축사 어투를 구사하십시오.",
  거래처:
    "수신 대상은 '외부 거래처 및 고객 파트너사'입니다. 당사를 대표하는 소통인 만큼 격조 높은 비즈니스 서신 완곡어법을 철저히 준수하십시오.",
  고객: "수신 대상은 '고객(소비자)'입니다. 정중함, 따뜻한 친절함, 고객 가치에 대한 감사의 태도를 극대화하여 신뢰감 넘치는 브랜드 어조로 작성하십시오.",
  "일반 대중":
    "수신 대상은 '일반 대중(Public)'입니다. 누구나 쉽게 이해하면서도 호소력 있고 격식 있는 보편적인 안부 어투를 사용해 주십시오.",
};

// 사용 상황 4선에 대한 세부 출력 포맷팅 가이드 맵 [2]
const CHANNEL_PROMPTS: Record<GreetingContext, string> = {
  이메일:
    "사용 상황은 '이메일'입니다. 격식 있는 도입 인사, 정식 도입 안부, 본문 매끄러운 브릿지, 마감 맺음말(감사합니다.)을 완전히 갖춘 긴 호흡의 비즈니스 서신 형태로 작성해 주세요.",
  "사내 발표":
    "사용 상황은 '사내 발표 오프닝/클로징 멘트'입니다. PT 진행 시의 현장 가독성, 비전 제시, 요점 환기가 돋보이는 구어체 발표 원고 형태로 작성해 주세요.",
  "행사 사회":
    "사용 상황은 '행사 진행(MC) 사회 멘트'입니다. 아이스브레이킹, 참석자 환대, 행사 진행 순서 조율 등이 정갈하게 돋보이는 아나운서식 진행 멘트로 작성해 주세요.",
  "대중 연설":
    "사용 상황은 '대중 연설(Public Speech)'입니다. 청중의 이목을 장악하는 오프닝이나 긴 여운을 주는 격조 높고 감동적인 대중 연설체로 작성해 주세요.",
};

export async function POST(req: NextRequest) {
  const identity = UserIdentifier.identify(req);
  const userId = identity.id;
  const userType = identity.type;

  try {
    const body: GreetingRequest = await req.json();
    const {
      greetingType,
      purpose,
      receiver,
      context,
      length,
      useDate,
      customDate,
      useTime,
      customTime,
      useWeather,
      customWeather,
      eventKeyword,
    } = body;

    if (!greetingType || !purpose || !receiver || !context || !length) {
      return NextResponse.json(
        { error: "필수 요청 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    const check = rateLimiter.canRequest(
      userId,
      userType,
      eventKeyword || "greeting",
    );
    if (!check.allowed) {
      return NextResponse.json(
        { error: check.reason || "비정상적인 요청이 감지되었습니다." },
        { status: check.statusCode },
      );
    }

    rateLimiter.registerRequest(userId, userType, eventKeyword || "greeting");

    // ==========================================
    // ◀ [A. 음력 캘린더 명절 및 신정/연말 2순위 조건 자동 식별] ▶
    // ==========================================
    const parsedDate = new Date(customDate || "");
    const isValidDate = !isNaN(parsedDate.getTime());
    const dayOfWeek = isValidDate ? parsedDate.getDay() : 999;
    const month = isValidDate ? parsedDate.getMonth() + 1 : 999;

    let dateContextInstruction = "";
    let isP2Active = false; // 2순위 명절/연말연시 플래그 초기화

    if (useDate && customDate && isValidDate) {
      const { seolnal, chuseok } = findHolidaysForYear(
        parsedDate.getFullYear(),
      );
      let diffDaysSeol = 999;
      let diffDaysChu = 999;
      const d1 = new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
      );

      if (seolnal) {
        const d2 = new Date(
          seolnal.getFullYear(),
          seolnal.getMonth(),
          seolnal.getDate(),
        );
        const diffTime = d1.getTime() - d2.getTime();
        diffDaysSeol = Math.round(diffTime / (1000 * 60 * 60 * 24));
      }
      if (chuseok) {
        const d2 = new Date(
          chuseok.getFullYear(),
          chuseok.getMonth(),
          chuseok.getDate(),
        );
        const diffTime = d1.getTime() - d2.getTime();
        diffDaysChu = Math.round(diffTime / (1000 * 60 * 60 * 24));
      }

      // 명절 기간(설날/추석 전후 7일) 또는 신년(1월)/연말(12월)인 경우 2순위 전격 활성화
      const isHolidayActive =
        Math.abs(diffDaysSeol) <= 7 || Math.abs(diffDaysChu) <= 7;
      const isSeasonActive = month === 1 || month === 12;

      if (isHolidayActive || isSeasonActive) {
        isP2Active = true;
      }

      // 각 상황별 캘린더 고유 안부 프롬프트 텍스트 빌드
      if (Math.abs(diffDaysSeol) <= 7) {
        if (diffDaysSeol === 0)
          dateContextInstruction = "설날 명절 당일 감사/덕담 안부";
        else if (diffDaysSeol < 0)
          dateContextInstruction = `설날 시작 전(D${diffDaysSeol}) 고향길 안전 귀성 사전 안부`;
        else
          dateContextInstruction = `설날 연휴 종료 후(D+${diffDaysSeol}) 일상 복귀 격려 안부`;
      } else if (Math.abs(diffDaysChu) <= 7) {
        if (diffDaysChu === 0)
          dateContextInstruction = "추석 한가위 당일 풍요기원 안부";
        else if (diffDaysChu < 0)
          dateContextInstruction = `추석 연휴 시작 전(D${diffDaysChu}) 풍성한 한가위 사전 안부`;
        else
          dateContextInstruction = `추석 연휴 종료 후(D+${diffDaysChu}) 일상 복귀 활력 사후 안부`;
      } else {
        if (month === 1)
          dateContextInstruction = "새해 맞이 신년 안부 인사와 덕담";
        else if (month === 12)
          dateContextInstruction = "다사다난했던 연말 한 해 감사 안부";
        else dateContextInstruction = `${month}월 계절 특징이나 기후 상황 안부`;
      }
    }

    // ==========================================
    // ◀ [B. 사용자 요구에 맞춘 정교한 4대 우선순위 기계식 매핑] ▶
    // ==========================================
    const isP1Active = useTime && customTime === "늦은 저녁";
    const isP3Active =
      useWeather && (customWeather === "비" || customWeather === "눈");
    const isP4Active = useDate && (dayOfWeek === 1 || dayOfWeek === 5);

    // 텍스트 매핑용 설명 정의
    const p1Text = "업무 시간 외인 '늦은 저녁(밤)' 연락 양해 안부";
    const p2Text = `달력 캘린더 전용 명절 및 시즌 안부 (${dateContextInstruction})`;
    const p3Text = `궂은 날씨('${customWeather}') 안전 배려 안부`;
    const p4Text = `'${dayOfWeek === 1 ? "월요일" : "금요일"}' 한 주의 출발/주말 마무리 안부`;

    // 현재 활성화된 조건들을 우선순위(1~4) 순서대로 정렬하여 배열에 적재합니다.
    const activePriorities: { priority: number; desc: string }[] = [];
    if (isP1Active) activePriorities.push({ priority: 1, desc: p1Text });
    if (isP2Active) activePriorities.push({ priority: 2, desc: p2Text });
    if (isP3Active) activePriorities.push({ priority: 3, desc: p3Text });
    if (isP4Active) activePriorities.push({ priority: 4, desc: p4Text });

    const activeCount = activePriorities.length;

    // ==========================================
    // ◀ [C. 최종 요약/압축 규칙 알고리즘 조립부] ▶
    // ==========================================
    let advancedPromptInstruction = "";

    // ① 희망 분량: "짧게" (목표: 정확히 1문장)
    if (length === "짧게") {
      if (activeCount >= 2) {
        // [규칙 1] 겹치는 게 몇 개든 상위 우선순위 2개만 추출, 한 문장으로 강력 압축하여 출력 (나머지 하위 순위 제거)
        advancedPromptInstruction = `- [짧은 분량 초압축 지침] 현재 분량이 '짧게'이므로 전체 안부는 오직 '단 한 문장(1 sentence)'으로 구성되어야 합니다. 활성화된 조건 중 가장 높은 우선순위 2가지인 [${activePriorities[0].desc}]와 [${activePriorities[1].desc}] 요소를 선별하고, 나머지 3~4순위는 완전히 배제하십시오. 이 두 가지를 별개의 문장으로 쪼개지 말고 한 문장 안에 매우 매끄럽게 합성 및 압축하여 서두를 시작하십시오.`;
      } else if (activeCount === 1) {
        // 1개 겹치면 그냥 정갈한 1문장
        advancedPromptInstruction = `- [짧은 분량 단독 지침] 현재 분량이 '짧게'이므로 전체 안부는 '단 한 문장(1 sentence)'으로 구성되어야 합니다. 활성화된 유일한 조건인 [${activePriorities[0].desc}]를 사용해 깔끔하고 정중한 한 문장짜리 안부를 작성하십시오.`;
      } else {
        advancedPromptInstruction =
          "- [짧은 분량 기본 지침] 날씨나 기온, 요일 언급을 완전히 배제하고 오직 안건 본문 내용만을 핵심으로 삼아 1~2문장의 아주 간결한 인사말로 완성하십시오.";
      }
    }
    // ② 희망 분량: "보통" (목표: 정확히 2문장)
    else if (length === "보통") {
      if (activeCount === 4) {
        // [규칙 2] 4가지 모두 활성화 시 ➔ (1+2순위 합성) 1문장 + (3+4순위 합성) 1문장 = 정확히 2문장 구성
        advancedPromptInstruction = `- [보통 분량 4단 압축 지침] 현재 모든 조건이 겹쳤으며 분량이 '보통'이므로, 오프닝/클로징 안부는 정확히 '두 문장(2 sentences)'으로 구성되어야 합니다.
  * 첫 번째 문장: 1순위(${activePriorities[0].desc})와 2순위(${activePriorities[1].desc})를 단 한 문장 안에 유기적으로 합성 및 압축하여 작성하십시오.
  * 두 번째 문장: 3순위(${activePriorities[2].desc})와 4순위(${activePriorities[3].desc})를 단 한 문장 안에 유기적으로 합성 및 압축하여 작성하십시오.`;
      } else if (activeCount === 3) {
        // [규칙 3] 3가지 활성화 시 ➔ (1순위 단독) 1문장 + (2+3순위 합성) 1문장 = 정확히 2문장 구성
        advancedPromptInstruction = `- [보통 분량 3단 압축 지침] 현재 3가지 조건이 활성화되어 있고 분량이 '보통'이므로, 오프닝/클로징 안부는 정확히 '두 문장(2 sentences)'으로 구성되어야 합니다.
  * 첫 번째 문장: 가장 위중한 1순위 안부(${activePriorities[0].desc})만을 단독으로 공손하게 한 문장으로 작성하십시오.
  * 두 번째 문장: 남은 두 가지 안부인 2순위(${activePriorities[1].desc})와 3순위(${activePriorities[2].desc})를 개별 문장으로 쪼개지 말고, 한 문장 안에 자연스럽게 합성 및 압축하여 작성하십시오.`;
      } else if (activeCount === 2) {
        // [규칙 4] 2가지 활성화 시 ➔ 압축하지 않고 각각 단독 1문장씩 전개 = 정확히 2문장 구성
        advancedPromptInstruction = `- [보통 분량 2단 전개 지침] 현재 2가지 안부가 활성화되어 있고 분량이 '보통'이므로, 전체 안부는 정확히 '두 문장(2 sentences)'으로 구성되어야 합니다.
  * 첫 번째 문장: 1순위 안부(${activePriorities[0].desc})를 단독으로 한 문장 작성하십시오.
  * 두 번째 문장: 2순위 안부(${activePriorities[1].desc})를 단독으로 한 문장 작성하십시오.`;
      } else if (activeCount === 1) {
        advancedPromptInstruction = `- [보통 분량 단독 지침] 활성화된 단 하나의 안부 정보(${activePriorities[0].desc})를 사용해, 1개 단락 수준의 표준 정형화된 비즈니스 도입 안부로 작성해 주십시오.`;
      } else {
        advancedPromptInstruction =
          "- [보통 분량 기본 지침] 날씨나 기온 언급 없이 1개 단락 수준의 표준 비즈니스 첫인상 예절 멘트로 정중하게 가공하십시오.";
      }
    }
    // ③ 희망 분량: "길게" (제한 없음, 1개 지침당 무조건 독립된 1문장씩 서술)
    else {
      // [규칙 5] 몇 개가 활성화되든 절대 압축하지 않고 각각 온전하게 독립 1문장씩 전개
      const activeDescs = activePriorities.map((a) => a.desc).join(", ");
      advancedPromptInstruction = `- [긴 분량 개별 전개 지침] 긴 기안문이나 발표 오프닝에 걸맞게 최고의 사교 매너를 갖추어야 합니다. 현재 활성화된 모든 안부 정보(${activeDescs})를 절대 합치거나 생략하지 마시고, 각각 온전히 독립된 개별의 '한 문장씩'으로 아주 풍부하게 나열하여 비즈니스 품격을 극대화해 주십시오.`;
    }

    const selectedTargetPrompt = TARGET_PROMPTS[receiver] || "";
    const selectedChannelPrompt = CHANNEL_PROMPTS[context] || "";

    const dateMeta = useDate && customDate ? `- 설정 날짜: ${customDate}` : "";
    const timeMeta =
      useTime && customTime ? `- 설정 시간대: ${customTime}` : "";
    const weatherMeta =
      useWeather && customWeather ? `- 설정 기후/날씨: ${customWeather}` : "";

    const keywordPrompt = eventKeyword?.trim()
      ? `- 구체적인 안건 핵심 명사 정보: "${eventKeyword.trim()}"`
      : "";

    // 요청 시점에 동적으로 가동하여 컴파일 타임 에러 원천 예방
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `당신은 대한민국 최고의 비즈니스 작문 및 회사어 소통 교육 전문가입니다.
주어진 상황 조건과 참고 정보를 극적으로 결합하여, 가장 품격 있고 세련된 이메일 또는 발표 오프닝/클로징 인사말을 작성해 주세요.

[요청 조건]
- 인사말 분류: [${greetingType}] (글의 도입부 시작 인사인지, 혹은 마무리 지어주는 끝맺음 인사인지 파악 필수)
- 소통 목적: [${purpose}]
- 수신 대상: [${receiver}]
- 가용 상황: [${context}]
- 희망 분량: [${length}] (짧게: 1~2문장 / 보통: 1개 문단 / 길게: 2~3개 문단 수준의 긴 기안문 양식 또는 연설 큐시트 형태)

[참고 기후/상황 메타데이터]
${dateMeta}
${timeMeta}
${weatherMeta}
${keywordPrompt}

[우선순위 기반 캘린더/시즌(명절 전후) 적용 세부 규칙]
${useDate ? `- 일반 시즌 지침: ${dateContextInstruction}` : "- 현재 기준일 정보가 생략되었습니다. 계절적 특성이나 명절(설날, 추석, 연말, 신년 등) 안부를 인위적으로 넣지 마시고, 기후 언급 없이 아주 자연스럽고 품격 있는 일반적인 감사/안부 인사말로만 작성하십시오."}

[우선순위 & 분량 제어 초정밀 지침]
${advancedPromptInstruction}

[세부 규칙: 수신 대상 지침]
${selectedTargetPrompt}

[세부 규칙: 전달 수단 지침]
${selectedChannelPrompt}

결과는 지정된 JSON 키 형식에 맞춰서 변환된 문자열로만 채워 반환해야 합니다. 다른 서론이나 끝맺음, 마크다운 기호 없이 오직 JSON 텍스트 자체만 반환하세요.
- softText: 정중하면서도 온화하고, 다정하며 따뜻한 계절 안부와 배려가 풍부하게 묻어나는 친근한 어투 (필요시 👍, 😊 등 가벼운 이모지 1개 사용 가능)
- formalText: 지극히 격식 있고 고도의 신뢰감과 공적 예의를 극대화한 전문적이고 명확하며 세련된 비즈니스 어투 (이모지 절대 불허)

JSON 형식:
{
  "softText": "부드럽고 다정한 완성형 인사말 문장",
  "formalText": "격식 있고 극도로 예의 바른 완성형 인사말 문장"
}`;

    const modelName = process.env.OPENAI_MODEL_NAME || "gpt-4o-mini";

    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "system",
          content:
            "You are a professional writing assistant designed to output JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const resultText = response.choices[0].message.content;
    if (!resultText) {
      throw new Error("AI 분석 결과를 받아오지 못했습니다.");
    }

    const parsedResult = JSON.parse(resultText);

    return NextResponse.json({
      softText: parsedResult.softText,
      formalText: parsedResult.formalText,
    });
  } catch (error: unknown) {
    console.error("Greeting API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (userId) {
      rateLimiter.releaseConcurrency(userId);
    }
  }
}
