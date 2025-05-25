# 🎨 SSAFY News Frontend

AI 기반 뉴스 큐레이션 플랫폼의 Vue.js 프론트엔드

## 📋 개요

**SSAFY News Frontend**는 Vue 3 + TypeScript + Tailwind CSS를 기반으로 한 현대적인 SPA(Single Page Application)입니다. AI 기반 뉴스 추천, 실시간 검색, 개인 대시보드, AI 챗봇 등 풍부한 사용자 경험을 제공합니다.

### 🎯 주요 특징
- **반응형 디자인**: 모바일 퍼스트 접근법
- **실시간 상호작용**: 한글 자모 단위 자동완성, 실시간 검색
- **AI 챗봇**: 플로팅 챗봇으로 3가지 모드 지원
- **개인화 대시보드**: Chart.js 기반 데이터 시각화
- **현대적 UI**: shadcn-vue 컴포넌트 시스템

---

## 🛠️ 기술 스택

### 핵심 프레임워크
- **Vue 3.5.13**: Composition API 기반
- **TypeScript**: 타입 안전성 보장
- **Vite 6.3.5**: 빠른 개발 서버 및 빌드

### UI & 스타일링
- **Tailwind CSS 4.1.6**: 유틸리티 퍼스트 CSS
- **shadcn-vue (reka-ui 2.2.1)**: 재사용 가능한 컴포넌트
- **Lucide Vue Next 0.510.0**: 아이콘 라이브러리

### 상태 관리 & 라우팅
- **Pinia 3.0.2**: Vue 공식 상태 관리
- **Vue Router 4.5.1**: SPA 라우팅

### 데이터 시각화 & HTTP
- **Chart.js 4.4.9**: 차트 라이브러리
- **vue-chartjs 5.3.2**: Vue Chart.js 래퍼
- **Axios 1.9.0**: HTTP 클라이언트

### 개발 도구
- **@vueuse/core 13.2.0**: Vue 컴포지션 유틸리티
- **class-variance-authority**: 조건부 클래스 관리

---

## 📁 프로젝트 구조

```
src/
├── components/                 # 재사용 가능한 컴포넌트
│   ├── ui/                    # shadcn-vue 기본 컴포넌트
│   ├── dashboard/             # 대시보드 전용 컴포넌트
│   │   ├── CategoryDonutChart.vue      # 카테고리 도넛 차트
│   │   ├── KeywordBarChart.vue         # 키워드 막대 차트
│   │   ├── WeeklyLineChart.vue         # 주간 소비량 라인 차트
│   │   └── LikedNewsBoard.vue          # 좋아요 기사 목록
│   ├── detail/                # 상세 페이지 전용 컴포넌트
│   │   ├── DetailArticle.vue          # 기사 본문 및 좋아요
│   │   ├── CommentBox.vue             # 댓글 시스템
│   │   └── SimilarArticleList.vue     # 유사 기사 목록
│   ├── ArticleCard.vue        # 기사 카드 (전체 통일)
│   ├── Header.vue             # 네비게이션 헤더
│   ├── FilterBar.vue          # 카테고리/정렬 필터
│   ├── NewsBoard.vue          # 뉴스 목록 보드
│   └── Chatbot.vue            # AI 챗봇 (플로팅)
├── views/                     # 페이지 컴포넌트
│   ├── HomeView.vue           # 메인 뉴스 큐레이션
│   ├── SearchView.vue         # 검색 결과 페이지
│   ├── DetailView.vue         # 기사 상세 페이지
│   ├── DashboardView.vue      # 개인 분석 대시보드
│   └── LoginView.vue          # 로그인/회원가입
├── stores/                    # Pinia 상태 관리
│   └── news.ts               # 뉴스 관련 상태
├── router/                    # Vue Router 설정
│   └── index.ts              # 라우팅 구성
├── lib/                       # 유틸리티 및 설정
│   └── utils.ts              # shadcn-vue 유틸리티
├── assets/                    # 정적 자산
└── main.ts                    # 앱 진입점
```

---

## 🖼️ 주요 화면 구성

### 1. 🏠 HomeView.vue - 메인 뉴스 큐레이션

```vue
<template>
  <div class="min-h-screen bg-muted">
    <Header />
    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- 필터링 섹션 -->
      <FilterBar 
        :categories="categories"
        :selected-category="selectedCategory"
        :sort-option="sortOption"
        @category-change="handleCategoryChange"
        @sort-change="handleSortChange"
      />
      
      <!-- 뉴스 목록 -->
      <NewsBoard 
        :articles="articles"
        :loading="loading"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
    
    <!-- AI 챗봇 -->
    <Chatbot />
  </div>
</template>
```

