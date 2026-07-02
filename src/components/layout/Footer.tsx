"use client"; // Next.js App Router에서 React State를 사용하기 위해 필수적입니다.

import React, { useState } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"; // 우리가 만든 커스텀 복사 훅 임포트 [1.1.3]

export const Footer: React.FC = () => {
  // 모달 팝업 상태 관리
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // 복사 기능 제어
  const { isCopied, copy } = useCopyToClipboard();

  const developerEmail = "jaemawon20@gmail.com";

  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        {/* 💡 피드백 & 🥤 후원 버튼 그룹 */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pb-2">
          {/* 1. 피드백 보내기 (클릭 시 이메일 안내 모달 오픈) */}
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm active:scale-95 duration-100 cursor-pointer"
          >
            <span className="text-sm">💡</span>
            <span>의견 및 피드백 보내기</span>
          </button>

          {/* 2. 개발자 콜라 사주기 */}
          <button
            type="button"
            onClick={() => setIsQrOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all shadow-sm active:scale-95 duration-100 cursor-pointer"
          >
            <span className="text-sm">🥤</span>
            <span>개발자 콜라 사주기</span>
          </button>
        </div>

        {/* 법적 고지 및 카피라이트 */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 space-y-1">
          <p>
            © {new Date().getFullYear()} 회사어 번역기. All rights reserved.
          </p>
          <p>
            본 서비스는 비즈니스 예절에 올바른 구어 수정을 제안하는 전용
            어시스턴트입니다.
          </p>
        </div>
      </div>

      {/* ==========================================
        3. 피드백 이메일 레이어 팝업 (모달 영역)
         ========================================== */}
      {isFeedbackOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsFeedbackOpen(false)} // 여백 클릭 시 모달 닫힘
        >
          <div
            className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()} // 내부 클릭 시 버블링 차단
          >
            {/* 닫기 (X) 버튼 */}
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                💡 개발자에게 의견 보내기
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                아래 이메일 주소로 메일을 발송해 주시면 감사하겠습니다.
              </p>
            </div>

            {/* 이메일 노출 및 복사 버튼 정렬 구역 */}
            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-mono text-sm text-slate-800 dark:text-slate-200 select-all font-semibold">
                {developerEmail}
              </span>

              {/* 복사 작동 버튼 */}
              <button
                type="button"
                onClick={() => copy(developerEmail)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <svg
                      className="h-3.5 w-3.5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      복사됨
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal break-keep">
              회사어 번역 개선 의견, 신규 상황 프리셋 추가 제안, 비즈니스 협업
              문의 등 모든 의견을 적극 환영합니다.
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
        4. 카카오페이 QR 코드 레이어 팝업 (모달 영역)
         ========================================== */}
      {isQrOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsQrOpen(false)} // 바깥 어두운 배경 클릭 시 팝업 닫힘
        >
          <div
            className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()} // 내부 클릭 시 버블링 차단
          >
            {/* 닫기 (X) 아이콘 버튼 */}
            <button
              type="button"
              onClick={() => setIsQrOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* 헤더 */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                🥤 개발자에게 콜라 사주기
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                카카오페이 머니로 안전하게 후원금이 송금됩니다.
              </p>
            </div>

            {/* QR 이미지 출력 영역 */}
            <div className="flex justify-center bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kakaopay-qr.png"
                alt="카카오페이 송금 QR코드"
                className="w-48 h-48 object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className =
                      "w-48 h-48 flex items-center justify-center text-xs text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-4 break-keep font-sans";
                    fallback.innerText =
                      "public/kakaopay-qr.png 경로에 송금용 QR코드 이미지를 넣어주시면 자동으로 여기에 매핑됩니다!";
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>

            {/* 설명문 */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal break-keep">
              카카오톡 앱의 <strong>QR 스캐너</strong> 또는 스마트폰 기본{" "}
              <strong>카메라 앱</strong>으로 위의 QR 코드를 비추면 즉시 간편
              송금 화면으로 연결됩니다.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};
