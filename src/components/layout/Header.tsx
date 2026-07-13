"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BUSINESS_TOOLS } from "@/features/shared-tools/config";

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
          <Image
            src="/favicon.ico"
            alt="회사어 번역기 로고"
            width={36}
            height={36}
            className="rounded-lg shadow-sm animate-slide-up-fade"
            priority
          />
          <span className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            회사어 번역기
          </span>
        </Link>

        {/* 탭 네비게이션 */}
        <nav className="flex items-center gap-1 select-none">
          {BUSINESS_TOOLS.map((tool) => {
            const isActive = pathname === tool.path;
            // 뱃지 양도: 이제 'greeting-generator' 옆에 NEW 빨간 점 펄스 뱃지가 활성화됩니다 [1.2.8, 1.2.9].
            const isNewFeature = tool.id === "greeting-generator";

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
                {/* 신규 기능 알림용 은은한 펄스형 빨간 점 및 NEW 배지 */}
                {isNewFeature && (
                  <span className="flex items-center gap-1 mr-0.5 shrink-0">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500 dark:bg-red-400"></span>
                    </span>
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