**주요 기능**:
- **개인 맞춤 추천**: 로그인시 AI 기반 추천 활성화
- **카테고리 필터**: 17개 뉴스 카테고리 선택
- **정렬 옵션**: 최신순, 인기순, 추천순
- **무한 스크롤**: 페이지네이션 또는 무한 로딩

### 2. 🔍 SearchView.vue - 지능형 검색

```vue
<template>
  <div class="search-container">
    <!-- 검색 인풋 -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="handleSearchInput"
        @compositionstart="isComposing = true"
        @compositionend="handleCompositionEnd"
        placeholder="뉴스를 검색해보세요..."
        class="w-full p-4 text-lg border rounded-xl"
      />
      
      <!-- 자동완성 드롭다운 -->
      <div v-if="showSuggestions" class="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-50">
        <div v-for="suggestion in suggestions" :key="suggestion"
             @click="selectSuggestion(suggestion)"
             class="p-3 hover:bg-gray-50 cursor-pointer">
          {{ suggestion }}
        </div>
      </div>
    </div>
    
    <!-- 검색 결과 -->
    <SearchResults :articles="searchResults" :query="searchQuery" />
  </div>
</template>
```

**특별한 기능**:
- **한글 자모 지원**: "ㅅ", "ㅅㅏ", "ㅅㅏㄱ" 점진적 입력
- **IME 처리**: compositionstart/end 이벤트로 한글 입력 완성 대기
- **디바운스**: 100ms 지연으로 API 호출 최적화
- **인기 검색어**: 빈 검색창 클릭시 15개 추천어 표시

### 3. 📖 DetailView.vue - 3단 구성 상세 페이지

```vue
<template>
  <div class="min-h-screen bg-muted">
    <Header />
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- 좌측: 기사 본문 + 댓글 (7/12) -->
        <div class="md:col-span-7 space-y-6">
          <DetailArticle 
            :article="article"
            :is-liked="isLiked"
            :like-count="likeCount"
            @toggle-like="handleToggleLike"
          />
          
          <CommentBox 
            :news-id="newsId"
            :comments="comments"
            @comment-added="handleCommentAdded"
          />
        </div>
        
        <!-- 우측: 유사 기사 (5/12) -->
        <div class="md:col-span-5">
          <SimilarArticleList :articles="similarArticles" />
        </div>
      </div>
    </div>
    
    <Chatbot />
  </div>
</template>
```

**레이아웃 특징**:
```
┌─────────────────┬─────────────┐
│  DetailArticle  │             │
│   (기사 본문)    │ Similar     │
│   - 제목/작성자   │ Articles    │
│   - 본문 내용    │ (유사 기사)  │
│   - 좋아요 버튼   │ - 5개 추천   │
├─────────────────┤ - 썸네일    │
│   CommentBox    │ - 제목/요약  │
│   (댓글 시스템)   │             │
│   - 댓글 작성    │             │
│   - 댓글 목록    │             │
└─────────────────┴─────────────┘
```

### 4. 📊 DashboardView.vue - 개인 분석 대시보드

```vue
<template>
  <div class="dashboard-grid">
    <!-- 관심 카테고리 도넛 차트 -->
    <div class="bg-white border rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold mb-4">관심 카테고리</h3>
      <div class="h-[300px] overflow-hidden">
        <CategoryDonutChart :data="categoryData" />
      </div>
    </div>
    
    <!-- 주요 키워드 막대 차트 -->
    <div class="bg-white border rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold mb-4">주요 키워드</h3>
      <div class="h-[300px] overflow-hidden">
        <KeywordBarChart :data="keywordData" />
      </div>
    </div>
    
    <!-- 주간 소비량 라인 차트 -->
    <div class="bg-white border rounded-xl shadow-sm p-6 col-span-2">
      <h3 class="text-lg font-semibold mb-4">주간 기사 소비량</h3>
      <div class="h-[300px] overflow-hidden">
        <WeeklyLineChart :data="weeklyData" />
      </div>
    </div>
    
    <!-- 좋아요한 기사 목록 -->
    <div class="bg-white border rounded-xl shadow-sm p-6 col-span-2">
      <h3 class="text-lg font-semibold mb-4">좋아요한 기사</h3>
      <LikedNewsBoard :articles="likedArticles" />
    </div>
  </div>
</template>
```

