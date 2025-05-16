<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import ArticleCard from '@/components/ArticleCard.vue'
import { useAuthStore } from '@/stores/auth'

interface Article {
  news_id: number
  title: string
  summary: string
  author?: string
  updated?: string
  category?: string
  link?: string
}

const authStore = useAuthStore()

const articles = ref<Article[]>([])
const currentPage = ref(1)
const totalPages = ref(1)

async function fetchLikedArticles(page = 1) {
  if (!authStore.token) return

  try {
    const res = await axios.get(`http://localhost:8000/api/likes/?page=${page}`, {
      headers: {
        Authorization: `Token ${authStore.token}`,
        'Content-Type': 'application/json',
      },
    })

    articles.value = res.data.articles
    totalPages.value = res.data.total_pages
    currentPage.value = res.data.page
  } catch (err) {
    console.error('좋아요 기사 목록 불러오기 실패:', err)
  }
}

function prev() {
  if (currentPage.value > 1) fetchLikedArticles(currentPage.value - 1)
}
function next() {
  if (currentPage.value < totalPages.value) fetchLikedArticles(currentPage.value + 1)
}

onMounted(() => fetchLikedArticles())
</script>

<template>
  <div class="space-y-4">
    <ul class="space-y-2">
      <li v-for="item in articles" :key="item.news_id">
        <ArticleCard :article="item" />
      </li>
    </ul>

    <div class="flex items-center justify-center gap-4 pt-2" v-if="totalPages > 1">
      <Button variant="outline" size="sm" @click="prev" :disabled="currentPage === 1">
        이전
      </Button>
      <span class="text-sm text-gray-500">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <Button variant="outline" size="sm" @click="next" :disabled="currentPage === totalPages">
        다음
      </Button>
    </div>
  </div>
</template>
