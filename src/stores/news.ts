import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

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
    try {
      // ✅ 실제 API 호출 (page=0, category 전체, 추천순 off)
      const res = await axios.get('/api/newspage/0/?category=&recommend=0')
      allArticles.value = res.data.articles
    } catch (err) {
      console.error('뉴스 데이터를 불러오는 데 실패했습니다.', err)
    }
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
