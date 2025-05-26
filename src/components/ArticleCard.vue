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

// 카테고리별 색상 매핑
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'IT_과학': 'from-blue-500 to-cyan-500',
    '건강': 'from-green-500 to-emerald-500',
    '경제': 'from-yellow-500 to-orange-500',
    '교육': 'from-indigo-500 to-purple-500',
    '국제': 'from-red-500 to-pink-500',
    '라이프스타일': 'from-purple-500 to-indigo-500',
    '문화': 'from-pink-500 to-rose-500',
    '사건사고': 'from-red-600 to-red-500',
    '사회일반': 'from-gray-500 to-gray-600',
    '산업': 'from-blue-600 to-blue-500',
    '스포츠': 'from-orange-500 to-red-500',
    '여성복지': 'from-pink-400 to-purple-400',
    '여행레저': 'from-teal-500 to-green-500',
    '연예': 'from-rose-500 to-pink-500',
    '정치': 'from-indigo-600 to-blue-600',
    '지역': 'from-emerald-500 to-teal-500',
    '취미': 'from-violet-500 to-purple-500'
  }
  return colors[category] || 'from-gray-500 to-gray-600'
}
</script>

<template>
  <div
    class="group relative bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-200 overflow-hidden"
    @click="goToDetail"
  >
    <!-- 배경 그라디언트 효과 -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div class="relative p-responsive space-y-3 sm:space-y-4">
      <!-- 헤더 -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div :class="`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(article.category)} rounded-full shadow-sm w-fit`">
          <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          {{ article.category }}
        </div>
        <div class="flex items-center text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg w-fit">
          <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ new Date(article.updated).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) }}
        </div>
      </div>

      <!-- 제목 -->
      <h2 class="font-bold text-gray-900 line-clamp-2 text-responsive-base leading-tight group-hover:text-blue-600 transition-colors duration-200">
        {{ article.title }}
      </h2>

      <!-- 요약 -->
      <p class="text-gray-600 line-clamp-3 text-responsive-xs leading-relaxed">
        {{ article.summary }}
      </p>

      <!-- 푸터 -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-100">
        <div class="flex items-center text-xs text-gray-500">
          <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          {{ article.author }}
        </div>
        <div class="flex items-center text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          자세히 보기
          <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 호버 효과를 위한 그라디언트 보더 -->
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
