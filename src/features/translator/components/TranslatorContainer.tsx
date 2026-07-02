"use client";

import React, { useState } from "react";
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
import { TranslationRequest, TranslationResponse } from "../types";

export const TranslatorContainer: React.FC = () => {
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async (data: TranslationRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await convertText(data);
      setResult(response);
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

  return (
    <Card className="max-w-3xl mx-auto shadow-lg border-slate-200/60 dark:border-slate-800/60">
      <CardHeader className="space-y-1 text-center sm:text-left border-b border-slate-100 dark:border-slate-800 pb-5">
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          회사어 번역하기
        </CardTitle>
        <CardDescription>
          상황에 맞춰 입력폼을 조정한 후 번역하기를 진행해 보세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* 입력 폼 렌더링 (에러가 발생했던 TranslatorForm, handleTranslate, isLoading을 여기서 정상 소모합니다) */}
        <TranslatorForm onSubmit={handleTranslate} isLoading={isLoading} />

        {/* 오류 메시지 렌더 영역 */}
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

        {/* 결과창 */}
        <TranslatorResult result={result} />
      </CardContent>
    </Card>
  );
};
