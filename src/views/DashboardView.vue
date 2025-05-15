<script setup lang="ts">
import CategoryDonutChart from "@/components/dashboard/CategoryDonutChart.vue";
import KeywordBarChart from "@/components/dashboard/KeywordBarChart.vue";
import WeeklyLineChart from "@/components/dashboard/WeeklyLineChart.vue";
import LikedNewsBoard from "@/components/dashboard/LikedNewsBoard.vue";

// 지금은 별도 로직 없음. 추후 차트 데이터 연동 시 추가 예정
const categoryStats = [
  { category: "IT_과학", count: 12 },
  { category: "건강", count: 7 },
  { category: "경제", count: 5 },
  { category: "사회", count: 4 },
  { category: "문화", count: 3 },
  { category: "정치", count: 2 },
  { category: "스포츠", count: 1 },
  { category: "생활", count: 1 },
  { category: "교육", count: 1 },
  { category: "환경", count: 1 },
  { category: "여행", count: 1 },
  { category: "자동차", count: 1 },
  { category: "부동산", count: 1 },
];

const keywordStats = [
  { keyword: "AI", frequency: 21 },
  { keyword: "Python", frequency: 18 },
  { keyword: "ChatGPT", frequency: 12 },
  { keyword: "Vue", frequency: 10 },
  { keyword: "Kubernetes", frequency: 8 },
  { keyword: "Docker", frequency: 6 },
  { keyword: "ML", frequency: 5 },
  { keyword: "클라우드", frequency: 4 },
  { keyword: "보안", frequency: 3 },
  { keyword: "React", frequency: 2 },
];

const weeklyStats = [
  { date: "2025-05-10", count: 2 },
  { date: "2025-05-11", count: 5 },
  { date: "2025-05-12", count: 3 },
  { date: "2025-05-13", count: 4 },
  { date: "2025-05-14", count: 6 },
  { date: "2025-05-15", count: 2 },
  { date: "2025-05-16", count: 1 },
];

const likedArticles = [
  { id: 1, title: "AI 혁신의 물결", summary: "4차 산업혁명 시대 AI의 역할은?" },
  {
    id: 2,
    title: "Python으로 데이터 분석하기",
    summary: "Pandas와 함께하는 실전 분석",
  },
  {
    id: 3,
    title: "Vue 3의 컴포지션 API란?",
    summary: "코드의 재사용성을 높이는 방법",
  },
  {
    id: 4,
    title: "Docker 실전 튜토리얼",
    summary: "개발 환경을 컨테이너로 쉽게",
  },
  {
    id: 5,
    title: "ChatGPT 활용법 정리",
    summary: "업무 자동화를 위한 프롬프트 전략",
  },
  { id: 6, title: "Next.js vs Nuxt.js", summary: "React와 Vue의 SSR 비교" },
  { id: 7, title: "Kubernetes 시작하기", summary: "배포와 스케일링을 쉽게" },
];
</script>

<template>
  <div class="min-h-screen bg-muted">
    <div class="max-w-[1000px] mx-auto px-4 py-6 space-y-6">
      <!-- 소개 박스 -->
      <div class="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <h1 class="text-2xl font-bold text-gray-800">📊 DASHBOARD</h1>
        <p class="text-gray-600 leading-relaxed text-sm sm:text-base">
          방문 기록 및 좋아요 데이터를 기반으로 나의 관심 분야를 확인하고,<br />
          관심 분야에 맞는 기사를 추천 받아보세요.<br />
          여러분의 취업 여정의 로드맵을 제공합니다.
        </p>
      </div>

      <!-- 차트 박스 2x2 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 차트 1 -->
        <div class="bg-white border rounded-xl shadow-sm p-4">
          <h2 class="font-semibold text-gray-800 mb-2">
            📌 나의 관심 카테고리
          </h2>
          <!-- 차트 위치 -->
          <div class="h-64 flex items-center justify-center text-gray-400">
            <CategoryDonutChart :data="categoryStats" />
          </div>
        </div>

        <!-- 차트 2 -->
        <div class="bg-white border rounded-xl shadow-sm p-4">
          <h2 class="font-semibold text-gray-800 mb-2">🔑 주요 키워드</h2>
          <div class="h-64 flex items-center justify-center text-gray-400">
            <KeywordBarChart :data="keywordStats" />
          </div>
        </div>

        <!-- 차트 3 -->
        <div class="bg-white border rounded-xl shadow-sm p-4">
          <h2 class="font-semibold text-gray-800 mb-2">📅 주간 읽은 기사</h2>
          <div class="h-64 flex items-center justify-center text-gray-400">
            <WeeklyLineChart :data="weeklyStats" />
          </div>
        </div>

        <!-- 차트 4 -->
        <div class="bg-white border rounded-xl shadow-sm p-4">
          <h2 class="font-semibold text-gray-800 mb-2">❤️ 좋아요 누른 기사</h2>
          <!-- 아래 스타일로 강제 제한 -->
          <div class="max-h-[400px] overflow-y-auto">
            <LikedNewsBoard :articles="likedArticles" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
