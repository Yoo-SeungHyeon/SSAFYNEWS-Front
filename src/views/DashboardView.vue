<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import CategoryDonutChart from "@/components/dashboard/CategoryDonutChart.vue";
import KeywordBarChart from "@/components/dashboard/KeywordBarChart.vue";
import WeeklyLineChart from "@/components/dashboard/WeeklyLineChart.vue";
import LikedNewsBoard from "@/components/dashboard/LikedNewsBoard.vue";
import { useAuthStore } from "@/stores/auth";

// 인증 스토어
const authStore = useAuthStore();

// 원본 데이터
const rawCategoryStats = ref<Record<string, number>>({});
const keywordStats = ref<{ keyword: string; count: number }[]>([]);
const weeklyStats = ref<{ date: string; count: number }[]>([]);
const likedArticles = ref<any[]>([]);
const totalViews = ref(0); // ✅ 총 열람 수

// ✅ 가공된 데이터 (객체 → 배열로 변환)
const categoryStats = computed(() =>
  Object.entries(rawCategoryStats.value).map(([category, count]) => ({
    category,
    count,
  }))
);

// API 요청
async function fetchDashboardData() {
  if (!authStore.token) {
    console.warn("로그인이 필요합니다.");
    return;
  }

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/analyze/`,
      {
        headers: {
          Authorization: `Token ${authStore.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    rawCategoryStats.value = res.data.user_category;
    keywordStats.value = res.data.user_keyword;
    weeklyStats.value = res.data.week_view;
    likedArticles.value = res.data.like_news;
    totalViews.value = res.data.total_views; // ✅ 총 열람 수 저장
  } catch (err) {
    console.error("대시보드 데이터 불러오기 실패:", err);
  }
}

onMounted(fetchDashboardData);
</script>


<template>
  <div class="min-h-screen bg-muted">
    <div class="max-w-[1000px] mx-auto px-4 py-6 space-y-6">
      <!-- 소개 -->
      <div class="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <h1 class="text-2xl font-bold text-gray-800">📊 DASHBOARD</h1>
        <p class="text-gray-600 leading-relaxed text-sm sm:text-base">
          방문 기록 및 좋아요 데이터를 기반으로 나의 관심 분야를 확인하고,<br />
          관심 분야에 맞는 기사를 추천 받아보세요.<br />
          여러분의 취업 여정의 로드맵을 제공합니다.
        </p>
        <p class="text-blue-600 text-sm font-medium">
          👀 지금까지 열람한 기사 수: {{ totalViews }}개
        </p>
      </div>

      <!-- 차트 2x2 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 카테고리 -->
        <div class="bg-white border rounded-xl shadow-sm p-4">
          <h2 class="font-semibold text-gray-800 mb-2">📌 나의 관심 카테고리</h2>
          <div class="h-64 flex items-center justify-center text-gray-400">
            <CategoryDonutChart :data="categoryStats" />
          </div>
        </div>

        <!-- 키워드 -->
        <div class="bg-white border rounded-xl shadow-sm p-4">
          <h2 class="font-semibold text-gray-800 mb-2">🔑 주요 키워드</h2>
          <div class="h-64 flex items-center justify-center text-gray-400">
            <KeywordBarChart :data="keywordStats" />
          </div>
        </div>

        <!-- 주간 뷰 -->
        <div class="bg-white border rounded-xl shadow-sm p-4"
          style="min-height: 320px; height: 320px; overflow: hidden;">
          <h2 class="font-semibold text-gray-800 mb-2">📅 주간 읽은 기사</h2>
          <div class="h-full flex items-center justify-center text-gray-400">
            <WeeklyLineChart :data="weeklyStats" />
          </div>
        </div>


        <!-- 좋아요 기사 -->
        <div class="bg-white border rounded-xl shadow-sm p-4">
          <h2 class="font-semibold text-gray-800 mb-2">❤️ 좋아요 누른 기사</h2>
          <div class="max-h-[400px] overflow-y-auto">
            <LikedNewsBoard :articles="likedArticles" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
