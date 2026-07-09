"use client"; // 상태 탭 활성화를 감지하기 위해 Client Component로 지정합니다.

import React from "react";
import Link from "next/link";
import Image from "next/image"; // ESLint 에러 예방을 위해 Next.js 공식 이미지 최적화 모듈 연동 [1.2.1, 1.2.3, 1.2.9]
import { usePathname } from "next/navigation";
import { BUSINESS_TOOLS } from "@/features/shared-tools/config"; // 중앙 설정 임포트

export const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 브랜드 영역 */}
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          {/* ◀ 기존 파란색 박스/SVG 아이콘을 없애고, 제작하신 favicon.ico를 로고 이미지로 완벽 교체합니다 [1.1.2] ▶ */}
          <Image
            src="/favicon.ico"
            alt="회사어 번역기 로고"
            width={36}
            height={36}
            className="rounded-lg shadow-sm animate-slide-up-fade"
            priority // 메인 상단 로고이므로 지연 로딩을 비활성화하고 우선 로드하여 UX 가치를 높입니다 [1.2.1, 1.2.3].
          />
          <span className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            회사어 번역기
          </span>
        </Link>

        {/* 탭 네비게이션 */}
        <nav className="flex items-center gap-1 select-none">
          {BUSINESS_TOOLS.map((tool) => {
            const isActive = pathname === tool.path;
            const isSubjectGenerator = tool.id === "subject-generator";

            return (
              <Link
                key={tool.id}
                href={tool.path}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-900 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                {/* 신규 기능 알림용 은은한 펄스형 빨간 점 및 NEW 배지 (맨 앞 배치) */}
                {isSubjectGenerator && (
                  <span className="flex items-center gap-1 mr-0.5 shrink-0">
                    {/* ① 빨간 구체 */}
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500 dark:bg-red-400"></span>
                    </span>

                    {/* ② "NEW" 텍스트 배지 (빨간 구체와 동일한 애니메이션 효과 이중 탑재) */}
                    <span className="relative inline-flex font-extrabold text-[9px] tracking-wider uppercase leading-none text-red-500 dark:text-red-400">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded bg-red-400 opacity-30"></span>
                      <span className="relative">NEW</span>
                    </span>
                  </span>
                )}

                <span>{tool.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
