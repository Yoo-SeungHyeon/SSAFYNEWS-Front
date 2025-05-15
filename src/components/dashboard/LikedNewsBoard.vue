<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import ArticleCard from '@/components/ArticleCard.vue'

interface Article {
  id: number
  title: string
  summary: string
}

// 샘플 좋아요 기사 데이터 (더미)
const likedArticles = ref<Article[]>(
  Array.from({ length: 12 }, (_, i) => ({
    id: 100 + i,
    title: `❤️ 내가 좋아요 누른 뉴스 ${i + 1}`,
    summary: `이 뉴스는 내가 관심 있게 본 내용입니다. 요약 ${i + 1}`,
  }))
)

const itemsPerPage = 5
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.ceil(likedArticles.value.length / itemsPerPage)
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return likedArticles.value.slice(start, start + itemsPerPage)
})

// 데이터 변경 시 페이지 초기화
watch(
  () => likedArticles.value,
  () => {
    currentPage.value = 1
  }
)

function prev() {
  if (currentPage.value > 1) currentPage.value--
}
function next() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<template>
  <div class="space-y-4">
    <ul class="space-y-2">
      <li v-for="item in paginatedArticles" :key="item.id">
        <ArticleCard :article="item" />
      </li>
    </ul>

    <div class="flex items-center justify-center gap-4 pt-2">
      <Button variant="outline" size="sm" @click="prev" :disabled="currentPage === 1">
        이전
      </Button>
      <span class="text-sm text-gray-500">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <Button variant="outline" size="sm" @click="next" :disabled="currentPage === totalPages">
        다음
      </Button>
    </div>
  </div>
</template>
