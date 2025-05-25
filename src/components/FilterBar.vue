<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  genre: string
  sort: string
  genres: string[]
  sorts: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:genre', v: string): void
  (e: 'update:sort', v: string): void
}>()

/* v-model:genre / v-model:sort 대응 */
const selectedGenre = computed({
  get: () => props.genre,
  set: v => emit('update:genre', v),
})
const selectedSort = computed({
  get: () => props.sort,
  set: v => emit('update:sort', v),
})
</script>

<template>
  <div class="space-y-6">
    <!-- 장르 선택 -->
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
        </svg>
        <h3 class="text-sm font-semibold text-gray-700">카테고리</h3>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="g in genres"
          :key="g"
          @click="selectedGenre = g"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105',
            selectedGenre === g
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
          ]"
        >
          {{ g }}
        </button>
      </div>
    </div>

    <!-- 정렬 방식 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
        </svg>
        <h3 class="text-sm font-semibold text-gray-700">정렬</h3>
      </div>
      
      <div class="relative">
        <select 
          v-model="selectedSort" 
          class="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
        >
          <option v-for="s in sorts" :key="s" :value="s">{{ s }}</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
