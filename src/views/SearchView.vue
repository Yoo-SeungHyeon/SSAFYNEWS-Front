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
const itemsPerPage = 10
const allArticles = ref<Article[]>([])
const isLoading = ref(false)

const totalPages = computed(() =>
  Math.ceil(allArticles.value.length / itemsPerPage)
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return allArticles.value.slice(start, start + itemsPerPage)
})

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
  router.push({ path: "/search", query: { q } })
  fetchArticles(q)
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

<template>
  <div class="min-h-screen bg-muted px-4 py-6">
    <div class="max-w-[900px] mx-auto space-y-6">
      <!-- 검색창 + 기사 리스트 -->
      <div class="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <!-- 🔍 검색창 -->
        <div class="flex gap-2">
          <Input v-model="searchKeyword" placeholder="검색어를 입력하세요" class="w-full" @keyup.enter="handleSearch" />
          <Button @click="handleSearch">검색</Button>
        </div>

        <!-- 🔍 검색 결과 안내 -->
        <div v-if="searchQuery" class="text-gray-800 font-medium text-lg">
          "{{ searchQuery }}" 에 대한 검색결과입니다.
        </div>

        <!-- 📄 기사 리스트 -->
        <template v-if="isLoading">
          <p class="text-center text-gray-400">불러오는 중...</p>
        </template>

        <template v-else-if="paginatedArticles.length > 0">
          <div class="space-y-2">
            <ArticleCard v-for="item in paginatedArticles" :key="item.news_id" :article="item" />
          </div>
        </template>

        <template v-else>
          <p class="text-center text-gray-400">검색 결과가 없습니다.</p>
        </template>
      </div>

      <!-- ⬅️➡️ 페이지네이션 -->
      <div v-if="totalPages > 1" class="flex justify-center pt-4">
        <Pagination :total="allArticles.length" :items-per-page="itemsPerPage" :default-page="currentPage"
          @update:page="changePage">
          <PaginationContent class="flex items-center gap-1">
            <PaginationPrevious />
            <template v-for="page in totalPages" :key="page">
              <PaginationItem :value="page" as-child>
                <Button class="w-10 h-10 p-0" :variant="page === currentPage ? 'default' : 'outline'">
                  {{ page }}
                </Button>
              </PaginationItem>
            </template>
            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  </div>
</template>
