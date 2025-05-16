<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ArticleCard from '@/components/ArticleCard.vue'

const props = defineProps<{
  articleId: string | number
}>()

interface Article {
  news_id: number
  title: string
  summary: string
  author: string
  updated: string
  category: string
  link: string
}

const articles = ref<Article[]>([])

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8000/api/newsdetail/${props.articleId}/similar/`)
    articles.value = res.data
  } catch (err) {
    console.error('관련 기사 불러오기 실패:', err)
  }
})
</script>

<template>
  <div class="space-y-3">
    <ArticleCard
      v-for="item in articles"
      :key="item.news_id"
      :article="item"
    />
    <p v-if="articles.length === 0" class="text-sm text-gray-400">
      관련 기사가 없습니다.
    </p>
  </div>
</template>
