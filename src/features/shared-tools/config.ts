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
    ctaText: "나에게 어울리는 격식 있는 본문 반역하러 가기 ➔",
    path: "/",
  },
  {
    id: "subject-generator",
    name: "이메일 제목 생성기",
    label: "이메일 제목 짓기",
    description: "안건 키워드로 최적의 메일 제목 3종 세트 조립",
    ctaText: "3초 만에 스마트한 이메일 제목 지으러 가기 ➔",
    path: "/subject-generator",
  },
  {
    id: "greeting-generator",
    name: "인사말 작성",
    label: "인사말 작성",
    description: "날씨, 상황별 오프닝 및 마감 인사말 다차원 조립",
    ctaText: "부드럽고 품격 있는 계절별 인사말 조립하러 가기 ➔",
    path: "/greeting-generator",
  },
];