**차트 최적화**:
- **고정 높이**: `h-[300px]`로 일관된 크기
- **넘침 제한**: `overflow-hidden`으로 레이아웃 보호
- **범례 제거**: 시각적 집중도 향상
- **도넛 차트 중앙**: "총 n건" 텍스트 표시

---

## 🤖 AI 챗봇 시스템

### Chatbot.vue - 플로팅 챗봇

```vue
<template>
  <!-- 챗봇 토글 버튼 -->
  <div class="fixed bottom-6 right-6 z-50">
    <button
      @click="toggleChatbot"
      class="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110">
      <MessageCircle class="w-6 h-6" />
    </button>
  </div>
  
  <!-- 챗봇 패널 -->
  <div v-if="isOpen" class="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border z-50 flex flex-col">
    <!-- 헤더 -->
    <div class="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
      <h3 class="font-semibold">AI 뉴스 어시스턴트</h3>
      <button @click="isOpen = false" class="text-white hover:text-gray-200">
        <X class="w-5 h-5" />
      </button>
    </div>
    
    <!-- 모드 선택 -->
    <div class="p-3 border-b bg-gray-50">
      <div class="flex space-x-2">
        <button
          v-for="mode in modes"
          :key="mode.value"
          @click="selectedMode = mode.value"
          :class="{ 'bg-blue-600 text-white': selectedMode === mode.value }"
          class="flex-1 py-2 px-3 text-sm rounded-lg border transition-colors">
          {{ mode.icon }} {{ mode.label }}
        </button>
      </div>
    </div>
    
    <!-- 메시지 영역 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-for="message in messages" :key="message.id" 
           :class="{ 'ml-auto': message.role === 'user' }"
           class="max-w-[80%]">
        <div :class="{ 'bg-blue-600 text-white': message.role === 'user', 'bg-gray-100': message.role === 'assistant' }"
             class="p-3 rounded-lg">
          {{ message.content }}
        </div>
      </div>
      
      <!-- 타이핑 인디케이터 -->
      <div v-if="isTyping" class="bg-gray-100 p-3 rounded-lg max-w-[80%]">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    
    <!-- 입력 영역 -->
    <div class="p-4 border-t">
      <div class="flex space-x-2">
        <input
          v-model="currentMessage"
          @keypress.enter="sendMessage"
          placeholder="메시지를 입력하세요..."
          class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="sendMessage"
          :disabled="!currentMessage.trim() || isTyping"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors">
          <Send class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
```

### 3가지 모드 시스템

```typescript
const modes = [
  { value: 'none', label: '기본', icon: '🤖', description: '일반 AI 대화' },
  { value: 'now', label: '현재 기사', icon: '📄', description: '현재 페이지 분석' },
  { value: 'all', label: '모든 기사', icon: '📚', description: 'RAG 검색' }
]

// 페이지별 컨텍스트 수집
const getPageContext = () => {
  const routeName = route.name
  
  switch (routeName) {
    case 'home':
      return getHomePageContext()
    case 'search':
      return getSearchPageContext()
    case 'detail':
      return getNewsDetailContext()
    default:
      return null
  }
}
```

---

## 🎨 UI/UX 디자인 시스템

### 컬러 팔레트
```css
:root {
  /* Primary Colors */
  --color-primary: #2563eb;      /* Blue 600 */
  --color-primary-hover: #1d4ed8; /* Blue 700 */
  
  /* Background Colors */
  --color-background: #f8fafc;   /* Slate 50 */
  --color-muted: #f1f5f9;       /* Slate 100 */
  --color-card: #ffffff;         /* White */
  
  /* Text Colors */
  --color-text-primary: #0f172a; /* Slate 900 */
  --color-text-secondary: #64748b; /* Slate 500 */
  
  /* Border Colors */
  --color-border: #e2e8f0;      /* Slate 200 */
}
```

### 일관된 카드 디자인
```vue
<!-- 모든 카드 컴포넌트에 적용되는 공통 클래스 -->
<div class="bg-white border rounded-xl shadow-sm p-6">
  <!-- 카드 내용 -->
</div>
```

### 반응형 그리드 시스템
```vue
<!-- 모바일 퍼스트 접근 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- 그리드 아이템 -->
</div>

<!-- 대시보드 복잡한 레이아웃 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div class="lg:col-span-2"><!-- 2칸 차지 --></div>
  <div class="lg:col-span-1"><!-- 1칸 차지 --></div>
  <div class="lg:col-span-1"><!-- 1칸 차지 --></div>
</div>
```

