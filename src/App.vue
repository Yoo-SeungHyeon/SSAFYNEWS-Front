<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50">
    <Header class="sticky top-0 z-50" />
    <main class="pt-0">
      <RouterView :key="$route.fullPath" />
    </main>
    <Chatbot />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { RouterView } from 'vue-router'
import Chatbot from '@/components/Chatbot.vue'
</script>

<style>
/* 전역 스크롤바 스타일 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

/* 부드러운 페이지 전환 */
.router-view {
  transition: all 0.3s ease-in-out;
}
</style>