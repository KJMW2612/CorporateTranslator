import { TranslatorContainer } from "@/features/translator/components/TranslatorContainer";

export default function Home() {
  return (
    // 구글 검토 및 실서비스용 깔끔한 정렬 구조(max-w-4xl)로 원복했습니다.
    <div className="py-10 px-4 max-w-4xl mx-auto space-y-8">
      {/* 소개글 헤드 세션 */}
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

      {/* 메인 서비스 본문 영역 */}
      <main className="w-full">
        <TranslatorContainer />
      </main>
    </div>
  );
}
