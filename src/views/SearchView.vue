<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <!-- 검색 헤더 섹션 -->
      <div class="relative overflow-visible bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white">
        <div class="absolute inset-0 bg-black/10 rounded-3xl"></div>
        <div class="relative z-10 space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold">뉴스 검색</h1>
              <p class="text-blue-100 text-lg mt-2">원하는 뉴스를 빠르게 찾아보세요</p>
            </div>
          </div>
          
          <!-- 검색 박스 -->
          <div class="flex justify-center w-full">
            <form @submit.prevent="handleSearch" class="w-full max-w-2xl mx-auto relative">
              <div class="flex items-center bg-white/95 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div class="flex items-center pl-4">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <Input 
                  v-model="searchKeyword" 
                  placeholder="검색어를 입력하세요..." 
                  class="flex-1 pl-3 pr-4 py-4 text-lg text-gray-900 placeholder:text-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0" 
                  @input="handleInputChange"
                  @focus="handleFocus"
                  @compositionstart="handleCompositionStart"
                  @compositionupdate="handleCompositionUpdate"
                  @compositionend="handleCompositionEnd"
                  @keydown="handleKeydown"
                  @keyup.enter="handleSearch"
                  @blur="handleBlur"
                />
                <Button 
                  type="submit"
                  class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 m-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <span class="hidden sm:inline">검색</span>
                </Button>
              </div>
              
              <!-- 자동완성 드롭다운 -->
              <Transition name="fade">
                <div 
                  v-if="showSuggestions && suggestions.length > 0" 
                  class="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl overflow-hidden z-[100]"
                >
                  <div class="max-h-64 overflow-y-auto">
                    <div 
                      v-for="(suggestion, index) in suggestions" 
                      :key="index"
                      @click="selectSuggestion(suggestion)"
                      :class="[
                        'px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center gap-3',
                        index === selectedSuggestionIndex 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50 text-gray-700'
                      ]"
                    >
                      <div :class="[
                        'w-6 h-6 rounded-lg flex items-center justify-center',
                        suggestion.type === 'trending' 
                          ? 'bg-gradient-to-br from-orange-100 to-red-100' 
                          : 'bg-gradient-to-br from-blue-100 to-purple-100'
                      ]">
                        <!-- 인기 검색어 아이콘 -->
                        <svg v-if="suggestion.type === 'trending'" class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <!-- 일반 키워드 아이콘 -->
                        <svg v-else class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                      </div>
                      <span class="flex-1 text-sm font-medium">{{ suggestion.text }}</span>
                      <div class="flex items-center gap-2">
                        <div v-if="isHangulInputInProgress(searchKeyword)" class="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">자모입력</div>
                        <div :class="[
                          'text-xs px-2 py-1 rounded-full',
                          suggestion.type === 'trending'
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-gray-400 bg-gray-100'
                        ]">
                          {{ suggestion.type === 'trending' ? '인기' : '키워드' }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 로딩 상태 -->
                  <div v-if="isLoadingSuggestions" class="px-4 py-3 text-center text-gray-500">
                    <div class="inline-flex items-center gap-2">
                      <div class="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <span class="text-sm">검색 중...</span>
                    </div>
                  </div>
                </div>
              </Transition>
            </form>
          </div>
        </div>
        
        <!-- 배경 장식 -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-16 translate-x-16 overflow-hidden"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-12 -translate-x-12 overflow-hidden"></div>
      </div>

      <!-- 검색 결과 섹션 -->
      <div class="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8 space-y-8">
        
        <!-- 검색 결과 헤더 -->
        <div v-if="searchQuery" class="border-b border-gray-100 pb-6">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800">
                "<span class="text-blue-600">{{ searchQuery }}</span>" 검색 결과
              </h2>
              <p class="text-gray-600 mt-1">
                총 <span class="font-semibold text-blue-600">{{ allArticles.length }}</span>개의 기사를 찾았습니다
              </p>
            </div>
          </div>
        </div>

        <!-- 로딩 상태 -->
        <template v-if="isLoading">
          <div class="flex flex-col items-center justify-center py-20">
            <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p class="text-gray-500 text-lg">검색 중...</p>
          </div>
        </template>

        <!-- 검색 결과 -->
        <template v-else-if="paginatedArticles.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
              v-for="(item, index) in paginatedArticles" 
              :key="item.news_id"
              class="transform transition-all duration-300"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <ArticleCard :article="item" />
            </div>
          </div>
        </template>

        <!-- 검색 결과 없음 -->
        <template v-else-if="searchQuery">
          <div class="flex flex-col items-center justify-center py-20">
            <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
            <p class="text-gray-500 mb-4">다른 키워드로 검색해보세요</p>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">추천 키워드:</span>
              <button 
                v-for="keyword in ['AI', '인공지능', '경제', '정치', '기술', 'IT', '건강', '스포츠']" 
                :key="keyword"
                @click="searchKeyword = keyword; handleSearch()"
                class="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm hover:from-blue-200 hover:to-purple-200 transition-all duration-200 font-medium"
              >
                {{ keyword }}
              </button>
            </div>
          </div>
        </template>

        <!-- 첫 방문시 안내 -->
        <template v-else>
          <div class="flex flex-col items-center justify-center py-20">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">뉴스 검색을 시작하세요</h3>
            <p class="text-gray-500">검색창을 클릭하면 인기 검색어를 확인할 수 있습니다</p>
          </div>
        </template>

        <!-- 페이지네이션 -->
        <div v-if="totalPages > 1" class="flex justify-center pt-8 border-t border-gray-100">
          <Pagination :total="allArticles.length" :items-per-page="itemsPerPage" :default-page="currentPage"
            @update:page="changePage">
            <PaginationContent class="flex items-center gap-2">
              <PaginationPrevious class="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200" />
              <template v-for="page in totalPages" :key="page">
                <PaginationItem :value="page" as-child>
                  <Button 
                    class="w-10 h-10 p-0 transition-all duration-200" 
                    :variant="page === currentPage ? 'default' : 'outline'"
                    :class="page === currentPage ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'hover:bg-blue-50 hover:text-blue-600'"
                  >
                    {{ page }}
                  </Button>
                </PaginationItem>
              </template>
              <PaginationNext class="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200" />
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <Chatbot :page-data="{ articles: allArticles }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import ArticleCard from "@/components/ArticleCard.vue"
import Chatbot from "@/components/Chatbot.vue"; // Chatbot 컴포넌트 import

interface Article {
  news_id: number
  title: string
  summary: string
  author: string
  updated: string
  category: string
  link: string
}

const route = useRoute()
const router = useRouter()

const searchKeyword = ref(route.query.q?.toString() || "")
const searchQuery = ref(searchKeyword.value)
const currentPage = ref(1)
const itemsPerPage = 12
const allArticles = ref<Article[]>([])
const isLoading = ref(false)

// 자동완성 관련 상태
const suggestions = ref<{text: string, type: string}[]>([])
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(-1)
const isLoadingSuggestions = ref(false)
const isComposing = ref(false)

const totalPages = computed(() =>
  Math.ceil(allArticles.value.length / itemsPerPage)
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return allArticles.value.slice(start, start + itemsPerPage)
})

