"use client"; // Next.js Client Component 선언 필수!

import React, { useState, useEffect } from "react";
import { TranslatorContainer } from "@/features/translator/components/TranslatorContainer";

const ROTATING_EXAMPLES = [
  {
    original:
      "야 팀장아, 거래처에서 자료 늦게 줘서 오늘 퇴근 전까지는 절대 다 못 끝내",
    translated:
      "팀장님, 거래처에서 자료를 늦게 주셔서 오늘 퇴근 전까지는 끝내기 힘들 것 같아요. 😅 조금만 더 기다려 주시면 감사하겠습니다!",
  },
  {
    original: "아 내가 실수로 누락시켰다 ㅈㅅ",
    translated: "아, 제가 실수로 누락시켰어요. 죄송해요! 🙇‍♂️",
  },
  {
    original: "기획서 올렸는데 대충 보고 빨리 승인 좀 해라. 언제 할 거야?",
    translated:
      "기획서를 제출하였습니다. 검토 후 신속하게 승인해 주시기 바랍니다. 승인 일정은 언제쯤 가능하실지 궁금합니다.",
  },
  {
    original: "도와줘 나 이거 설계 혼자하는거 너무 힘들어",
    translated:
      "이 설계를 혼자 진행하는 데 어려움이 있습니다. 도움을 주시면 감사하겠습니다.",
  },
  {
    original: "다음주 화요일 4시에 미팅 ㄱㄱ ㄱㅊ?",
    translated: "다음 주 화요일 4시에 미팅이 가능하신지 확인 부탁드립니다.",
  },
  {
    original: "이메일 관련해서 빨리 물어볼거 있으니까 확인하고 빨리 전화 줘",
    translated:
      "이메일 관련해서 궁금한 점이 있어서요. 확인해 주시고 빠른 시간 안에 전화 주시면 감사하겠습니다! 😊",
  },
];

export default function Home() {
  const [currentIndex, setIndex] = useState(0);

  // 5초 간격으로 자동으로 예문 인덱스를 순환시킵니다.
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_EXAMPLES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeExample = ROTATING_EXAMPLES[currentIndex];

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto space-y-6">
      {/* 1. 소개글 헤드 세션 */}
      <section className="text-center space-y-2">
        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">
          실시간 AI 맞춤 교정
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight sm:text-4xl">
          비즈니스 소통을 매끄럽게
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto break-keep">
          말하기 곤란했거나 직관적인 구어체 표현을 회사 상황에 적합한 격식 있고
          신뢰감 넘치는 회사어(비즈니스 문장)로 번역하세요.
        </p>
      </section>

      {/* 
        2. [오픈형] 1:1 회사어 대조 영역 
        - 에러 없는 100% 가동 커스텀 물리 트랜지션 애니메이션 적용 완료 [1.2.9].
        - 문장 길이에 의한 출렁임을 완벽하게 봉쇄하도록 고정 높이(h-[160px] md:h-[120px]) 설계 [1.1.2, 1.3.1].
      */}
      <div
        key={currentIndex}
        // 물리 슬라이드 트랜지션 적용
        className="max-w-3xl mx-auto w-full flex flex-col md:flex-row items-center gap-4 animate-slide-up-fade"
      >
        {/* ① 원문 카드 (윈도우/다크모드 완벽 대응 및 고정 높이 h-[160px] md:h-[120px] 수렴) */}
        <div className="w-full md:flex-1 bg-rose-100/60 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-700/60 rounded-xl py-4 px-5 flex flex-col justify-center h-40 md:h-30">
          <p className="text-sm md:text-base text-slate-800 dark:text-slate-200 font-semibold break-keep leading-relaxed text-center md:text-left">
            {activeExample.original}
          </p>
        </div>

        {/* 2. 중앙 표준 둥근 화살표 배지 (양쪽 카드의 수직 정중앙에 고정됩니다) */}
        <div className="shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 shadow-sm">
          {/* PC용 오른쪽 화살표 */}
          <svg
            className="hidden md:block h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
          {/* 모바일용 아래쪽 화살표 */}
          <svg
            className="block md:hidden h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 13l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>

        {/* ③ 부드러운 회사어 변환 카드 (윈도우/다크모드 완벽 대응 및 고정 높이 h-[160px] md:h-[120px] 수렴) */}
        <div className="w-full md:flex-1 bg-emerald-100/50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-700/60 rounded-xl py-4 px-5 flex flex-col justify-center h-40 md:h-30">
          <p className="text-sm md:text-base text-slate-800 dark:text-slate-200 font-bold break-keep leading-relaxed text-center md:text-left">
            {activeExample.translated}
          </p>
        </div>
      </div>

      {/* 3. 실제 메인 서비스 입력 카드 장착부 (max-w-3xl) */}
      <main className="w-full">
        <TranslatorContainer />
      </main>
    </div>
  );
}
