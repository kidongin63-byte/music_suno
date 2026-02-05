# 🎵 새로운시작 (음악 가사 만들기)

AI 기술을 활용하여 나만의 특별한 음악 가사와 전문가급 AI 음악 생성 프롬프트를 만들어주는 웹 애플리케이션입니다. Suno AI나 Udio와 같은 음악 생성 도구에 최적화된 프롬프트를 제공합니다.

## ✨ 주요 기능

- **맞춤형 가사 생성**: 장르, 주제, 분위기, 스타일, 출력 언어를 선택하여 가사를 생성할 수 있습니다.
- **개인화된 이야기 반영**: 사용자가 직접 작성한 이야기나 글귀를 바탕으로 가사를 작사해줍니다.
- **Suno AI 최적화**: Suno AI에서 고품질 음악을 생성할 수 있는 `Music Style` 및 `Vocal Description` 프롬프트를 자동으로 생성합니다.
- **보이스 미리듣기**: 생성된 가사의 감성을 미리 느껴볼 수 있는 다양한 보이스 스타일의 오디오 미리듣기 기능을 제공합니다.
- **Suno 전용 텍스트 복사**: 생성된 가사와 프롬프트를 바로 사용할 수 있도록 클립보드 복사 기능을 지원합니다.

## 🛠 기술 스택

- **Frontend**: React, Vite, Tailwind CSS
- **AI Engine**: Google Gemini API
  - `gemini-3-flash-preview`: 가사 및 음악 생성 프롬프트 작사
  - `gemini-2-flash-preview-tts`: 텍스트 투 스피치(TTS) 오디오 생성
- **State Management**: React Hooks (useState, useRef)
- **Styling**: Tailwind CSS (Glassmorphism & Premium Design)

## 🚀 시작하기

### 1. 환경 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 Gemini API 키를 설정합니다.

```env
GEMINI_API_KEY=your_api_key_here
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

기본적으로 `http://localhost:3000`에서 실행됩니다.

## 📁 프로젝트 구조

- `App.tsx`: 애플리케이션의 메인 UI 및 로직
- `components/`: 재사용 가능한 UI 컴포넌트 (`InputField` 등)
- `services/`: API 호출 및 데이터 처리 로직 (`geminiService.ts`)
- `types.ts`: TypeScript 인터페이스 정의
- `vite.config.ts`: Vite 설정 및 환경 변수 주입

## 📝 라이선스

이 프로젝트는 학습 및 개인 용도로 제작되었습니다.
