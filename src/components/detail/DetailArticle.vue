<!-- src/components/detail/DetailArticle.vue -->
<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue'

interface ArticleDetail {
  id: number
  title: string
  content: string
  category: string
  created_at: string
  likes: number
}

const props = defineProps<{
  articleId: string | number
}>()

const article = ref<ArticleDetail | null>(null)
const liked = ref(false)

onMounted(() => {
  // ✅ 실제 API로 교체 가능
  article.value = {
    id: Number(props.articleId),
    title: `AI 기술로 변화하는 세상`,
    content:
      `AI 기술은 의료, 금융, 교육 등 다양한 분야에서 혁신을 이끌고 있습니다.\n\n이 기사에서는 그 구체적인 사례들을 살펴봅니다.`,
    category: 'IT_과학',
    created_at: '2025-05-10',
    likes: 42,
  }
})

function toggleLike() {
  if (!article.value) return
  liked.value = !liked.value
  article.value.likes += liked.value ? 1 : -1
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
        <span>🕒 {{ article.created_at }}</span>
      </div>

      <!-- 본문 -->
      <div class="text-base text-gray-700 whitespace-pre-line pt-4">
        {{ article.content }}
      </div>

      <!-- 좋아요 -->
      <div class="pt-4">
        <button
          class="flex items-center gap-1 text-sm text-pink-600 hover:underline"
          @click="toggleLike"
        >
          <span v-if="liked">❤️</span>
          <span v-else>🤍</span>
          좋아요 {{ article.likes }}개
        </button>
      </div>
    </div>
  </div>
  <div v-else class="text-gray-400">기사를 불러오는 중입니다...</div>
</template>
