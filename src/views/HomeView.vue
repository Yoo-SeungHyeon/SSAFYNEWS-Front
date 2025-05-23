<!-- <script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import axios from 'axios'
import FilterBar from '@/components/FilterBar.vue'
import NewsBoard from '@/components/NewsBoard.vue'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const genres = [
  "전체", "IT_과학", "건강", "경제", "교육", "국제", "라이프스타일",
  "문화", "사건사고", "사회일반", "산업", "스포츠", "여성복지",
  "여행레저", "연예", "정치", "지역", "취미"
]
const sortOptions = ["최신순", "추천순"]

const genre = ref("전체")
const sort = ref("최신순")
const articles = ref([])
const currentPage = ref(1) // Pagination은 보통 1부터 시작
const totalCount = ref(0)
const pageSize = 10
const isLoading = ref(false)

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

async function loadArticles(page: number = currentPage.value) {
  isLoading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/newspage/${page - 1}/`, { // API는 0부터 시작할 수 있으므로 -1 처리
      params: {
        category: genre.value === '전체' ? '' : genre.value,
        recommend: sort.value === '추천순' ? 1 : 0,
      },
      headers: { 'Cache-Control': 'no-cache' }
    })
    articles.value = response.data.articles
    totalCount.value = response.data.total_count
    currentPage.value = page // Pagination에서 변경된 페이지 번호 업데이트
  } catch (error) {
    console.error("뉴스 데이터를 불러오는 데 실패했습니다.", error)
  } finally {
    isLoading.value = false
  }
}

watch([genre, sort], () => {
  currentPage.value = 1
  loadArticles(currentPage.value)
})

watch(currentPage, (newVal) => {
  loadArticles(newVal)
})

onMounted(() => {
  loadArticles(currentPage.value)
})
</script>
<template>
  <div class="min-h-screen bg-muted">
    <div class="max-w-[900px] mx-auto px-4 py-6 space-y-6">

      <div class="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <h1 class="text-2xl font-bold text-gray-800">🤖 AI 맞춤 추천 뉴스</h1>
        <p class="text-gray-600 leading-relaxed text-sm sm:text-base">
          당신이 원하는 뉴스, 이제 AI가 직접 추천해드립니다!<br />
          나만의 취향을 기반으로, 맞춤형 뉴스만 쏙쏙 골라주는<br />
          뉴스 큐레이팅 서비스 <strong class="font-semibold">SSAFYNEWS</strong>에 빠져보세요.
        </p>
      </div>

      <div class="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <FilterBar
          :genres="genres"
          :sorts="sortOptions"
          v-model:genre="genre"
          v-model:sort="sort"
        />

        <div v-if="isLoading" class="text-center text-gray-500 py-10">뉴스 불러오는 중...</div>
        <NewsBoard v-else :articles="articles" />

        <Pagination v-slot="{ page }" :items-per-page="pageSize" :total="totalCount" :default-page="1" @update:page="loadArticles">
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
              >
                {{ item.value }}
              </PaginationItem>
            </template>

            <PaginationEllipsis v-if="totalPages > 5 && page < totalPages - 2" />
            <PaginationNext />
          </PaginationContent>
        </Pagination>
        </div>

    </div>
  </div>
</template> -->

<template>
  <div class="min-h-screen bg-muted">
    <div class="max-w-[900px] mx-auto px-4 py-6 space-y-6">

      <div class="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <h1 class="text-2xl font-bold text-gray-800">🤖 AI 맞춤 추천 뉴스</h1>
        <p class="text-gray-600 leading-relaxed text-sm sm:text-base">
          당신이 원하는 뉴스, 이제 AI가 직접 추천해드립니다!<br />
          나만의 취향을 기반으로, 맞춤형 뉴스만 쏙쏙 골라주는<br />
          뉴스 큐레이팅 서비스 <strong class="font-semibold">SSAFYNEWS</strong>에 빠져보세요.
        </p>
      </div>

      <div class="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <FilterBar
          :genres="genres"
          :sorts="sortOptions"
          v-model:genre="genre"
          v-model:sort="sort"
        />

        <div v-if="isLoading" class="text-center text-gray-500 py-10">뉴스 불러오는 중...</div>
        <NewsBoard v-else :articles="articles" />

        <Pagination v-slot="{ page }" :items-per-page="pageSize" :total="totalCount" :default-page="1" @update:page="loadArticles">
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
              >
                {{ item.value }}
              </PaginationItem>
            </template>

            <PaginationEllipsis v-if="totalPages > 5 && page < totalPages - 2" />
            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </div>

      <Chatbot :page-data="{ articles: articles }" /> </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import axios from 'axios'
import FilterBar from '@/components/FilterBar.vue'
import NewsBoard from '@/components/NewsBoard.vue'
import Chatbot from '@/components/Chatbot.vue'; // Chatbot 컴포넌트 import
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const genres = [
  "전체", "IT_과학", "건강", "경제", "교육", "국제", "라이프스타일",
  "문화", "사건사고", "사회일반", "산업", "스포츠", "여성복지",
  "여행레저", "연예", "정치", "지역", "취미"
]
const sortOptions = ["최신순", "추천순"]

const genre = ref("전체")
const sort = ref("최신순")
const articles = ref([])
const currentPage = ref(1) // Pagination은 보통 1부터 시작
const totalCount = ref(0)
const pageSize = 10
const isLoading = ref(false)

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

async function loadArticles(page: number = currentPage.value) {
  isLoading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/newspage/${page - 1}/`, { // API는 0부터 시작할 수 있으므로 -1 처리
      params: {
        category: genre.value === '전체' ? '' : genre.value,
        recommend: sort.value === '추천순' ? 1 : 0,
      },
      headers: { 'Cache-Control': 'no-cache' }
    })
    articles.value = response.data.articles
    totalCount.value = response.data.total_count
    currentPage.value = page // Pagination에서 변경된 페이지 번호 업데이트
  } catch (error) {
    console.error("뉴스 데이터를 불러오는 데 실패했습니다.", error)
  } finally {
    isLoading.value = false
  }
}

watch([genre, sort], () => {
  currentPage.value = 1
  loadArticles(currentPage.value)
})

watch(currentPage, (newVal) => {
  loadArticles(newVal)
})

onMounted(() => {
  loadArticles(currentPage.value)
})
</script>