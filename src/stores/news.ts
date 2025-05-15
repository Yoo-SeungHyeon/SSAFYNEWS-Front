import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Article {
  id: number
  category: string
  title: string
  summary: string
}

export const useNewsStore = defineStore('news', () => {
  const allArticles = ref<Article[]>([])
  const genre = ref('전체')
  const sort = ref('최신순')
  const page = ref(1)
  const itemsPerPage = 10

  // 필터링된 기사
  const filtered = computed(() => {
    let result = genre.value === '전체'
      ? allArticles.value
      : allArticles.value.filter(a => a.category === genre.value)

    return sort.value === '추천순'
      ? [...result].reverse()
      : result
  })

  const paginatedArticles = computed(() => {
    const start = (page.value - 1) * itemsPerPage
    return filtered.value.slice(start, start + itemsPerPage)
  })

  const totalPages = computed(() =>
    Math.ceil(filtered.value.length / itemsPerPage),
  )

  async function load() {
    const res = await fetch('/src/assets/news-sample.json')
    allArticles.value = await res.json()
  }

  return {
    genre,
    sort,
    page,
    itemsPerPage,
    articles: paginatedArticles,
    totalPages,
    load,
  }
})
