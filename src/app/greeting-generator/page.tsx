"use client";

import { GreetingContainer } from "@/features/greeting-generator/components/GreetingContainer";
import Link from "next/link";

export default function GreetingGeneratorPage() {
  return (
    <div className="py-10 px-4 max-w-4xl mx-auto space-y-6">
      {/* 요구사항 텍스트 반영 */}
      <section className="text-center space-y-2">
        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">
          AI 인사말 추천
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight sm:text-4xl">
          비즈니스 안부 인사를 품격있게
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto break-keep text-center whitespace-pre-line leading-relaxed">
          오늘의 날씨, 일정, 목적에 맞는 첫머리 도입부와 마감 맺음말을
          작성하세요. <br /> 상대를 배려하는 한 문장이 업무 소통의 큰 결실을
          맺습니다.
        </p>
      </section>

      {/* 스마트 인사말 생성 컨테이너 */}
      <main className="w-full">
        <GreetingContainer />
      </main>

      {/* 하단 메인 번역기 컴백 가이드 */}
      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-blue-600 dark:text-slate-50 dark:hover:text-blue-400 hover:underline transition-colors"
        >
          ◀ 회사어 번역기 홈 화면으로 가기
        </Link>
      </div>
    </div>
  );
}
