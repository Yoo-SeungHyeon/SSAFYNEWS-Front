<template>
  <header
    class="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm"
  >
    <!-- 로고 -->
    <RouterLink to="/" class="text-2xl font-bold text-black">
      SSAFYNEWS
    </RouterLink>

    <!-- 메뉴 + 검색창 + 로그인 -->
    <nav class="flex items-center gap-4 w-full justify-end">
      <!-- 나만의 뉴스 -->
      <RouterLink to="/" class="text-sm font-medium hover:underline">
        📰 나만의 뉴스
      </RouterLink>

      <!-- 뉴스 검색 -->
      <RouterLink to="/search" class="text-sm font-medium hover:underline">
        🔍 뉴스 검색
      </RouterLink>

      <!-- 대시보드 -->
      <RouterLink to="/dashboard" class="text-sm font-medium hover:underline">
        📊 대시보드
      </RouterLink>

      <!-- 로그인/로그아웃 -->
      <Button variant="outline" size="sm" @click="onAuthClick">
        {{ authStore.isLoggedIn ? "로그아웃" : "로그인" }}
      </Button>
    </nav>
  </header>
</template>


<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const search = ref("");
const authStore = useAuthStore();

const onSearch = () => {
  if (search.value.trim()) {
    router.push({ path: "/search", query: { q: search.value } });
  }
};

const onAuthClick = () => {
  if (authStore.isLoggedIn) {
    authStore.logout();
    router.push("/");
  } else {
    router.push("/login");
  }
};
</script>
