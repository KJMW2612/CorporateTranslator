"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TranslatorForm } from "./TranslatorForm";
import { TranslatorResult } from "./TranslatorResult";
import { convertText } from "../api";
import {
  TranslationRequest,
  TranslationResponse,
  TargetAudience,
  DeliveryChannel,
} from "../types";
import { BUSINESS_TOOLS } from "@/features/shared-tools/config";

export const TranslatorContainer: React.FC = () => {
  const [text, setText] = useState("");
  const [target, setTarget] = useState<TargetAudience>("상사");
  const [channel, setChannel] = useState<DeliveryChannel>("사내 메신저");
  const [result, setResult] = useState<TranslationResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 마운트 시 세션 데이터 로드
  useEffect(() => {
    const restoreSessionData = () => {
      const savedText = sessionStorage.getItem("translator_text");
      const savedTarget = sessionStorage.getItem("translator_target");
      const savedChannel = sessionStorage.getItem("translator_channel");
      const savedResult = sessionStorage.getItem("translator_result");

      if (savedText) setText(savedText);
      if (savedTarget) setTarget(savedTarget as TargetAudience);
      if (savedChannel) setChannel(savedChannel as DeliveryChannel);
      if (savedResult) setResult(JSON.parse(savedResult));

      setIsInitialized(true);
    };

    const timer = setTimeout(restoreSessionData, 0);
    return () => clearTimeout(timer);
  }, []);

  // 상태 변화 시 캐싱 처리 (세션 저장)
  useEffect(() => {
    if (!isInitialized) return;

    sessionStorage.setItem("translator_text", text);
    sessionStorage.setItem("translator_target", target);
    sessionStorage.setItem("translator_channel", channel);

    if (result) {
      sessionStorage.setItem("translator_result", JSON.stringify(result));
    } else {
      sessionStorage.removeItem("translator_result");
    }
  }, [text, target, channel, result, isInitialized]);

  // handleTranslate: API 전송 성공 시점에만 정확히 스크롤을 가동합니다. [1, 2]
  const handleTranslate = async (data: TranslationRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await convertText(data);
      setResult(response);

      // ◀ 복원이 아닌 사용자가 활발히 변환 성공한 런타임 직후에만 80ms 렌더 딜레이 후 스크롤 다운 수행 [1, 2] ▶
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 80);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "변환 중 원인을 알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const siblingTools = BUSINESS_TOOLS.filter((t) => t.id !== "translator");
  const showSubjectBanner = channel === "이메일" && result !== null;

  return (
    <Card className="max-w-3xl mx-auto shadow-lg border-slate-200/60 dark:border-slate-800/60">
      <CardHeader className="space-y-1 text-center sm:text-left border-b border-slate-100 dark:border-slate-800 pb-5">
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          회사어 번역하기
        </CardTitle>
        <CardDescription>
          내용을 입력하고 대상과 수단을 선택한 후 번역하기를 눌러보세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <TranslatorForm
          onSubmit={handleTranslate}
          isLoading={isLoading}
          text={text}
          setText={setText}
          target={target}
          setTarget={setTarget}
          channel={channel}
          setChannel={setChannel}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {showSubjectBanner &&
          siblingTools.map((tool) => (
            <div
              key={tool.id}
              className="mt-6 p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-950/20 text-center space-y-1.5 animate-slide-up-fade"
            >
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                이메일 본문 번역이 끝났습니다! 본문과 매칭되는 완벽한 제목도
                지어보세요!
              </p>
              <Link
                href={`/subject-generator?keyword=${encodeURIComponent(text)}&target=${encodeURIComponent(target)}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline transition-all active:scale-95 duration-100"
              >
                {tool.ctaText}
              </Link>
            </div>
          ))}

        <TranslatorResult result={result} />
      </CardContent>
    </Card>
  );
};
