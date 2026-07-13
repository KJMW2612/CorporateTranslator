import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  GreetingType,
  GreetingPurpose,
  GreetingReceiver,
  GreetingContext,
  GreetingLength,
  GreetingRequest,
} from "../types";

interface GreetingFormProps {
  onSubmit: (data: GreetingRequest) => void;
  isLoading: boolean;
  greetingType: GreetingType;
  setGreetingType: (val: GreetingType) => void;
  purpose: GreetingPurpose;
  setPurpose: (val: GreetingPurpose) => void;
  receiver: GreetingReceiver;
  setReceiver: (val: GreetingReceiver) => void;
  context: GreetingContext;
  setContext: (val: GreetingContext) => void;
  length: GreetingLength;
  setLength: (val: GreetingLength) => void;

  useDate: boolean;
  setUseDate: (val: boolean) => void;
  customDate: string;
  setCustomDate: (val: string) => void;

  useTime: boolean;
  setUseTime: (val: boolean) => void;
  customTime: string;
  setCustomTime: (val: string) => void;

  useWeather: boolean;
  setUseWeather: (val: boolean) => void;
  customWeather: string;
  setCustomWeather: (val: string) => void;

  eventKeyword: string;
  setEventKeyword: (val: string) => void;
}

const PURPOSES: GreetingPurpose[] = [
  "인사",
  "환영",
  "초대",
  "안내",
  "감사",
  "사과",
  "축하",
  "격려",
];
const TIMES = ["오전", "점심 시간대", "오후", "퇴근 시간대", "늦은 저녁"];
const WEATHERS = ["맑음", "흐림", "비", "눈", "더움", "추움"];

