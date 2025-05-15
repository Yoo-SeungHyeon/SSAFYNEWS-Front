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
  <div class="flex justify-end gap-4">
    <!-- 뉴스 장르 -->
    <select v-model="selectedGenre" class="border rounded px-3 py-1">
      <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
    </select>

    <!-- 정렬 방법 -->
    <select v-model="selectedSort" class="border rounded px-3 py-1">
      <option v-for="s in sorts" :key="s" :value="s">{{ s }}</option>
    </select>
  </div>
</template>
