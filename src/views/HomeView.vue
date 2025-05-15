<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from 'pinia'
import { useNewsStore } from '@/stores/news'
import FilterBar from "@/components/FilterBar.vue";
import NewsBoard from "@/components/NewsBoard.vue"

/* 장르 및 정렬 옵션 */
const genres = [
  "전체", "IT_과학", "건강", "경제", "교육", "국제", "라이프스타일",
  "문화", "사건사고", "사회일반", "산업", "스포츠", "여성복지",
  "여행레저", "연예", "정치", "지역", "취미"
]
const sortOptions = ["최신순", "추천순"]

/* Pinia store */
const store = useNewsStore()
const { genre, sort, articles, totalPages } = storeToRefs(store)

/* 초기 데이터 로딩 */
onMounted(() => {
  store.load()
})
</script>

<template>
  <div class="min-h-screen bg-muted">
    <div class="max-w-[900px] mx-auto px-4 py-6 space-y-6">

      <!-- 소개 박스 -->
      <div class="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <h1 class="text-2xl font-bold text-gray-800">🤖 AI 맞춤 추천 뉴스</h1>
        <p class="text-gray-600 leading-relaxed text-sm sm:text-base">
          당신이 원하는 뉴스, 이제 AI가 직접 추천해드립니다!<br />
          나만의 취향을 기반으로, 맞춤형 뉴스만 쏙쏙 골라주는<br />
          뉴스 큐레이팅 서비스 <strong class="font-semibold">SSAFYNEWS</strong>에 빠져보세요.<br />
          AI 챗봇과 기사에 대해 대화하며 궁금한 점을 물어보고,<br />
          한눈에 보기 쉬운 대시보드를 통해 나의 뉴스 소비 패턴도 확인할 수 있습니다.
        </p>
      </div>

      <!-- 필터 + 뉴스박스 통합 카드 -->
      <div class="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <FilterBar
          :genres="genres"
          :sorts="sortOptions"
          v-model:genre="genre"
          v-model:sort="sort"
        />

        <NewsBoard :articles="articles" />
      </div>

    </div>
  </div>
</template>
