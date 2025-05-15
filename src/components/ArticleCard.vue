<!-- src/components/ArticleCard.vue -->
<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Article {
  id: number
  title: string
  summary: string
}

const props = defineProps<{
  article: Article
}>()

function goToDetail() {
  router.push(`/detail/${props.article.id}`)
}
</script>

<template>
  <div
    class="border rounded shadow-sm p-4 hover:bg-gray-50 cursor-pointer transition"
    @click="goToDetail"
  >
    <h2 class="font-semibold text-gray-800">
      {{ article.title }}
    </h2>
    <p class="text-sm text-gray-600 mt-1">
      {{ article.summary }}
    </p>
  </div>
</template>
