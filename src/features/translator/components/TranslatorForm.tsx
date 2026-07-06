import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { TargetAudience, DeliveryChannel, TranslationRequest } from "../types";

interface TranslatorFormProps {
  onSubmit: (data: TranslationRequest) => void;
  isLoading: boolean;
}

const PRESET_TEMPLATES: Record<string, string[]> = {
  보고: [
    "이번 프로젝트 매출이랑 피드백 정리한 거 다 끝났어요. 파일 보낼 테니까 검토 부탁해요.",
    "오늘 마케팅 회의한 내용 대충 요약해 봤는데 흐름 맞는지 한 번 봐주세요.",
    "지난번에 지시하신 신규 계약 건 진행 상황입니다. 큰 문제 없이 순조롭게 잘 흘러가고 있어요.",
  ],
  요청: [
    "다음 주에 발표 때 쓸 자료 디자인이 좀 촌스러운데 예쁘게 고쳐주실 수 있나요?",
    "이거 보고서 올린 지 좀 됐는데 컨펌 언제쯤 날까요? 피드백 좀 빨리 주세요.",
    "이번 달 정산 처리해야 해서 필요한 영수증이랑 내역 좀 빨리 취합해 주라.",
  ],
  일정: [
    "우리 다음 주 화요일 오후에 잠깐 만나서 얘기할까요? 편한 시간 있으면 먼저 알려줘요.",
    "갑자기 다른 급한 일정이 생겨서 목요일 회의는 다음 주로 미뤄야 할 것 같아요.",
    "내일 외부 세미나 참석해야 해서 오전에는 자리에 없을 예정이니 연락은 메신저로 주세요.",
  ],
  지연: [
    "죄송한데 거래처에서 자료 전달을 늦게 해줘서 이거 오늘 퇴근 전까지는 절대 못 끝냅니다.",
    "네트워크 쪽에 에러가 터져서 이거 복구하느라 원래 기한보다 한 이틀만 더 주셔야 할 것 같아요.",
    "비가 너무 많이 와서 차가 밀리는 바람에 원래 약속 시간보다 15분 정도 늦게 도착할 것 같습니다.",
  ],
  사과: [
    "아, 제가 메일을 다른 사람이랑 착각하고 잘못 보냈네요. 헷갈리게 해드려서 죄송합니다.",
    "지난번 회의 때 말씀해 주신 피드백 사항을 실수로 놓쳤네요. 제 불찰입니다.",
    "제 실수로 이번 정산 금액 계산이 꼬였어요. 바로 다시 계산해서 빠르게 전달해 드릴게요.",
  ],
  감사: [
    "이거 되게 귀찮고 까다로운 업무였는데 군말 없이 대신 처리해 주셔서 진짜 고마워요.",
    "지난 주말에 급하게 연락드렸는데도 친절하게 답변해 주시고 업무 도와주셔서 정말 감동이었습니다.",
    "풀기 힘든 과제였는데 고비 때마다 피드백 잘 주셔서 덕분에 무사히 끝났어요. 감사합니다!",
  ],
  협업: [
    "이번 분기 신규 서비스 기획과 관련해서 상호 의견 교환하는 브레인스토밍 회의 같이 합시다.",
    "그쪽 부서에서 모아둔 고객 데이터 파일 우리 마케팅 팀도 볼 수 있게 공유해 줄 수 있어요?",
    "다음 달에 있을 외부 콜라보 프로젝트 역할 분담 어떻게 쪼갤지 조만간 미팅 한 번 하죠.",
  ],
};

