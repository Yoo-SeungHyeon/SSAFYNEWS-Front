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

async function fetchArticle() {
  try {
    const headers = authStore.token
      ? {
          Authorization: `Token ${authStore.token}`,
          'Content-Type': 'application/json',
        }
      : {}

    const res = await axios.get(
      `http://localhost:8000/api/newsdetail/${props.articleId}/`,
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
      `http://localhost:8000/api/like/${article.value.id}/`,
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
    <div class="space-y-2">
      <!-- 제목 -->
      <h1 class="text-2xl font-bold text-gray-800">{{ article.title }}</h1>

      <!-- 메타 정보 -->
      <div class="text-sm text-gray-500">
        <span>🗂 {{ article.category }}</span> ·
        <span>🕒 {{ article.updated.slice(0, 10) }}</span>
      </div>

      <!-- 키워드 -->
      <div class="pt-4" v-if="keywordList.length">
        <h3 class="text-sm font-semibold text-gray-600 mb-1">키워드</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="keyword in keywordList"
            :key="keyword"
            class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
          >
            #{{ keyword }}
          </span>
        </div>
      </div>

      <!-- 본문 -->
      <div class="text-base text-gray-700 whitespace-pre-line pt-4">
        {{ article.full_text }}
      </div>

      <!-- 좋아요 -->
      <div class="pt-4">
        <button
          class="flex items-center gap-1 text-sm text-pink-600 hover:underline"
          @click="toggleLike"
        >
          <span v-if="liked">❤️</span>
          <span v-else>🤍</span>
          좋아요 {{ article.like_count }}개
        </button>
      </div>
    </div>
  </div>
  <div v-else class="text-gray-400">기사를 불러오는 중입니다...</div>
</template>
