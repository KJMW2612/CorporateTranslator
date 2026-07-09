"use client";

import { SubjectContainer } from "@/features/subject-generator/components/SubjectContainer";
import Link from "next/link";

export default function SubjectGeneratorPage() {
  return (
    <div className="py-10 px-4 max-w-4xl mx-auto space-y-6">
      {/* 요청하신 국문 텍스트 변경사항 전면 수렴 */}
      <section className="text-center space-y-2">
        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">
          AI 제목 추천
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight sm:text-4xl">
          이메일 제목을 간편하게
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto break-keep text-center whitespace-pre-line leading-relaxed">
          업무 메일의 첫인상은 제목에서 시작됩니다. <br /> AI로 내용에 맞는
          명확하고 전문적인 이메일 제목을 3초 만에 완성하세요.
        </p>
      </section>

      {/* 스마트 제목 생성 컨테이너 */}
      <main className="w-full">
        <SubjectContainer />
      </main>

      {/* 하단 메인 번역기 컴백 가이드 */}
      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-blue-600 dark:text-slate-50 dark:hover:text-blue-400 hover:underline transition-colors"
        >
          ◀ 본문 가공 (회사어 번역기) 홈 화면으로 가기
        </Link>
      </div>
    </div>
  );
}
