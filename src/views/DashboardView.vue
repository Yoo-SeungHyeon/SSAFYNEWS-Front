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
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <!-- 페이지 헤더 -->
      <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="relative z-10 space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold">분석 대시보드</h1>
              <p class="text-blue-100 text-lg mt-2">나만의 뉴스 소비 패턴 분석</p>
            </div>
          </div>
          <p class="text-white/90 leading-relaxed text-lg max-w-3xl">
            AI가 분석한 당신의 뉴스 소비 패턴을 확인하고, 관심 분야에 맞는 개인화된 추천을 받아보세요. 
            데이터 기반의 <strong class="font-semibold text-yellow-300">스마트한 뉴스 여정</strong>을 시작해보세요.
          </p>
          <div class="flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>실시간 분석</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>개인화 통계</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>트렌드 분석</span>
            </div>
          </div>
        </div>
        
        <!-- 배경 장식 -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <!-- 통계 요약 카드 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">총 열람 기사</p>
              <p class="text-3xl font-bold">{{ totalViews.toLocaleString() }}</p>
              <p class="text-blue-100 text-xs mt-1">개의 기사를 읽었어요</p>
            </div>
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">좋아요한 기사</p>
              <p class="text-3xl font-bold">{{ likedArticles.length }}</p>
              <p class="text-purple-100 text-xs mt-1">개의 기사에 관심을 표현했어요</p>
            </div>
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-emerald-100 text-sm font-medium">관심 카테고리</p>
              <p class="text-3xl font-bold">{{ categoryStats.length }}</p>
              <p class="text-emerald-100 text-xs mt-1">개 분야에 관심이 있어요</p>
            </div>
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 차트 섹션 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 관심 카테고리 -->
        <div class="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">나의 관심 카테고리</h2>
              <p class="text-gray-600 text-sm">읽은 기사 분포를 확인해보세요</p>
            </div>
          </div>
          <div class="h-80 flex items-center justify-center">
            <CategoryDonutChart :data="categoryStats" />
          </div>
        </div>

        <!-- 주요 키워드 -->
        <div class="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">주요 키워드</h2>
              <p class="text-gray-600 text-sm">자주 등장하는 키워드들</p>
            </div>
          </div>
          <div class="h-80 flex items-center justify-center">
            <KeywordBarChart :data="keywordStats" />
          </div>
        </div>

        <!-- 주간 읽은 기사 -->
        <div class="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">주간 읽은 기사</h2>
              <p class="text-gray-600 text-sm">시간별 읽기 패턴을 확인해보세요</p>
            </div>
          </div>
          <div class="h-80 flex items-center justify-center">
            <WeeklyLineChart :data="weeklyStats" />
          </div>
        </div>

        <!-- 좋아요 누른 기사 -->
        <div class="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">좋아요 누른 기사</h2>
              <p class="text-gray-600 text-sm">관심있게 본 기사들</p>
            </div>
          </div>
          <div class="max-h-80 overflow-y-auto scrollbar-hide">
            <LikedNewsBoard :articles="likedArticles" />
          </div>
        </div>
      </div>

      <!-- 인사이트 카드 -->
      <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold">AI 인사이트</h2>
            <p class="text-white/80">당신의 뉴스 소비 패턴 분석 결과</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 class="font-semibold mb-2">📚 읽기 습관</h3>
            <p class="text-white/90 text-sm">지속적인 뉴스 소비로 정보에 대한 높은 관심을 보이고 있습니다.</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 class="font-semibold mb-2">🎯 관심 분야</h3>
            <p class="text-white/90 text-sm">다양한 카테고리의 기사를 균형있게 읽고 계십니다.</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 class="font-semibold mb-2">⭐ 추천</h3>
            <p class="text-white/90 text-sm">AI가 분석한 관심사 기반으로 맞춤 뉴스를 추천해드립니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 스크롤바 숨기기 */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}
</style>
