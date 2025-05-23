<template>
  <div style="display: flex; flex-direction: column; min-height: 100vh;">
    <Header style="position: fixed; top: 0; left: 0; right: 0; z-index: 10;" />
    <div style="padding-top: 60px; flex-grow: 1;">
      <RouterView :key="$route.fullPath" />
    </div>
    <Chatbot/>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { RouterView } from 'vue-router'
import Chatbot from '@/components/Chatbot.vue'
</script>