// 디바운스 함수
function debounce(func: Function, wait: number) {
  let timeout: number
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 한글 자모 체크 함수
function isHangulJamo(char: string): boolean {
  const code = char.charCodeAt(0)
  return (code >= 0x1100 && code <= 0x11FF) || // 초성
         (code >= 0x3131 && code <= 0x318E) ||  // 호환 자모
         (code >= 0x3165 && code <= 0x3186)     // 확장 자모
}

// 한글 또는 한글 자모 포함 여부 체크
function containsHangul(text: string): boolean {
  if (!text) return false
  return /[가-힣ㄱ-ㅣ]/.test(text)
}

// 한글 입력 중인지 체크
function isHangulInputInProgress(text: string): boolean {
  if (!text) return false
  
  // 한글이 포함되어 있으면 즉시 반응
  return containsHangul(text) || isComposing.value
}

// 자동완성 API 호출
async function fetchSuggestions(query: string) {
  const trimmedQuery = query.trim()

  isLoadingSuggestions.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/autocomplete/`, {
      params: { q: trimmedQuery }
    })
    suggestions.value = response.data.suggestions || []
    showSuggestions.value = suggestions.value.length > 0
    selectedSuggestionIndex.value = -1
  } catch (err) {
    console.error("자동완성 실패:", err)
    suggestions.value = []
    showSuggestions.value = false
  } finally {
    isLoadingSuggestions.value = false
  }
}

// 디바운스된 자동완성 함수 (즉시 반응 최적화)
const debouncedFetchSuggestions = debounce(fetchSuggestions, 100)

async function fetchArticles(query: string) {
  if (!query) return
  isLoading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/search/`, {
      params: { q: query }
    })
    const data = response.data
    if (Array.isArray(data?.articles)) {
      allArticles.value = data.articles
    } else {
      console.warn("예상치 못한 응답 구조:", data)
      allArticles.value = []
    }
  } catch (err) {
    console.error("검색 실패:", err)
    allArticles.value = []
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  const q = searchKeyword.value.trim()
  if (!q) return
  searchQuery.value = q
  currentPage.value = 1
  showSuggestions.value = false
  router.push({ path: "/search", query: { q } })
  fetchArticles(q)
}

