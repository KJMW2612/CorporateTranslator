"use client"; // Next.js App Router에서 React State를 사용하기 위해 필수적입니다.

import React, { useState } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"; // 커스텀 복사 훅 연동 [1.1.3]

export const Footer: React.FC = () => {
  // 모달 팝업 상태 관리
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // 복사 기능 제어
  const { isCopied, copy } = useCopyToClipboard();

  const developerEmail = "jaemawon20@gmail.com";
  const instagramUrl = "https://www.instagram.com/kjmw_2612/";

  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-10 mt-12">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        {/* 💡 피드백 & 🥤 후원 버튼 그룹 (크기를 대규모 확장했습니다) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pb-4">
          {/* 1. 피드백 보내기 (2배 크기로 확장) */}
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="inline-flex items-center gap-2.5 px-6 py-3 text-base font-bold rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-md hover:shadow-lg active:scale-95 duration-100 cursor-pointer"
          >
            <span className="text-xl md:text-2xl">💡</span>
            <span>의견 및 피드백 보내기</span>
          </button>

          {/* 2. 개발자 콜라 사주기 (2배 크기로 확장) */}
          <button
            type="button"
            onClick={() => setIsQrOpen(true)}
            className="inline-flex items-center gap-2.5 px-6 py-3 text-base font-bold rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all shadow-md hover:shadow-lg active:scale-95 duration-100 cursor-pointer"
          >
            <span className="text-xl md:text-2xl">🥤</span>
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
        3. 피드백 채널 모달 영역 (이메일 & 인스타그램 이중 제공)
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

            {/* 헤더 설명문구 교정 */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                💡 개발자에게 의견 보내기
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal break-keep">
                아래 <strong>이메일</strong> 주소를 복사하거나{" "}
                <strong>인스타그램 DM</strong>을 통해
                <br /> 자유롭게 피드백을 전달해 주세요.
              </p>
            </div>

            {/* 채널 1: 이메일 복사 영역 */}
            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-mono text-sm text-slate-800 dark:text-slate-200 select-all font-semibold">
                {developerEmail}
              </span>

              {/* 이메일 복사 버튼 */}
              <button
                type="button"
                onClick={() => copy(developerEmail)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
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

            {/* ◀ 채널 2 [신규 추가]: 인스타그램 DM 보내기 연결 영역 ▶ */}
            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2">
                {/* 세련된 핑크색 인스타그램 팩토리 로고 이식 */}
                <svg
                  className="h-4 w-4 text-pink-500 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.79.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span>@kjmw_2612</span>
              </span>

              {/* 인스타그램 아웃바운드 링크 */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-pink-600 hover:text-pink-700 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer shrink-0"
              >
                DM 전송 ➔
              </a>
            </div>

            {/* 하단 맺음말 문구 정교화 */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal break-keep">
              AI 어색한 말투 제보, 상황 프리셋 건의, 비즈니스 협업 제안 등{" "}
              <br />
              모든 문의와 피드백을 진심을 다해 기다립니다!
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
            className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 text-center space-y-5 shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150"
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
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                🥤 개발자에게 콜라 사주기
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                카카오페이 머니로 안전하게 후원금이 송금됩니다.
              </p>
            </div>

            {/* QR 이미지 출력 영역 (w-64 h-64로 큼직하게 유지) */}
            <div className="flex justify-center bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kakaopay-qr.png"
                alt="카카오페이 송금 QR코드"
                className="w-64 h-64 object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className =
                      "w-64 h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-6 break-keep font-sans";
                    fallback.innerText =
                      "public/kakaopay-qr.png 경로에 송금용 QR코드 이미지를 넣어주시면 자동으로 여기에 매핑됩니다!";
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>

            {/* 설명문 */}
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal break-keep">
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
