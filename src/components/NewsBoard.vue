<script setup lang="ts">
import ArticleCard from '@/components/ArticleCard.vue'

interface Article {
  news_id: number
  title: string
  summary?: string
}

const props = defineProps<{ articles: Article[] }>()
</script>

<template>
  <div class="space-y-4">
    <ul class="space-y-2">
      <li v-for="item in props.articles" :key="item.news_id">
        <ArticleCard :article="item" />
      </li>
    </ul>
  </div>
</template>
