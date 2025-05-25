<script setup lang="ts">
import { useRoute } from 'vue-router'

import DetailArticle from '@/components/detail/DetailArticle.vue'
import CommentBox from '@/components/detail/CommentBox.vue'
import SimilarArticleList from '@/components/detail/SimilarArticleList.vue'

const route = useRoute()

// ✅ 안전하게 string으로 변환
const articleId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      
      <!-- 페이지 헤더 -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
          <h1 class="text-3xl font-bold text-gray-800">뉴스 상세</h1>
        </div>
        <p class="text-gray-600 ml-7">기사를 자세히 읽고 댓글과 관련 뉴스를 확인해보세요</p>
      </div>

      <!-- 메인 레이아웃 -->
      <div class="grid grid-cols-12 gap-8">
        
        <!-- 좌측 메인 콘텐츠 (8/12) -->
        <div class="col-span-12 lg:col-span-8 space-y-8">
          
          <!-- 상세 기사 -->
          <div class="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
            <div class="p-8">
              <DetailArticle :articleId="articleId" />
            </div>
          </div>

          <!-- 댓글 섹션 -->
          <div class="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
            <div class="p-8">
              <div class="flex items-center gap-3 mb-6">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <h2 class="text-2xl font-bold text-gray-800">댓글</h2>
              </div>
              <CommentBox :articleId="articleId" />
            </div>
          </div>
        </div>

        <!-- 우측 사이드바 (4/12) -->
        <div class="col-span-12 lg:col-span-4 space-y-6">
          
          <!-- 비슷한 기사 -->
          <div class="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl sticky top-24">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-6">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <h2 class="text-xl font-bold text-gray-800">비슷한 기사</h2>
              </div>
              <SimilarArticleList :articleId="articleId" />
            </div>
          </div>

          <!-- 추가 정보 카드 -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl p-6 text-white">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold">알고 계셨나요?</h3>
            </div>
            <p class="text-white/90 text-sm leading-relaxed">
              AI가 분석한 관련 기사들을 통해 더 깊이 있는 정보를 얻으실 수 있습니다. 댓글을 통해 다른 사용자들과 의견을 나눠보세요!
            </p>
            <div class="mt-4 flex items-center gap-4 text-xs">
              <span class="flex items-center gap-1">
                <div class="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                실시간 업데이트
              </span>
              <span class="flex items-center gap-1">
                <div class="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                AI 추천
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
