<!-- src/components/detail/SimilarArticleList.vue -->
<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'

interface Article {
  id: number
  title: string
  summary: string
}

const props = defineProps<{
  articleId: string | number
}>()

const similarArticles = ref<Article[]>([])

onMounted(() => {
  // 실제 API 연동 전 더미 추천 데이터 5개 생성
  const baseId = Number(props.articleId)
  similarArticles.value = Array.from({ length: 5 }, (_, i) => ({
    id: baseId + i + 1,
    title: `비슷한 뉴스 ${i + 1}`,
    summary: `이 기사와 관련된 추천 뉴스입니다. ${i + 1}번 요약.`,
  }))
})
</script>

<template>
  <div class="space-y-2">
    <ArticleCard
      v-for="article in similarArticles"
      :key="article.id"
      :article="article"
    />
  </div>
</template>
