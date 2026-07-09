export interface ToolItem {
  id: string;
  name: string; // 도구의 정식 명칭 (예: 이메일 제목 생성기)
  label: string; // 네비게이션 탭용 짧은 이름 (예: 제목 생성기)
  description: string; // 카드 하단 가이드 문구
  ctaText: string; // 유도 배너에 띄워줄 홍보 클릭 문구
  path: string; // 서비스 주소 경로
}

export const BUSINESS_TOOLS: ToolItem[] = [
  {
    id: "translator",
    name: "회사어 번역기",
    label: "회사어 번역",
    description: "상황에 맞춰 말투를 다듬어주는 비즈니스 번역기",
    ctaText: "나에게 어울리는 격식 있는 본문 변환하러 가기 ➔",
    path: "/",
  },
  {
    id: "subject-generator",
    name: "이메일 제목 생성기",
    label: "이메일 제목 짓기",
    description: "안건 키워드로 최적의 메일 제목 3종 세트 조립",
    ctaText: "1초 만에 스마트한 이메일 제목 지으러 가기 ➔",
    path: "/subject-generator",
  },
  // 💡 [확장 예시] 향후 새로운 툴을 얹고 싶을 때, 아래 주석처럼 등록하기만 하면 즉시 적용됩니다.
  /*
  {
    id: "apology-generator",
    name: "사과문 작성기",
    label: "사과문 메이커",
    description: "실수를 예의 있고 완벽하게 수습하는 오피스 사과문 생성기",
    ctaText: "프로페셔널하게 오해 없이 사과하는 기안서 작성 ➔",
    path: "/apology-generator",
  }
  */
];
