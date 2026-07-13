import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SubjectPurpose, SubjectReceiver, SubjectRequest } from "../types";

interface SubjectFormProps {
  onSubmit: (data: SubjectRequest) => void;
  isLoading: boolean;
  keyword: string;
  setKeyword: (val: string) => void;
  purpose: SubjectPurpose;
  setPurpose: (val: SubjectPurpose) => void;
  receiver: SubjectReceiver;
  setReceiver: (val: SubjectReceiver) => void;
}

const PURPOSES: SubjectPurpose[] = [
  "없음",
  "보고",
  "요청",
  "공유",
  "협조",
  "안내",
  "긴급",
];

export const SubjectForm: React.FC<SubjectFormProps> = ({
  onSubmit,
  isLoading,
  keyword,
  setKeyword,
  purpose,
  setPurpose,
  receiver,
  setReceiver,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || isLoading) return;
    onSubmit({ keyword, purpose, receiver });
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. 핵심 안건 및 상단 정렬 비우기 버튼 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="subject-keyword">메일의 핵심 내용 / 안건</Label>

          {/* ◀ 번역기 폼과 완벽한 대칭을 이루도록 핵심 내용 위로 비우기 버튼을 배치했습니다. ▶ */}
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading || !keyword}
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
          id="subject-keyword"
          type="text"
          placeholder="예: 7월 부서 정산서 누락 내역 공유, 목요일 미팅 시간 변경 요청"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          disabled={isLoading}
          required
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
        />
      </div>

      {/* 2. 메일의 성격 (머리말 태그 정적 나열) */}
      <div className="space-y-2">
        <Label>말머리 태그</Label>
        <div className="flex flex-wrap items-center gap-1.5 pb-1 w-full">
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
              {item === "없음" ? "없음" : `[${item}]`}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 수신 대상 */}
      <div className="space-y-2">
        <Label>수신 대상</Label>
        <RadioGroup
          name="subject-receiver"
          value={receiver}
          onValueChange={(val) => setReceiver(val as SubjectReceiver)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          <RadioGroupItem id="rec-boss" value="상사">
            상사
          </RadioGroupItem>
          <RadioGroupItem id="rec-peer" value="동료">
            동료
          </RadioGroupItem>
          <RadioGroupItem id="rec-junior" value="후배">
            후배
          </RadioGroupItem>
          <RadioGroupItem id="rec-client" value="거래처">
            거래처
          </RadioGroupItem>
        </RadioGroup>
      </div>

      {/* 4. 이메일 제목 짓기 실행 단추 */}
      <Button
        type="submit"
        disabled={isLoading || !keyword.trim()}
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
            스마트한 제목 짓는 중...
          </span>
        ) : (
          "이메일 제목 짓기"
        )}
      </Button>
    </form>
  );
};
