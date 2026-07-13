import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { TranslationResponse } from "../types";

interface TranslatorResultProps {
  result: TranslationResponse | null;
}

export const TranslatorResult: React.FC<TranslatorResultProps> = ({
  result,
}) => {
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

  const renderCopyButton = (text: string, type: "soft" | "formal") => {
    const isCopied = copiedType === type;
    return (
      <Button
        variant="outline"
        onClick={() => handleCopy(text, type)}
        className="flex items-center gap-1.5 text-xs h-8 px-2.5"
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
            <span>복사 완료</span>
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
      </Button>
    );
  };

  return (
    <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 space-y-6">
      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
        비즈니스 말투 번역 결과
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. 부드럽게 (Soft) */}
        <div className="flex flex-col rounded-xl border border-blue-100 dark:border-blue-950/40 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
          <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-950/20 px-4 py-3 border-b border-blue-100/50 dark:border-blue-950/30">
            <span className="inline-flex items-center rounded-full bg-blue-100/60 dark:bg-blue-900/40 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300">
              😊 부드러운 말투
            </span>
            {renderCopyButton(result.softText, "soft")}
          </div>
          <div className="p-4 flex-1">
            {/* Tailwind 해결: 중복/충돌되던 break-all을 완벽히 지우고 break-keep만 유지 */}
            <pre className="whitespace-pre-wrap break-keep font-sans text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {result.softText}
            </pre>
          </div>
        </div>

        {/* 2. 격식있게 (Formal) */}
        <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
          <div className="flex justify-between items-center bg-slate-50/80 dark:bg-slate-900/30 px-4 py-3 border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="inline-flex items-center rounded-full bg-slate-200/80 dark:bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-300">
              💼 격식있는 말투
            </span>
            {renderCopyButton(result.formalText, "formal")}
          </div>
          <div className="p-4 flex-1">
            {/* Tailwind 해결: 중복/충돌되던 break-all을 완벽히 지우고 break-keep만 유지 */}
            <pre className="whitespace-pre-wrap break-keep font-sans text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {result.formalText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
