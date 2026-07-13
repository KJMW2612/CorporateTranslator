import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { GreetingResponse } from "../types";

interface GreetingResultProps {
  result: GreetingResponse | null;
}

export const GreetingResult: React.FC<GreetingResultProps> = ({ result }) => {
  const [copiedType, setCopiedType] = useState<"soft" | "formal" | null>(null);
  const { copy } = useCopyToClipboard();

  if (!result) return null;

  const handleCopy = async (text: string, type: "soft" | "formal") => {
    const success = await copy(text);
    if (success) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const renderCard = (
    title: string,
    tag: string,
    text: string,
    type: "soft" | "formal",
  ) => {
    const isCopied = copiedType === type;
    const isSoft = type === "soft";

    return (
      <div
        className={`flex flex-col rounded-xl border overflow-hidden shadow-sm animate-slide-up-fade ${
          isSoft
            ? "border-blue-100 dark:border-blue-950/40 bg-white dark:bg-slate-950"
            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
        }`}
      >
        <div
          className={`flex justify-between items-center px-4 py-3 border-b ${
            isSoft
              ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-950/30"
              : "bg-slate-50/80 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50"
          }`}
        >
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
              isSoft
                ? "bg-blue-100/60 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300"
                : "bg-slate-200/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-300"
            }`}
          >
            {tag}
          </span>
          <Button
            variant="ghost"
            onClick={() => handleCopy(text, type)}
            className="flex items-center gap-1.5 text-xs h-8 px-2.5 cursor-pointer text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {isCopied ? "복사 완료" : "복사"}
          </Button>
        </div>
        <div className="p-4 flex-1">
          <pre className="whitespace-pre-wrap break-keep font-sans text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {text}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 space-y-6">
      {/* 요구사항 텍스트 반영: 추천 인사말 */}
      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
        추천 인사말
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderCard("부드럽게", "😊 부드러운 인사말", result.softText, "soft")}
        {renderCard(
          "격식있게",
          "💼 격식있는 인사말",
          result.formalText,
          "formal",
        )}
      </div>
    </div>
  );
};
