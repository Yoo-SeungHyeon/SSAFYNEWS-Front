<!-- src/components/ArticleCard.vue -->
<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Article {
  news_id: number
  title: string
  summary: string
  author: string
  updated: string
  category: string
  link: string
}

const props = defineProps<{
  article: Article
}>()

function goToDetail() {
  router.push(`/detail/${props.article.news_id}`)
}
</script>

<template>
  <div
    class="border rounded shadow-sm p-4 hover:bg-gray-50 cursor-pointer transition"
    @click="goToDetail"
  >
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs text-white bg-blue-500 rounded px-2 py-0.5">
        {{ article.category }}
      </span>
      <span class="text-xs text-gray-400">
        {{ new Date(article.updated).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) }}
      </span>
    </div>
    <h2 class="font-semibold text-gray-800 line-clamp-2">
      {{ article.title }}
    </h2>
    <p class="text-sm text-gray-600 mt-1 line-clamp-2">
      {{ article.summary }}
    </p>
    <p class="text-xs text-gray-400 mt-2">
      {{ article.author }}
    </p>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