// IME 이벤트 핸들러들
function handleCompositionStart() {
  isComposing.value = true
}

function handleCompositionUpdate() {
  // 한글 조합 중에도 실시간 자동완성
  if (searchKeyword.value && searchKeyword.value.trim().length > 0) {
    debouncedFetchSuggestions(searchKeyword.value)
  }
}

function handleCompositionEnd() {
  isComposing.value = false
  // 조합 완료 후 자동완성 호출
  if (searchKeyword.value && searchKeyword.value.trim().length > 0) {
    debouncedFetchSuggestions(searchKeyword.value)
  }
}

// 포커스 이벤트 핸들러
function handleFocus() {
  const query = searchKeyword.value.trim()
  
  // 빈 검색창에 포커스하면 인기 검색어 표시
  if (!query) {
    fetchSuggestions('')
  } else {
    // 이미 입력된 내용이 있으면 해당 자동완성 표시
    fetchSuggestions(query)
  }
}

// 입력 변경 핸들러 (즉시 반응)
function handleInputChange() {
  const query = searchKeyword.value
  
  // 빈 문자열인 경우 인기 검색어 표시
  if (!query || query.trim().length === 0) {
    fetchSuggestions('')
    return
  }
  
  // 한글 조합 중이 아닐 때만 즉시 호출 (중복 방지)
  if (!isComposing.value) {
    debouncedFetchSuggestions(query)
  }
}

// 제안 선택 핸들러
function selectSuggestion(suggestion: {text: string, type: string}) {
  searchKeyword.value = suggestion.text
  showSuggestions.value = false
  handleSearch()
}

// 키보드 네비게이션
function handleKeydown(event: KeyboardEvent) {
  if (!showSuggestions.value || suggestions.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.min(
        selectedSuggestionIndex.value + 1,
        suggestions.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1)
      break
    case 'Enter':
      if (selectedSuggestionIndex.value >= 0) {
        event.preventDefault()
        selectSuggestion(suggestions.value[selectedSuggestionIndex.value])
      }
      break
    case 'Escape':
      showSuggestions.value = false
      selectedSuggestionIndex.value = -1
      break
  }
}

// 외부 클릭으로 자동완성 닫기
function handleClickOutside() {
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
}

// blur 이벤트 핸들러
function handleBlur() {
  window.setTimeout(handleClickOutside, 150)
}

function changePage(page: number) {
  currentPage.value = page
}

onMounted(() => {
  if (searchQuery.value) fetchArticles(searchQuery.value)
})

watch(() => route.query.q, (newQ) => {
  searchKeyword.value = newQ?.toString() || ""
  searchQuery.value = searchKeyword.value
  currentPage.value = 1
  if (searchQuery.value) fetchArticles(searchQuery.value)
})
</script>

<style scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: slideInUp 0.5s ease-out forwards;
}

/* 자동완성 드롭다운 트랜지션 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>