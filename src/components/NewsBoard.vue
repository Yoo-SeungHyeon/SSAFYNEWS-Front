<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import ArticleCard from '@/components/ArticleCard.vue'

interface Article {
  id: number
  title: string
  summary?: string
}

const props = defineProps<{ articles: Article[] }>()

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.articles.length / itemsPerPage))
)

const pagedArticles = computed(() =>
  props.articles.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  )
)

watch(
  () => props.articles,
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
    <!-- 기사 목록 -->
    <ul class="space-y-2">
      <li v-for="item in pagedArticles" :key="item.id">
        <ArticleCard :article="item" />
      </li>
    </ul>

    <!-- 페이지네이션 -->
    <div class="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        @click="prev"
        :disabled="currentPage === 1"
      >
        이전
      </Button>
      <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
      <Button
        variant="outline"
        size="sm"
        @click="next"
        :disabled="currentPage === totalPages"
      >
        다음
      </Button>
    </div>
  </div>
</template>