export const GreetingForm: React.FC<GreetingFormProps> = ({
  onSubmit,
  isLoading,
  greetingType,
  setGreetingType,
  purpose,
  setPurpose,
  receiver,
  setReceiver,
  context,
  setContext,
  length,
  setLength,
  useDate,
  setUseDate,
  customDate,
  setCustomDate,
  useTime,
  setUseTime,
  customTime,
  setCustomTime,
  useWeather,
  setUseWeather,
  customWeather,
  setCustomWeather,
  eventKeyword,
  setEventKeyword,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      greetingType,
      purpose,
      receiver,
      context,
      length,
      useDate,
      customDate: useDate ? customDate : undefined,
      useTime,
      customTime: useTime ? customTime : undefined,
      useWeather,
      customWeather: useWeather ? customWeather : undefined,
      eventKeyword: eventKeyword.trim() || undefined,
    });
  };

  const handleClear = () => {
    setEventKeyword("");
  };

  const handleDateCardClick = () => {
    if (isLoading) return;
    setUseDate(!useDate);
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (isPickerOpen) {
      dateInputRef.current?.blur();
      setIsPickerOpen(false);
    } else {
      dateInputRef.current?.showPicker();
      setIsPickerOpen(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsPickerOpen(false);
    }, 150);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. 참고 안건 및 비우기 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="event-keyword">행사명 / 세부 안건 (선택 입력)</Label>
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading || !eventKeyword}
            className="px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 active:bg-red-100 dark:active:bg-red-900/30 disabled:opacity-30 transition-colors shrink-0 ml-auto flex items-center gap-1 cursor-pointer"
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            비우기
          </button>
        </div>
        <input
          id="event-keyword"
          type="text"
          placeholder="예: 상반기 경영 성과 공유회, 기획실 신년 정기 미팅"
          value={eventKeyword}
          onChange={(e) => setEventKeyword(e.target.value)}
          disabled={isLoading}
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
        />
      </div>

      {/* 2. 메타데이터 선택식 카드 제어 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        {/* A. 날짜 제어 카드 */}
        <div
          onClick={handleDateCardClick}
          className={cn(
            "flex flex-col gap-2.5 rounded-xl border p-4 transition-all cursor-pointer select-none",
            useDate
              ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-500 opacity-100"
              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 opacity-40 hover:opacity-60",
          )}
        >
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            📅 날짜
          </span>
          <div onClick={(e) => e.stopPropagation()} className="w-full relative">
            <input
              type="date"
              ref={dateInputRef}
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                dateInputRef.current?.blur();
              }}
              disabled={isLoading || !useDate}
              onClick={handleInputClick}
              onBlur={handleInputBlur}
              className="w-full text-xs h-9 rounded-md border border-slate-200 bg-white pl-2.5 pr-8 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 disabled:opacity-40 cursor-pointer"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400 dark:text-slate-600">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* B. 시간대 제어 카드 */}
        <div
          onClick={() => !isLoading && setUseTime(!useTime)}
          className={cn(
            "flex flex-col gap-2.5 rounded-xl border p-4 transition-all cursor-pointer select-none",
            useTime
              ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-500 opacity-100"
              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 opacity-40 hover:opacity-60",
          )}
        >
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            ⏰ 시간대
          </span>
          <div onClick={(e) => e.stopPropagation()} className="w-full relative">
            <select
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              disabled={isLoading || !useTime}
              className="w-full text-xs h-9 rounded-md border border-slate-200 bg-white pl-2.5 pr-8 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 disabled:opacity-40 cursor-pointer appearance-none"
            >
              {TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400 dark:text-slate-600">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* C. 날씨 제어 카드 */}
        <div
          onClick={() => !isLoading && setUseWeather(!useWeather)}
          className={cn(
            "flex flex-col gap-2.5 rounded-xl border p-4 transition-all cursor-pointer select-none",
            useWeather
              ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-500 opacity-100"
              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 opacity-40 hover:opacity-60",
          )}
        >
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            ☀️ 날씨
          </span>
          <div onClick={(e) => e.stopPropagation()} className="w-full relative">
            <select
              value={customWeather}
              onChange={(e) => setCustomWeather(e.target.value)}
              disabled={isLoading || !useWeather}
              className="w-full text-xs h-9 rounded-md border border-slate-200 bg-white pl-2.5 pr-8 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 disabled:opacity-40 cursor-pointer appearance-none"
            >
              {WEATHERS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400 dark:text-slate-600">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 인사말 분류 */}
      <div className="space-y-2">
        <Label>인사말</Label>
        <RadioGroup
          name="greeting-type"
          value={greetingType}
          onValueChange={(val) => setGreetingType(val as GreetingType)}
          className="grid grid-cols-2 gap-2"
        >
          <RadioGroupItem id="gt-start" value="시작 인사">
            시작 인사
          </RadioGroupItem>
          <RadioGroupItem id="gt-end" value="마무리 인사">
            마무리 인사
          </RadioGroupItem>
        </RadioGroup>
      </div>

      {/* 4. 목적 */}
      <div className="space-y-2">
        <Label>목적</Label>
        <div className="flex flex-wrap gap-1.5">
          {PURPOSES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPurpose(item)}
              disabled={isLoading}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                purpose === item
                  ? "border-blue-500 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 ring-1 ring-blue-500"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 5. 대상 */}
      <div className="space-y-2">
        <Label>수신 대상</Label>
        <RadioGroup
          name="greeting-receiver"
          value={receiver}
          onValueChange={(val) => setReceiver(val as GreetingReceiver)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
        >
          <RadioGroupItem id="gr-boss" value="상사">
            상사
          </RadioGroupItem>
          <RadioGroupItem id="gr-peer" value="동료">
            동료
          </RadioGroupItem>
          <RadioGroupItem id="gr-junior" value="후배">
            후배
          </RadioGroupItem>
          <RadioGroupItem id="gr-staff" value="임직원">
            임직원
          </RadioGroupItem>
          <RadioGroupItem id="gr-client" value="거래처">
            거래처
          </RadioGroupItem>
          <RadioGroupItem id="gr-customer" value="고객">
            고객
          </RadioGroupItem>
          <RadioGroupItem id="gr-public" value="일반 대중">
            일반 대중
          </RadioGroupItem>
        </RadioGroup>
      </div>

      {/* 6. 상황 */}
      <div className="space-y-2">
        <Label>상황</Label>
        <RadioGroup
          name="greeting-context"
          value={context}
          onValueChange={(val) => setContext(val as GreetingContext)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
        >
          <RadioGroupItem id="gc-email" value="이메일">
            이메일
          </RadioGroupItem>
          <RadioGroupItem id="gc-in-pt" value="사내 발표">
            사내 발표
          </RadioGroupItem>
          <RadioGroupItem id="gc-mc" value="행사 사회">
            행사 사회
          </RadioGroupItem>
          <RadioGroupItem id="gc-out-pt" value="대중 연설">
            대중 연설
          </RadioGroupItem>
        </RadioGroup>
      </div>

      {/* 7. 분량 (요청 반영: 작은 알약 버튼을 큼직한 가로 3열 Segmented 카드로 전격 롤백) [1, 1.3.1] */}
      <div className="space-y-2">
        <Label>분량</Label>
        <RadioGroup
          name="greeting-length"
          value={length}
          onValueChange={(val) => setLength(val as GreetingLength)}
          // 3가지 옵션을 가장 균형 있게 채우는 가로 3열 레이아웃을 체결합니다 [1.3.1].
          className="grid grid-cols-3 gap-2 text-xs"
        >
          <RadioGroupItem id="gl-short" value="짧게">
            짧게
          </RadioGroupItem>
          <RadioGroupItem id="gl-medium" value="보통">
            보통
          </RadioGroupItem>
          <RadioGroupItem id="gl-long" value="길게">
            길게
          </RadioGroupItem>
        </RadioGroup>
      </div>

      {/* 전송 단추 */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full text-base font-semibold py-6 bg-blue-600 hover:bg-blue-700 cursor-pointer"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            품격 넘치는 인사말 작성 중...
          </span>
        ) : (
          "인사말 작성하기"
        )}
      </Button>
    </form>
  );
};
