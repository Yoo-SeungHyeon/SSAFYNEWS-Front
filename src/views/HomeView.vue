<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import axios from 'axios'
import FilterBar from '@/components/FilterBar.vue'
import NewsBoard from '@/components/NewsBoard.vue'

const genres = [
  "전체", "IT_과학", "건강", "경제", "교육", "국제", "라이프스타일",
  "문화", "사건사고", "사회일반", "산업", "스포츠", "여성복지",
  "여행레저", "연예", "정치", "지역", "취미"
]
const sortOptions = ["최신순", "추천순"]

const genre = ref("전체")
const sort = ref("최신순")
const articles = ref([])
const currentPage = ref(0)
const totalCount = ref(0)
const pageSize = 10
const isLoading = ref(false)

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

async function loadArticles() {
  isLoading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/newspage/${currentPage.value}/`, {
      params: {
        category: genre.value === '전체' ? '' : genre.value,
        recommend: sort.value === '추천순' ? 1 : 0,
      },
      headers: { 'Cache-Control': 'no-cache' }
    })
    articles.value = response.data.articles
    totalCount.value = response.data.total_count
  } catch (error) {
    console.error("뉴스 데이터를 불러오는 데 실패했습니다.", error)
  } finally {
    isLoading.value = false
  }
}

watch([genre, sort], () => {
  currentPage.value = 0
  loadArticles()
})

watch(currentPage, () => {
  loadArticles()
})

onMounted(() => {
  loadArticles()
})

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}
</script>


<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">

      <!-- 소개 박스 -->
      <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="relative z-10 space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold">AI 맞춤 추천 뉴스</h1>
              <p class="text-blue-100 text-lg mt-2">개인화된 뉴스 큐레이션 서비스</p>
            </div>
          </div>
          <p class="text-white/90 leading-relaxed text-lg max-w-3xl">
            당신의 관심사와 취향을 학습하는 AI가 매일 새로운 뉴스를 선별해 드립니다. 
            더 이상 정보의 홍수에서 헤매지 마세요. <strong class="font-semibold text-yellow-300">SSAFYNEWS</strong>와 함께 
            스마트한 뉴스 소비를 시작하세요.
          </p>
          <div class="flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>실시간 업데이트</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>AI 기반 추천</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>맞춤형 큐레이션</span>
            </div>
          </div>
        </div>
        
        <!-- 배경 장식 -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <!-- 필터 + 뉴스박스 -->
      <div class="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8 space-y-8">
        <div class="border-b border-gray-100 pb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">뉴스 피드</h2>
          <p class="text-gray-600">카테고리와 정렬 방식을 선택하여 원하는 뉴스를 찾아보세요</p>
        </div>
        
        <FilterBar
          :genres="genres"
          :sorts="sortOptions"
          v-model:genre="genre"
          v-model:sort="sort"
        />

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-500 text-lg">뉴스를 불러오는 중...</p>
        </div>
        
        <div v-else class="space-y-6">
          <NewsBoard :articles="articles" :total-count="totalCount" />

          <!-- 페이지네이션 -->
          <div class="flex justify-center items-center gap-6 pt-8 border-t border-gray-100">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 0"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              이전
            </button>
            
            <div class="flex items-center gap-2">
              <span class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium">
                {{ currentPage + 1 }}
              </span>
              <span class="text-gray-400">/</span>
              <span class="text-gray-600 font-medium">{{ totalPages }}</span>
            </div>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage >= totalPages - 1"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              다음
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
