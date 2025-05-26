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

const props = defineProps<{ 
  articles: RawArticle[]
  totalCount?: number
}>()
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- 기사 개수 표시 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-1 h-5 sm:h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
        <span class="text-responsive-base font-semibold text-gray-800">
          총 <span class="text-blue-600">{{ props.totalCount ?? props.articles.length }}</span>개의 기사
        </span>
      </div>
    </div>

    <!-- 기사 그리드 -->
    <div class="grid-responsive">
      <div 
        v-for="(item, index) in props.articles" 
        :key="item.news_id"
        class="transform transition-all duration-300"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
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
      </div>
    </div>

    <!-- 기사가 없을 때 -->
    <div v-if="props.articles.length === 0" class="flex flex-col items-center justify-center py-12 sm:py-20">
      <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 sm:mb-6">
        <svg class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
      </div>
      <h3 class="text-responsive-lg font-semibold text-gray-600 mb-2">기사를 찾을 수 없습니다</h3>
      <p class="text-responsive-xs text-gray-500 text-center px-4">다른 카테고리를 선택하거나 검색 조건을 변경해보세요.</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: slideInUp 0.5s ease-out forwards;
}
</style>
