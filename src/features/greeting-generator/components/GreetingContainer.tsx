"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GreetingForm } from "./GreetingForm";
import { GreetingResult } from "./GreetingResult";
import {
  GreetingRequest,
  GreetingResponse,
  GreetingType,
  GreetingPurpose,
  GreetingReceiver,
  GreetingContext,
  GreetingLength,
} from "../types";

export const GreetingContainer: React.FC = () => {
  // 상태 보드 수립
  const [greetingType, setGreetingType] = useState<GreetingType>("시작 인사");
  const [purpose, setPurpose] = useState<GreetingPurpose>("인사");
  const [receiver, setReceiver] = useState<GreetingReceiver>("상사");
  const [context, setContext] = useState<GreetingContext>("이메일");
  const [length, setLength] = useState<GreetingLength>("보통");

  // 체크박스 유무 온/오프 상태 및 기본값 조율
  const [useDate, setUseDate] = useState(true);
  const [useTime, setUseTime] = useState(true);
  const [useWeather, setUseWeather] = useState(false); // ◀ 요청 사항 반영: 기본 비활성화(false) 세팅 완료 [1.1.2]

  // 통합 캘린더 날짜 문자열 및 드롭다운 [1.1.2, 1.2.3]
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("오전");
  const [customWeather, setCustomWeather] = useState("맑음");
  const [eventKeyword, setEventKeyword] = useState("");

  const [result, setResult] = useState<GreetingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. 최초 가동 마운트 복구 및 5단계 시간대 분석 이식 [1.1.2, 1.2.3]
  useEffect(() => {
    const restoreSessionData = () => {
      const now = new Date();
      const todayString = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const hour = now.getHours(); // 실시간 시각 감지 (0~23)

      // A. 날씨 기후 계절별 예측 매핑 [2.1.2]
      let weatherEst = "맑음";
      if (now.getMonth() + 1 >= 6 && now.getMonth() + 1 <= 8)
        weatherEst = "더움";
      else if (now.getMonth() + 1 >= 12 || now.getMonth() + 1 <= 2)
        weatherEst = "추움";

      // B. 5단계 기안문 전용 시간대 정밀 분석 매핑 [1.1.2, 1.2.3]
      let timeEst = "오후";
      if (hour >= 6 && hour < 11) {
        timeEst = "오전";
      } else if (hour >= 11 && hour < 13) {
        timeEst = "점심 시간대";
      } else if (hour >= 13 && hour < 17) {
        timeEst = "오후";
      } else if (hour >= 17 && hour < 20) {
        timeEst = "퇴근 시간대";
      } else {
        timeEst = "늦은 저녁";
      }

      setCustomDate(todayString);
      setCustomTime(timeEst);
      setCustomWeather(weatherEst);

      // 세션 저장 데이터 안전 복구 [1.1.2]
      const savedType = sessionStorage.getItem("greet_type");
      const savedPurpose = sessionStorage.getItem("greet_purpose");
      const savedReceiver = sessionStorage.getItem("greet_receiver");
      const savedContext = sessionStorage.getItem("greet_context");
      const savedLength = sessionStorage.getItem("greet_length");

      const savedUseDate = sessionStorage.getItem("greet_use_date");
      const savedDate = sessionStorage.getItem("greet_date");

      const savedUseTime = sessionStorage.getItem("greet_use_time");
      const savedTime = sessionStorage.getItem("greet_time");

      const savedUseWeather = sessionStorage.getItem("greet_use_weather");
      const savedWeather = sessionStorage.getItem("greet_weather");

      const savedKeyword = sessionStorage.getItem("greet_keyword");
      const savedResult = sessionStorage.getItem("greet_result");

      if (savedType) setGreetingType(savedType as GreetingType);
      if (savedPurpose) setPurpose(savedPurpose as GreetingPurpose);
      if (savedReceiver) setReceiver(savedReceiver as GreetingReceiver);
      if (savedContext) setContext(savedContext as GreetingContext);
      if (savedLength) setLength(savedLength as GreetingLength);

      if (savedUseDate) setUseDate(savedUseDate === "true");
      if (savedDate) setCustomDate(savedDate);

      if (savedUseTime) setUseTime(savedUseTime === "true");
      if (savedTime) setCustomTime(savedTime);

      if (savedUseWeather) setUseWeather(savedUseWeather === "true");
      if (savedWeather) setCustomWeather(savedWeather);

      if (savedKeyword) setEventKeyword(savedKeyword);
      if (savedResult) setResult(JSON.parse(savedResult));

      setIsInitialized(true);
    };

    const timer = setTimeout(restoreSessionData, 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. 입력 및 결과 변경에 따른 실시간 캐싱 업데이트 [1.1.2]
  useEffect(() => {
    if (!isInitialized) return;

    sessionStorage.setItem("greet_type", greetingType);
    sessionStorage.setItem("greet_purpose", purpose);
    sessionStorage.setItem("greet_receiver", receiver);
    sessionStorage.setItem("greet_context", context);
    sessionStorage.setItem("greet_length", length);

    sessionStorage.setItem("greet_use_date", String(useDate));
    sessionStorage.setItem("greet_date", customDate);

    sessionStorage.setItem("greet_use_time", String(useTime));
    sessionStorage.setItem("greet_time", customTime);

    sessionStorage.setItem("greet_use_weather", String(useWeather));
    sessionStorage.setItem("greet_weather", customWeather);

    sessionStorage.setItem("greet_keyword", eventKeyword);

    if (result) {
      sessionStorage.setItem("greet_result", JSON.stringify(result));
    } else {
      sessionStorage.removeItem("greet_result");
    }
  }, [
    greetingType,
    purpose,
    receiver,
    context,
    length,
    useDate,
    customDate,
    useTime,
    customTime,
    useWeather,
    customWeather,
    eventKeyword,
    result,
    isInitialized,
  ]);

  const handleGenerate = async (data: GreetingRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/greeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "인사말 생성에 실패했습니다.");
      }

      const resultData: GreetingResponse = await response.json();
      setResult(resultData);

      // 성공 직후 자동 스크롤 다운 [1, 2]
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
          인사말 작성하기
        </CardTitle>
        <CardDescription>
          날씨, 상황별 오프닝 및 마무리 안부를 정교하게 결합하여 품격있는 회사어
          인사를 건네보세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <GreetingForm
          onSubmit={handleGenerate}
          isLoading={isLoading}
          greetingType={greetingType}
          setGreetingType={setGreetingType}
          purpose={purpose}
          setPurpose={setPurpose}
          receiver={receiver}
          setReceiver={setReceiver}
          context={context}
          setContext={setContext}
          length={length}
          setLength={setLength}
          useDate={useDate}
          setUseDate={setUseDate}
          customDate={customDate}
          setCustomDate={setCustomDate}
          useTime={useTime}
          setUseTime={setUseTime}
          customTime={customTime}
          setCustomTime={setCustomTime}
          useWeather={useWeather}
          setUseWeather={setUseWeather}
          customWeather={customWeather}
          setCustomWeather={setCustomWeather}
          eventKeyword={eventKeyword}
          setEventKeyword={setEventKeyword}
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

        <GreetingResult result={result} />
      </CardContent>
    </Card>
  );
};
