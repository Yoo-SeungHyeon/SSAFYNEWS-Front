<script setup lang="ts">
import { useRoute } from 'vue-router'

import DetailArticle from '@/components/detail/DetailArticle.vue'
import CommentBox from '@/components/detail/CommentBox.vue'
import SimilarArticleList from '@/components/detail/SimilarArticleList.vue'

const route = useRoute()
const articleId = route.params.id
</script>

<template>
  <div class="min-h-screen bg-muted px-4 py-6">
    <div class="max-w-[1200px] mx-auto">
      <!-- 좌우 레이아웃 (6:4) -->
      <div class="grid grid-cols-12 gap-6">
        <!-- 좌측 (6/10) -->
        <div class="col-span-12 md:col-span-7 space-y-6">
          <!-- 상세 기사 -->
          <div class="bg-white border rounded-xl shadow-sm p-6">
            <DetailArticle :articleId="articleId" />
          </div>

          <!-- 댓글 -->
          <div class="bg-white border rounded-xl shadow-sm p-6">
            <CommentBox :articleId="articleId" />
          </div>
        </div>

        <!-- 우측 (4/10) -->
        <div class="col-span-12 md:col-span-5 space-y-6">
          <div class="bg-white border rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">🔎 비슷한 기사</h2>
            <SimilarArticleList :articleId="articleId" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
