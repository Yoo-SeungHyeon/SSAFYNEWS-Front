<script setup lang="ts">
import { defineProps, ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

interface ArticleDetail {
  id: number
  title: string
  full_text: string
  category: string
  updated: string
  like_count: number
  is_liked_by_me: boolean
  keywords?: string
}

const props = defineProps<{ articleId: string | number }>()
const authStore = useAuthStore()
const article = ref<ArticleDetail | null>(null)
const liked = ref(false)

const keywordList = computed(() => {
  if (!article.value?.keywords) return []
  return article.value.keywords
    .replace(/[{}"]/g, '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean)
})

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

async function fetchArticle() {
  try {
    const headers = authStore.token
      ? {
          Authorization: `Token ${authStore.token}`,
          'Content-Type': 'application/json',
        }
      : {}

    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/newsdetail/${props.articleId}/`,
      { headers }
    )

    article.value = res.data
    liked.value = res.data.is_liked_by_me
  } catch (err) {
    console.error('기사 불러오기 실패:', err)
  }
}

onMounted(fetchArticle)
watch(() => props.articleId, fetchArticle)

async function toggleLike() {
  if (!article.value || !article.value.id) {
    console.warn('article 값이 없거나 ID가 잘못되었습니다.')
    return
  }

  if (!authStore.token) {
    alert('로그인이 필요합니다.')
    return
  }

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/like/${article.value.id}/`,
      {},
      {
        headers: {
          Authorization: `Token ${authStore.token}`,
        },
      }
    )
    liked.value = res.data.liked
    article.value.like_count = res.data.like_count
  } catch (err) {
    console.error('좋아요 토글 실패:', err)
  }
}
</script>

<template>
  <div v-if="article">
    <article class="space-y-8">
      <!-- 헤더 영역 -->
      <header class="space-y-6">
        <!-- 카테고리와 날짜 -->
        <div class="flex items-center justify-between">
          <div :class="`inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r ${getCategoryColor(article.category)} rounded-full shadow-lg`">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            {{ article.category }}
          </div>
          <div class="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ new Date(article.updated).toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'short'
            }) }}
          </div>
        </div>

        <!-- 제목 -->
        <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {{ article.title }}
        </h1>

        <!-- 키워드 -->
        <div v-if="keywordList.length" class="space-y-3">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            <h3 class="text-sm font-semibold text-gray-700">핵심 키워드</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="keyword in keywordList"
              :key="keyword"
              class="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 rounded-full hover:from-blue-100 hover:to-purple-100 transition-colors duration-200"
            >
              <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
              {{ keyword }}
            </span>
          </div>
        </div>
      </header>

      <!-- 구분선 -->
      <div class="border-t border-gray-200"></div>

      <!-- 본문 -->
      <div class="prose prose-lg max-w-none">
        <div class="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
          {{ article.full_text }}
        </div>
      </div>

      <!-- 구분선 -->
      <div class="border-t border-gray-200"></div>

      <!-- 좋아요 섹션 -->
      <div class="flex items-center justify-between py-4">
        <div class="flex items-center gap-4">
          <button
            @click="toggleLike"
            :class="[
              'flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105',
              liked 
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ liked ? '좋아요!' : '좋아요' }}</span>
            <span class="px-2 py-1 bg-white/20 rounded-full text-sm">{{ article.like_count }}</span>
          </button>
        </div>
        
        <div class="flex items-center gap-3 text-sm text-gray-500">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            읽는 중
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
            공유하기
          </span>
        </div>
      </div>
    </article>
  </div>
  
  <div v-else class="flex flex-col items-center justify-center py-20">
    <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
    <p class="text-gray-500 text-lg">기사를 불러오는 중...</p>
  </div>
</template>