export const TranslatorForm: React.FC<TranslatorFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [text, setText] = React.useState("");
  const [target, setTarget] = React.useState<TargetAudience>("상사");
  const [channel, setChannel] = React.useState<DeliveryChannel>("사내 메신저");

  // 각 프리셋 버튼의 현재 순환 인덱스를 기록하는 상태
  const [presetIndices, setPresetIndices] = React.useState<
    Record<string, number>
  >({
    보고: 0,
    요청: 0,
    일정: 0,
    지연: 0,
    사과: 0,
    감사: 0,
    협업: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSubmit({ text, target, channel });
  };

  /**
   * 예문 버튼을 누를 때마다 예문이 순환하며 변경되도록 상태 제어
   */
  const handlePresetClick = (key: string) => {
    const templates = PRESET_TEMPLATES[key];
    if (!templates || templates.length === 0) return;

    const currentIndex = presetIndices[key] ?? 0;
    setText(templates[currentIndex]);

    setPresetIndices((prev) => ({
      ...prev,
      [key]: (currentIndex + 1) % templates.length,
    }));
  };

  /**
   * 입력창의 내용을 전부 삭제하는 클리어 함수
   */
  const handleClear = () => {
    setText("");
  };

  const maxChars = 1000;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. 원문 입력 (상단에 예문 버튼 추가) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="source-text">원문 입력</Label>
          <span className="text-xs text-slate-400">
            {text.length} / {maxChars}자
          </span>
        </div>

        {/* 예문 선택 버튼 및 비우기 버튼 라인 */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1 w-full">
          {Object.keys(PRESET_TEMPLATES).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handlePresetClick(key)}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 active:bg-slate-100 disabled:opacity-50 transition-colors dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-400"
            >
              #{key}
            </button>
          ))}

          {/* ◀ 가장 우측 정렬되는 비우기 버튼 (ml-auto 속성 사용) ▶ */}
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 active:bg-red-100 dark:active:bg-red-900/30 transition-colors shrink-0 ml-auto flex items-center gap-1"
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

        <Textarea
          id="source-text"
          placeholder="변환하고 싶은 편안하거나 직관적인 원문을 입력해 보세요. 위의 예문 버튼을 눌러 빠르게 시작할 수도 있습니다."
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          maxLength={maxChars}
          disabled={isLoading}
          required
        />

        {/* ⚠️ 경고 및 책임 면제 안내 문구 */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-start gap-1 mt-1.5 break-keep leading-normal">
          <span className="shrink-0 text-amber-500">⚠️</span>
          <span>
            개인정보, 주민등록번호, 계좌번호 또는 사내 기밀 등 민감한 데이터는
            입력하지 않도록 각별히 주의해 주세요. 입력되거나 처리된 데이터의
            임의 보관, 유실 및 유출에 대해 어떠한 법적 책임도 지지 않습니다.
          </span>
        </p>
      </div>

      {/* 2. 대상 선택 */}
      <div className="space-y-2">
        <Label>수신 대상</Label>
        <RadioGroup
          name="target-audience"
          value={target}
          onValueChange={(val) => setTarget(val as TargetAudience)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          <RadioGroupItem id="target-boss" value="상사">
            상사
          </RadioGroupItem>
          <RadioGroupItem id="target-peer" value="동료">
            동료
          </RadioGroupItem>
          <RadioGroupItem id="target-junior" value="후배">
            후배
          </RadioGroupItem>
          <RadioGroupItem id="target-client" value="거래처">
            거래처
          </RadioGroupItem>
        </RadioGroup>
      </div>

      {/* 3. 전달 수단 선택 */}
      <div className="space-y-2">
        <Label>전달 수단</Label>
        <RadioGroup
          name="delivery-channel"
          value={channel}
          onValueChange={(val) => setChannel(val as DeliveryChannel)}
          className="grid grid-cols-3 gap-2"
        >
          <RadioGroupItem id="channel-messenger" value="사내 메신저">
            사내 메신저
          </RadioGroupItem>
          <RadioGroupItem id="channel-email" value="이메일">
            이메일
          </RadioGroupItem>
          <RadioGroupItem id="channel-report" value="보고서">
            보고서
          </RadioGroupItem>
        </RadioGroup>
      </div>

      {/* 4. 변환 버튼 */}
      <Button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full text-base font-semibold py-6 bg-blue-600 hover:bg-blue-700"
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
            비즈니스 말투로 번역 중...
          </span>
        ) : (
          "번역하기"
        )}
      </Button>
    </form>
  );
};
