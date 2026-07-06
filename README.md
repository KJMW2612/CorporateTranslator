# 🥤 회사어 번역기 (Office Speak AI Translator)

> **직관적이고 편안한 구어체 초안을 격식 있고 완벽한 회사 환경 비즈니스 서식(회사어)으로 자동 번역해 주는 인공지능 오피스 웹 서비스입니다.**

배포 주소: [https://회사어.kr](https://회사어.kr)

---

## 🌟 주요 특징 (Key Features)

- **AI 맞춤형 다차원 번역 (Context-aware Translation)**
  - **수신 대상 세분화**: 상사, 동료, 후배, 거래처 맞춤형 존칭 제어
  - **전달 수단 구조화**: 사내 메신저(실시간 소통), 이메일(제목/안부/본문/서명 포맷 고수), 보고서(■ 개요/주요내용/향후계획 등 문어체 개조식 포맷 의무화)
- **리얼 직장인 구어체 프리셋 (Conversational Presets)**
  - 실무에서 자주 쓰이는 7대 안건(보고, 요청, 일정, 지연, 사과, 감사, 협업)에 대해 각각 3개씩, 총 21개의 엄선된 현실 구어체 예문 탑재
  - 동일 태그 버튼 연속 클릭 시 3개의 예문이 순서대로 순환(Cycle) 토글되는 상태 제어 방식으로 Deterministic하고 안전한 무작위 변환 경험 선사
- **개인정보 보호 및 보안 지향 설계 (Privacy & Security)**
  - 원문에 계좌번호, 이메일, 전화번호, 주민등록번호가 감지될 시 자동으로 `[마스킹]` 처리하는 보안 정규식 탑재
  - Vercel 환경 변수 통제 및 OpenAI API Key 배포 가상화로 GitHub 공개 저장소 업로드 시 키 유출 원천 차단
- **독자적인 레이트 리미터 구축 (Custom High-End Rate Limiter)**
  - **동시성 락 (Concurrency Lock)**: 1인당 동시 요청은 무조건 1개만 허용 (429 Too Many Requests 반환)
  - **IP & Session 다중 식별기**: Next.js 15+ 스펙에 준하여 `req.ip` 타입 에러 없이 `x-forwarded-for` 프록시를 통해 정확히 유저 트래픽 가중치 감지
  - **분당 트래픽 통제 (RPM)**: 최근 1분 내 20회 초과 시 30초 강제 차단
  - **도배 및 매크로 탐지**: 동일 입력값 해싱(SHA-256) 비교를 통해 30초 내 5회 중복 입력 시 일시 차단
  - **단문 스팸 차단**: 3글자 미만의 무의미한 짧은 글 반복 입력 탐지 및 차단
- **풍부한 인터랙션 및 편의 기능**
  - **원문 비우기**: 원문 전체를 손쉽게 초기화할 수 있는 깔끔한 비우기 기능
  - **이메일 직접 피드백**: Tally/Google Forms 등 외부 도구 의존성 없이 React 내장형 모달 팝업으로 이메일 복사 기능 지원
  - **카카오페이 송금 연동**: 개인 정보(계좌/전화번호)가 보장되는 평생 고정식 간편 QR 송금 레이어 팝업 탑재
  - **애드센스 친화적(AdSense-Ready)**: 구글 애드센스 승인을 위한 표준 `robots.txt`, `ads.txt` 정적 서빙 및 UI 비침해식 레이아웃 보장

---

## 🛠️ 사용 기술 스택 (Tech Stack)

- **Frontend**: React, Next.js (App Router), TypeScript, Tailwind CSS
- **AI Core**: OpenAI API (`gpt-4o-mini` model)
- **Styling / Components**: Tailwind CSS, shadcn/ui 기반 커스텀 리액트 컴포넌트 셋
- **Deployment**: Vercel CI/CD

---

## 📂 프로젝트 구조 (Folder Structure)

```text
src/
├── app/
│   ├── api/
│   │   └── translate/
│   │       └── route.ts     # 비즈니스 로직 조립 및 AI 처리 엔드포인트
│   ├── globals.css          # Tailwind CSS v4 스타일링 설정
│   ├── layout.tsx           # 전역 레이아웃 및 구글 애드센스 탑재
│   ├── page.tsx             # 홈 스크린 마운트 및 SEO
│   └── robots.ts            # 검색 엔진 노출 정책 빌더
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # 상단 글로벌 바
│   │   └── Footer.tsx       # 피드백 메일 복사 / 카카오 송금 모달 구현부
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── label.tsx
│       ├── radio-group.tsx  # strict type-safe cloned elements
│       └── textarea.tsx
├── features/
│   └── translator/
│       ├── components/
│       │   ├── TranslatorContainer.tsx # 로딩, 에러, 변환 결합 코어
│       │   ├── TranslatorForm.tsx      # 프리셋, 비우기, 라디오 폼 가공
│       │   └── TranslatorResult.tsx    # 부드럽게 / 격식있게 이중 카드 및 복사
│       ├── api.ts           # 클라이언트 전송 요청 바인딩
│       └── types.ts         # 도메인 정밀 데이터 모델 정의
├── hooks/
│   └── use-copy-to-clipboard.ts # 클립보드 복사 전용 가치 훅
└── lib/
    ├── rate-limiter/        # 상용 수준의 동시성 어뷰징 방지 패키지
    │   ├── config.ts
    │   ├── identifier.ts
    │   ├── logger.ts
    │   ├── store.ts
    │   └── index.ts
    └── utils.ts
public/                      # 정적 서빙용 폴더
├── kakaopay-qr.png          # 후원용 개인 QR 이미지
├── robots.txt               # 구글 봇 로봇 색인 가이드
└── ads.txt                  # 애드센스 판매자 신원 보안 검증 파일
```
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
## 🔒 라이선스 및 면책 사항 (License & Disclaimer)
- **License**: MIT License
- **Disclaimer**: 본 서비스에서 변환 및 출력되는 결과 데이터는 사용자가 선택적으로 차용해야 하는 비즈니스 참고 가이드일 뿐입니다. 사내 중요 소통이나 거래처 관련 비즈니스 메일 발송 전, 최종 전송 여부에 대한 검증 책임은 사용자 본인에게 있습니다.
