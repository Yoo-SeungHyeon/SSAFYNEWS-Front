# 📰 SSAFYNEWS - Vue3 기반 AI 뉴스 큐레이션 서비스

## 🧩 프로젝트 소개

**SSAFYNEWS**는 AI 기반의 뉴스 큐레이션 웹 애플리케이션입니다. 사용자의 관심사를 분석하여 관련 뉴스를 추천하고, 기사에 대한 상세 조회, 댓글 작성, 좋아요 및 관련 뉴스 추천 기능까지 포함한 통합 뉴스 플랫폼입니다.

* 프론트엔드 프레임워크: **Vue 3** + **TypeScript**
* UI 라이브러리: **shadcn-vue** (Tailwind 기반 컴포넌트)
* 라우팅: **vue-router**
* 상태 관리: **Pinia**

---

## 📁 폴더 구조

```bash
src/
├── components/
│   ├── ArticleCard.vue             # 기사 UI 통일 컴포넌트
│   └── detail/
│       ├── DetailArticle.vue       # 기사 상세 내용
│       ├── CommentBox.vue          # 댓글 작성 및 목록
│       └── SimilarArticleList.vue  # 관련 기사 리스트
├── views/
│   ├── HomeView.vue                # 뉴스 큐레이션 메인 페이지
│   ├── SearchView.vue              # 검색 결과 페이지
│   ├── DashboardView.vue           # 나의 뉴스 활동 시각화 대시보드
│   ├── LoginView.vue               # 로그인/회원가입 페이지
│   └── DetailView.vue              # 기사 상세 페이지 (3-Box 구성)
├── stores/
│   └── news.ts                     # 뉴스 관련 Pinia 상태 관리
├── router/
│   └── index.ts                    # vue-router 경로 설정
└── App.vue                         # 루트 컴포넌트
```

---

## 🖼️ 주요 화면 구성

### ✅ 공통 레이아웃

* 배경: 연한 회색 (`bg-muted`)
* 컨텐츠 박스: 흰색 카드형 (`bg-white border rounded-xl shadow-sm p-6`)

---

### 1️⃣ HomeView\.vue

* AI가 추천하는 맞춤형 뉴스 리스트
* `FilterBar.vue`에서 장르 및 정렬 방식 선택
* `NewsBoard.vue`에서 기사 리스트를 페이지네이션 포함 출력
* Pinia로 장르/정렬 상태 및 뉴스 데이터 관리

### 2️⃣ ArticleCard.vue

* 기사 표현 방식 통일 컴포넌트
* 클릭 시 `/detail/:id`로 라우팅

---

### 3️⃣ SearchView\.vue

* 검색 키워드를 기반으로 기사 필터링
* 검색창 + 결과 안내 메시지 + 기사 리스트 + 페이지네이션 포함

### 4️⃣ DetailView\.vue

3단 구성의 상세 페이지로, "ㅓ" 모양 레이아웃:

* 좌측 상단: `DetailArticle.vue` - 기사 본문 + 좋아요 수
* 좌측 하단: `CommentBox.vue` - 댓글 작성 및 목록
* 우측: `SimilarArticleList.vue` - 관련 기사 5개 추천
* 좌:우 비율은 6:4 (`md:col-span-7` / `col-span-5`)

---

### 5️⃣ DashboardView\.vue

* 유저의 뉴스 소비 행동을 시각화
* 구성:

  1. 관심 카테고리 (도넛 차트)
  2. 주요 키워드 (막대 차트)
  3. 주간 기사 소비량 (라인 차트)
  4. 좋아요 누른 기사 (`LikedNewsBoard.vue`)

---

## 📊 시각화 컴포넌트 특징

* `vue-chartjs` 사용 (Chart.js 기반)
* 각 차트는 박스 내부 고정 높이 + 넘침 제한 (`h-[300px] overflow-hidden`)
* 도넛 차트 중앙에는 "총 n건" 텍스트 표시
* 범례는 제거하고 시각 집중도 향상

---

## ✍️ 댓글 기능

* `CommentBox.vue`
* 댓글 입력창 + 등록 버튼
* 댓글 목록은 상단부터 최신순
* 백엔드 연동 전에는 로컬 상태로 관리

---

## 💗 좋아요 기능

* `DetailArticle.vue`에서 ❤️ 버튼 제공
* 클릭 시 좋아요 수 증가/감소 토글 (더미 상태)

---

## 🔍 기타

* `ArticleCard`를 모든 기사 표현에 재사용 (뉴스, 검색, 좋아요 등)
* 각 박스는 Tailwind로 일관된 여백/테두리 적용
* 모바일에서도 반응형으로 단일 열로 정렬됨

---

## 📦 향후 개발 계획

* API 연동 (뉴스 데이터 / 댓글 / 좋아요 / 유사 기사)
* 사용자 로그인 및 인증 연동
* 관심사 기반 추천 고도화 (코사인 유사도, 사용자 임베딩 활용)
* 다크모드 및 반응형 고도화

---

이 프로젝트는 사용자 맞춤형 뉴스 서비스를 직관적인 UX로 제공합니다.
추가 기능 또는 배포 구성이 필요하시면 이어서 확장 가능합니다. ✅
