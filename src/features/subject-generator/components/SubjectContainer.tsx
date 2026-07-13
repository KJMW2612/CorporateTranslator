"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SubjectForm } from "./SubjectForm";
import { SubjectResult } from "./SubjectResult";
import {
  SubjectRequest,
  SubjectResponse,
  SubjectPurpose,
  SubjectReceiver,
} from "../types";

export const SubjectContainer: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [purpose, setPurpose] = useState<SubjectPurpose>("없음");
  const [receiver, setReceiver] = useState<SubjectReceiver>("상사");
  const [result, setResult] = useState<SubjectResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 마운트 시 세션 데이터 복구
  useEffect(() => {
    const restoreSessionData = () => {
      const params = new URLSearchParams(window.location.search);
      const queryKeyword = params.get("keyword");
      const queryTarget = params.get("target");

      if (queryKeyword) {
        setKeyword(queryKeyword);
        sessionStorage.setItem("subject_keyword", queryKeyword);
        window.history.replaceState({}, "", window.location.pathname);
      } else {
        const savedKeyword = sessionStorage.getItem("subject_keyword");
        if (savedKeyword) setKeyword(savedKeyword);
      }

      if (
        queryTarget &&
        ["상사", "동료", "후배", "거래처"].includes(queryTarget)
      ) {
        setReceiver(queryTarget as SubjectReceiver);
        sessionStorage.setItem("subject_receiver", queryTarget);
      } else {
        const savedReceiver = sessionStorage.getItem("subject_receiver");
        if (savedReceiver) setReceiver(savedReceiver as SubjectReceiver);
      }

      const savedPurpose = sessionStorage.getItem("subject_purpose");
      const savedResult = sessionStorage.getItem("subject_result");

      if (savedPurpose) setPurpose(savedPurpose as SubjectPurpose);
      if (savedResult) setResult(JSON.parse(savedResult));

      setIsInitialized(true);
    };

    const timer = setTimeout(restoreSessionData, 0);
    return () => clearTimeout(timer);
  }, []);

  // 상태 변화 시 캐싱 기록
  useEffect(() => {
    if (!isInitialized) return;

    sessionStorage.setItem("subject_keyword", keyword);
    sessionStorage.setItem("subject_purpose", purpose);
    sessionStorage.setItem("subject_receiver", receiver);

    if (result) {
      sessionStorage.setItem("subject_result", JSON.stringify(result));
    } else {
      sessionStorage.removeItem("subject_result");
    }
  }, [keyword, purpose, receiver, result, isInitialized]);

  // handleGenerate: API 전송 성공 시점에만 정확히 스크롤을 가동합니다. [1, 2]
  const handleGenerate = async (data: SubjectRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "이메일 제목 생성에 실패했습니다.");
      }

      const resultData: SubjectResponse = await response.json();
      setResult(resultData);

      // ◀ 사용자가 활발히 생성 성공한 런타임 직후에만 80ms 렌더 딜레이 후 스크롤 다운 수행 [1, 2] ▶
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
          : "서버 통신 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-lg border-slate-200/60 dark:border-slate-800/60">
      <CardHeader className="space-y-1 text-center sm:text-left border-b border-slate-100 dark:border-slate-800 pb-5">
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          이메일 제목 짓기
        </CardTitle>
        <CardDescription>
          어려운 제목 짓기는 그만! 핵심 키워드로 명확한 이메일 제목을
          지어보세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <SubjectForm
          onSubmit={handleGenerate}
          isLoading={isLoading}
          keyword={keyword}
          setKeyword={setKeyword}
          purpose={purpose}
          setPurpose={setPurpose}
          receiver={receiver}
          setReceiver={setReceiver}
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

        <SubjectResult result={result} />
      </CardContent>
    </Card>
  );
};