---

## 🚀 설치 및 실행

### 1. 환경 준비
```bash
# Node.js 18+ 필요
node --version
npm --version

# 프로젝트 클론 후 디렉토리 이동
cd SSAFYNEWS-Front
```

### 2. 의존성 설치
```bash
# npm 사용
npm install

# 또는 yarn 사용
yarn install

# 또는 pnpm 사용 (권장)
pnpm install
```

### 3. 환경 변수 설정
```bash
# .env 파일 생성
touch .env

# .env 파일 내용
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_TITLE=SSAFY News
```

### 4. 개발 서버 실행
```bash
# 개발 모드 (Hot Reload)
npm run dev

# 또는
yarn dev
pnpm dev

# 브라우저에서 http://localhost:5173 접속
```

### 5. 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 타입 체크
npm run type-check
```

---

## 🔧 개발 환경 설정

### VSCode 확장 프로그램
```json
{
  "recommendations": [
    "Vue.volar",                    // Vue 3 공식 확장
    "bradlc.vscode-tailwindcss",   // Tailwind CSS 지원
    "esbenp.prettier-vscode",      // 코드 포매팅
    "ms-vscode.vscode-typescript", // TypeScript 지원
    "usernamehw.errorlens"         // 인라인 에러 표시
  ]
}
```

### Prettier 설정 (.prettierrc)
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf"
}
```

---

## 📱 반응형 디자인

### 브레이크포인트
```css
/* Tailwind CSS 기본 브레이크포인트 */
sm: 640px    /* 모바일 가로 */
md: 768px    /* 태블릿 */
lg: 1024px   /* 데스크톱 */
xl: 1280px   /* 대형 데스크톱 */
2xl: 1536px  /* 초대형 화면 */
```

### 모바일 최적화
```vue
<template>
  <!-- 모바일에서 단일 열, 데스크톱에서 다중 열 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    
    <!-- 모바일에서 숨김 -->
    <div class="hidden md:block">
      데스크톱 전용 컨텐츠
    </div>
    
    <!-- 모바일에서만 표시 -->
    <div class="block md:hidden">
      모바일 전용 컨텐츠
    </div>
    
  </div>
</template>
```

---

## 📊 성능 최적화

### 1. 컴포넌트 최적화
```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// 지연 로딩
const HeavyComponent = defineAsyncComponent(() => import('./HeavyComponent.vue'))

// computed 캐싱 활용
const expensiveValue = computed(() => {
  return heavyCalculation(props.data)
})
</script>
```

### 2. 이미지 최적화
```vue
<template>
  <!-- 지연 로딩 -->
  <img 
    :src="article.thumbnail" 
    :alt="article.title"
    loading="lazy"
    class="w-full h-48 object-cover rounded-lg"
  />
</template>
```

### 3. API 호출 최적화
```typescript
// 디바운스 적용
import { debounce } from 'lodash-es'

const debouncedSearch = debounce(async (query: string) => {
  if (query.length < 2) return
  
  try {
    const response = await axios.get(`/api/autocomplete/?q=${query}`)
    suggestions.value = response.data.suggestions
  } catch (error) {
    console.error('자동완성 검색 실패:', error)
  }
}, 300)
```

---

## 🧪 테스트

### 단위 테스트 (Vitest)
```bash
# 테스트 실행
npm run test

# 커버리지 포함
npm run test:coverage

# 감시 모드
npm run test:watch
```

---

## 🚢 배포

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 배포
vercel

# 프로덕션 배포
vercel --prod
```

### Netlify 배포
```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 빌드 후 배포
npm run build
netlify deploy --prod --dir=dist
```

---

## 📞 문제 해결

### 자주 발생하는 오류

#### 1. 모듈을 찾을 수 없음
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 2. TypeScript 에러
```bash
# 타입 체크
npm run type-check

# 타입 정의 설치
npm install --save-dev @types/node
```

#### 3. Tailwind CSS 적용 안됨
```css
/* main.css에 추가 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 4. CORS 에러
```typescript
// axios 기본 설정
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true
```

---

## 📈 성능 지표

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5초
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 번들 크기 최적화
```bash
# 번들 분석
npm run build
npx vite-bundle-analyzer dist
```

---

## 📞 지원

프론트엔드 관련 문의나 버그 리포트는 GitHub Issues를 통해 남겨주세요.

**🎉 현대적이고 반응형인 뉴스 큐레이션 인터페이스를 경험해보세요!** 