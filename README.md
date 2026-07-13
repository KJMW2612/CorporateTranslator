# 🥤 회사어 번역기 (Office Speak AI Translator Platform)

> **직관적이고 거친 구어체 초안을 직장 상황 및 수신 대상에 최적화된 정중하고 명확한 비즈니스 서식(회사어)으로 자동 번역해 주는 인공지능 오피스 소통 가이드 플랫폼입니다.**


<img width="180" height="180" alt="회사어아이콘" src="https://github.com/user-attachments/assets/d542738b-207f-4654-93d0-f283fa1bef82" />

배포 주소: [https://회사어.kr](https://회사어.kr)


---

## 🌟 제공 도구 및 실무 사용 방법 (Core Business Tools Guide)

### 1. 회사어 번역기 (Main)
직장 상사나 동료에게 보낼 날것의 날카롭거나 편안한 구어체 초안을 오피스용 비즈니스 말투로 번역합니다.

*   **사용 방법**:
    1.  **초안 작성**: 원문 입력창에 평소 본인의 생각이나 날것의 피드백을 적습니다. 
        *   *(💡 팁: 상단 해시태그 버튼 `#보고`, `#요청`, `#지연` 등을 누르면 리얼하고 재미있는 상황별 예시 구어체 문장이 자동으로 무작위 순환 입력되어 즉시 테스트할 수 있습니다.)*
    2.  **수신 대상 및 전달 수단 선택**: 수신 대상(`상사`, `동료`, `후배`, `거래처`)과 발송 채널(`사내 메신저`, `이메일`, `보고서`)을 상황에 맞게 콕 집어 선택합니다.
    3.  **번역하기**: 파란색 `번역하기` 버튼을 누릅니다.
    4.  **결과물 출력**: AI가 매체별 특수 서식을 완벽하게 가미해 `😊 부드러운 회사어`와 `💼 격식있는 회사어` 2가지 버전을 출력합니다.
        *   *(💡 메일 선택 시 제목/인사/서명이 다 들어간 이메일 양식으로 출력되며, 보고서 선택 시 대화체가 완전히 배제된 개조식 요약 양식으로 정확히 출력됩니다.)*

### 2. 이메일 제목 짓기 (New)
업무 메일 발송 전, 메일함에서 한눈에 수신인의 이목을 장악하고 가시성을 높여주는 세련된 메일 제목을 작성합니다.

*   **사용 방법**:
    1.  **안건 입력**: 메일로 보낼 핵심 내용 키워드(예: `7월 부서 정산서 누락 내역 공유`)를 한 줄 입력합니다.
        *   *(💡 팁: 번역 페이지에서 '이메일'을 선택해 번역을 완료하면, 번역 버튼 바로 밑에 전용 유도 배너가 활성화됩니다. 이를 클릭해 넘어오면 방금 번역에 사용한 원문 텍스트가 안건 입력창에 자동으로 자동 기입됩니다.)*
    2.  **머리말 및 대상 지정**: 메일의 목적 태그(`없음`, `보고`, `요청` 등)와 수신 대상(`상사`, `동료`, `후배`, `거래처`)을 탭하여 선택합니다.
    3.  **제목 짓기**: `이메일 제목 짓기` 버튼을 누릅니다.
    4.  **결과물 출력**: AI가 `📌 직관 명료 스타일`, `🤝 정중 격식 스타일`, `⏰ 기한 강조 스타일` 3가지 버전을 출력합니다

### 3. 인사말 작성 (New)
계절, 명절, 날씨, 상황별 오프닝 인사 및 정중한 아웃트로 맺음말을 조립합니다.

*   **사용 방법**:
    1.  **세부 안건 입력(선택)**: 인사말 속에 긴밀하게 결합하고 싶은 구체적인 행사명이나 안건(예: `상반기 경영 성과 공유회`)이 있다면 가볍게 키워드로 입력해 둡니다.
    2.  **참고 정보 선택**: 반영하고 싶은 참고 정보 카드(**`📅 날짜`**, **`⏰ 시간대`**, **`☀️ 날씨`**)를 터치해 파란색 테두리로 활성화해 줍니다. 
        *   *(💡 팁: 계절과 명절 전후 D-Day를 자동으로 연산하여 관련 정보를 참고합니다.)*
    3.  **세부 조건 선택**: 인사말 분류(`시작 인사`/`마무리 인사`), 목적, 대상, 상황, 희망 분량(`짧게`/`보통`/`길게`)을 맞춤형 탭으로 골라줍니다.
    4.  **인사말 작성**: `인사말 작성하기` 버튼을 누릅니다.
    5.  **결과물 출력**: AI가 , `😊 부드러운 인사말`과 `💼 격식있는 인사말`을 2가지 버전을 출력해 줍니다. 

---

## 🛠️ 사용 기술 스택 (Tech Stack)

- **Frontend**: React, Next.js (App Router), TypeScript, Tailwind CSS
- **AI Core**: OpenAI API (`gpt-4o-mini` model)
- **Styling / Components**: Tailwind CSS, shadcn/ui 기반 커스텀 리액트 컴포넌트 셋
- **Deployment**: Vercel CI/CD

---
## ⚙️ 환경 변수 설정 (Environment Variables)
프로젝트 로컬 최상단 루트에 .env.local 파일을 생성하여 다음과 같이 환경 변수를 채워 넣으십시오. (Vercel 배포 시에는 Vercel Settings 대시보드에서 등록해 주시면 됩니다.)

```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
OPENAI_MODEL_NAME=gpt-4o-mini
```
---

## 💻 로컬 개발 서버 실행 방법 (How to Run Locally)
저장소 클론 및 패키지 설치
```Bash
git clone https://github.com/your-username/corporate-translator.git
cd corporate-translator
npm install
```
개발 환경 가동
```Bash
npm run dev
```
이후 브라우저에서 http://localhost:3000에 접속합니다.
프로덕션 빌드 및 최적화 검사
```Bash
npm run build
```

---

## 📂 프로젝트 구조 (Folder Structure)

```text
src/
├── app/
│   ├── api/
│   │   ├── translate/
│   │   │   └── route.ts     # 본문 말투 변환 API (force-dynamic 및 지연초기화)
│   │   ├── subject/
│   │   │   └── route.ts     # 이메일 제목 짓기 API (force-dynamic 및 지연초기화)
│   │   └── greeting/
│   │       └── route.ts     # 인사말 작성 API (무제한 음력 추적 및 4대 압축 엔진 탑재)
│   ├── subject-generator/
│   │   └── page.tsx         # 이메일 제목 짓기 페이지 라우트
│   ├── greeting-generator/
│   │   └── page.tsx         # 인사말 작성 페이지 라우트
│   ├── globals.css          # Tailwind CSS v4 스타일링 설정 및 물리 애니메이션 탑재
│   ├── layout.tsx           # 전역 레이아웃 및 구글 애드센스 Script 탑재
│   └── page.tsx             # 홈 스크린 (메신저 1:1 대조 예문 슬라이드 가동부)
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # 상단 글로벌 바 (설정 기반 동적 NEW 알림 뱃지 탑재)
│   │   └── Footer.tsx       # 피드백 이메일/인스타 복사 및 카카오 송금 모달 구현부
│   └── ui/                     # 공용 UI 디자인 요소
│       ├── button.tsx
│       ├── card.tsx
│       ├── label.tsx
│       ├── radio-group.tsx  # strict type-safe cloned elements
│       └── textarea.tsx
├── features/                   # 도메인 주도 격리형 피처 폴더
│   ├── shared-tools/
│   │   └── config.ts        # 모든 비즈니스 툴 정보를 관장하는 플랫폼 중앙 장부 (OCP 준수)
│   ├── translator/             # 번역기 피처 소스 코드
│   │   ├── components/
│   │   │   ├── TranslatorContainer.tsx
│   │   │   ├── TranslatorForm.tsx
│   │   │   └── TranslatorResult.tsx
│   │   ├── api.ts
│   │   └── types.ts
│   ├── subject-generator/       # 신규 이메일 제목 짓기 피처 소스 코드
│   │   ├── components/
│   │   │   ├── SubjectContainer.tsx
│   │   │   ├── SubjectForm.tsx
│   │   │   └── SubjectResult.tsx
│   │   ├── api.ts
│   │   └── types.ts
│   └── greeting-generator/      # 신규 인사말 작성 피처 소스 코드
│       ├── components/
│       │   ├── GreetingContainer.tsx
│       │   ├── GreetingForm.tsx
│       │   └── GreetingResult.tsx
│       └── types.ts
├── hooks/
│   └── use-copy-to-clipboard.ts # 클립보드 복사 커스텀 훅
└── lib/
    ├── rate-limiter/        # 상용 수준의 어뷰징 방지 패키지
    │   ├── config.ts
    │   ├── identifier.ts
    │   ├── logger.ts
    │   ├── store.ts
    │   └── index.ts
    └── utils.ts
public/                      # 정적 리소스 디렉토리
├── kakaopay-qr.png          # 후원용 개인 QR 이미지
├── robots.txt               # 검색 크롤러 표준 인덱싱 지침서
└── ads.txt                  # 애드센스 판매자 신원 보안 검증 파일
```

