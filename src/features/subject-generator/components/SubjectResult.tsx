import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { SubjectResponse } from "../types";

interface SubjectResultProps {
  result: SubjectResponse | null;
}

export const SubjectResult: React.FC<SubjectResultProps> = ({ result }) => {
  const [copiedType, setCopiedType] = useState<
    "direct" | "polite" | "deadline" | null
  >(null);
  const { copy } = useCopyToClipboard();

  if (!result) return null;

  const handleCopy = async (
    text: string,
    type: "direct" | "polite" | "deadline",
  ) => {
    const success = await copy(text);
    if (success) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const renderCard = (
    title: string,
    text: string,
    type: "direct" | "polite" | "deadline",
  ) => {
    const isCopied = copiedType === type;
    return (
      <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm animate-slide-up-fade">
        <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30 px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-800/50">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-300">
            {title}
          </span>
          <Button
            variant="ghost"
            onClick={() => handleCopy(text, type)}
            className="flex items-center gap-1 text-[11px] h-7 px-2.5 cursor-pointer text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {isCopied ? "복사 완료" : "복사"}
          </Button>
        </div>
        <div className="p-4 flex-1">
          <pre className="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans break-keep leading-relaxed select-all">
            {text}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 space-y-4">
      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
        추천 이메일 제목
      </h4>
      <div className="grid grid-cols-1 gap-4">
        {/* 요청 사양에 맞춰 스타일 문구들을 심플하게 축약했습니다. */}
        {renderCard("📌 직관 명료 스타일", result.direct, "direct")}
        {renderCard("🤝 정중 격식 스타일", result.polite, "polite")}
        {renderCard("⏰ 기한 강조 스타일", result.deadline, "deadline")}
      </div>
    </div>
  );
};
