# 강곽플로우 (GangGwakFlow)

강곽플로우는 캠퍼스 커뮤니티를 위한 지식 공유 및 Q&A 플랫폼입니다. 사용자는 질문을 올리고, 다른 사용자의 질문에 답변하며, 유용한 정보에 투표할 수 있습니다. AI 기반 기능을 통해 더욱 편리하게 콘텐츠를 작성하고 관련 사용자를 찾을 수 있습니다.

## 주요 기능

-   **질문 및 답변**: 사용자는 자유롭게 질문을 게시하고 다른 사용자의 질문에 답변을 작성할 수 있습니다.
-   **사용자 인증**: 이메일 기반의 간단한 로그인 및 회원가입 기능을 제공합니다.
-   **사용자 프로필**: 모든 사용자는 자신의 프로필 페이지를 가지며, 자기소개(bio)를 작성하고 수정할 수 있습니다. 프로필에서는 자신이 작성한 질문과 답변 목록을 확인할 수 있습니다.
-   **투표 시스템**: 질문과 답변에 대해 추천/비추천 투표를 하여 유용한 콘텐츠를 부각시킬 수 있습니다.
-   **알림 시스템**: 다른 사용자가 질문에서 자신을 언급(@username)하면 실시간으로 알림을 받게 됩니다.
-   **AI 사용자 추천**: 질문 본문을 기반으로, 관련성 높은 사용자를 추천받아 쉽게 언급할 수 있습니다. AI는 등록된 모든 사용자의 자기소개 정보를 분석하여 최적의 사용자를 제안합니다.
-   **사용자 언급**: 질문 작성 시 `@username` 형식으로 직접 사용자를 언급하거나, 별도의 입력 필드를 통해 여러 사용자를 동시에 언급할 수 있습니다.

## 기술 스택

-   **프론트엔드**:
    -   [Next.js](https://nextjs.org/) (App Router)
    -   [React](https://reactjs.org/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [ShadCN UI](https://ui.shadcn.com/)
-   **백엔드 및 데이터베이스**:
    -   [Firebase](https://firebase.google.com/) (Firestore)
    -   Next.js Server Actions
-   **생성형 AI**:
    -   [Genkit](https://firebase.google.com/docs/genkit)
    -   Google Gemini

## 시작하기

프로젝트를 로컬 환경에서 실행하는 방법입니다.

### 사전 준비

-   [Node.js](https://nodejs.org/) (v20 이상)
-   [Firebase Emulators](https://firebase.google.com/docs/emulator-suite) (Firestore, Auth)

### 설치

1.  프로젝트 종속성을 설치합니다.
    ```bash
    npm install
    ```

### 실행

1.  **Firebase Emulators 시작**
    터미널에서 다음 명령을 실행하여 Firebase 인증 및 Firestore 에뮬레이터를 시작합니다.
    ```bash
    firebase emulators:start
    ```

2.  **Genkit 개발 서버 실행**
    별도의 터미널에서 Genkit 개발 서버를 시작합니다. AI 기능이 이 서버를 통해 실행됩니다.
    ```bash
    npm run genkit:dev
    ```

3.  **Next.js 개발 서버 실행**
    또 다른 터미널에서 Next.js 개발 서버를 시작합니다.
    ```bash
    npm run dev
    ```

이제 브라우저에서 `http://localhost:9002` (또는 터미널에 표시된 포트)로 접속하여 애플리케이션을 확인할 수 있습니다.

## 프로젝트 구조

```
.
├── src
│   ├── app/          # Next.js App Router 페이지 및 라우팅
│   ├── actions/      # Next.js Server Actions (백엔드 로직)
│   ├── ai/           # Genkit Flows 및 Tools (AI 기능)
│   ├── components/   # 재사용 가능한 React 컴포넌트
│   ├── context/      # React Context (e.g., 인증)
│   ├── hooks/        # 커스텀 React Hooks
│   ├── lib/          # 유틸리티 함수 및 Firebase 설정
│   └── ...
├── firebase.json     # Firebase 에뮬레이터 설정
├── firestore.rules   # Firestore 보안 규칙
└── ...
```

-   `src/app`: 애플리케이션의 페이지와 레이아웃을 정의합니다.
-   `src/actions`: 서버 측 로직(데이터베이스 CRUD 등)을 처리하는 Server Actions 파일들이 위치합니다.
-   `src/ai`: Genkit을 사용한 AI 흐름(flow)과 도구(tool) 정의 파일들이 위치합니다.
-   `src/components`: UI 컴포넌트(버튼, 카드 등)와 기능별 컴포넌트(질문 폼, 답변 목록 등)가 포함됩니다.
-   `src/lib`: Firebase 초기화, 데이터 타입 정의, 공용 유틸리티 함수 등이 위치합니다.
-   `src/context`: `AuthContext`와 같이 애플리케이션 전역 상태를 관리하는 Context가 위치합니다.
