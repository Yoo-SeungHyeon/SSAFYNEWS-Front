<script setup lang="ts">
import ArticleCard from '@/components/ArticleCard.vue'

interface RawArticle {
  news_id: number
  title: string
  summary?: string
  author?: string
  updated?: string
  category?: string
  link?: string
}

const props = defineProps<{ articles: RawArticle[] }>()
</script>

<template>
  <div class="space-y-4">
    <ul class="space-y-2">
      <li v-for="item in props.articles" :key="item.news_id">
        <!-- 필수 필드를 안전하게 보정해서 전달 -->
        <ArticleCard :article="{
          news_id: item.news_id,
          title: item.title,
          summary: item.summary ?? '요약 정보 없음',
          author: item.author ?? '기자 미상',
          updated: item.updated ?? new Date().toISOString(),
          category: item.category ?? '기타',
          link: item.link ?? '#'
        }" />
      </li>
    </ul>
  </div>
</template>
