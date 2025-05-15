<script setup lang="ts">
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import ArticleCard from "@/components/ArticleCard.vue" // ✅ 추가

interface Article {
  id: number
  title: string
  summary: string
}

const route = useRoute()
const searchKeyword = ref(route.query.q?.toString() || "")
const searchQuery = ref(searchKeyword.value)
const currentPage = ref(1)
const itemsPerPage = 10

const allArticles = ref<Article[]>(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `검색된 뉴스 ${i + 1}`,
    summary: `요약 텍스트입니다. ${i + 1}번 기사 내용.`,
  }))
)

const filteredArticles = computed(() => {
  if (!searchQuery.value.trim()) return []
  return allArticles.value.filter(
    (a) =>
      a.title.includes(searchQuery.value) ||
      a.summary.includes(searchQuery.value)
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredArticles.value.length / itemsPerPage)
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredArticles.value.slice(start, start + itemsPerPage)
})

function handleSearch() {
  searchQuery.value = searchKeyword.value.trim()
  currentPage.value = 1
}

function changePage(page: number) {
  currentPage.value = page
}
</script>

<template>
  <div class="min-h-screen bg-muted px-4 py-6">
    <div class="max-w-[900px] mx-auto space-y-6">
      <!-- 검색 + 기사 리스트 통합 박스 -->
      <div class="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <!-- 검색창 -->
        <div class="flex gap-2">
          <Input
            v-model="searchKeyword"
            placeholder="검색어를 입력하세요"
            class="w-full"
            @keyup.enter="handleSearch"
          />
          <Button @click="handleSearch">검색</Button>
        </div>

        <!-- 검색 결과 안내 -->
        <div v-if="searchQuery" class="text-gray-800 font-medium text-lg">
          "{{ searchQuery }}" 에 대한 검색결과입니다.
        </div>

        <!-- 기사 리스트 -->
        <template v-if="paginatedArticles.length > 0">
          <div class="space-y-2">
            <ArticleCard
              v-for="item in paginatedArticles"
              :key="item.id"
              :article="item"
            />
          </div>
        </template>

        <template v-else>
          <p class="text-center text-gray-400">검색 결과가 없습니다.</p>
        </template>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="flex justify-center pt-4">
        <Pagination
          :total="filteredArticles.length"
          :items-per-page="itemsPerPage"
          :default-page="currentPage"
          @update:page="changePage"
        >
          <PaginationContent class="flex items-center gap-1">
            <PaginationPrevious />
            <template v-for="page in totalPages" :key="page">
              <PaginationItem :value="page" as-child>
                <Button
                  class="w-10 h-10 p-0"
                  :variant="page === currentPage ? 'default' : 'outline'"
                >
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
