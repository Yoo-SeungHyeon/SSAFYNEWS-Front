<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import type { PropType } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

// Props 정의
const props = defineProps({
  pageData: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
    required: false
  }
})

// Emit 정의
const emit = defineEmits<{
  (e: 'opened'): void
}>()

// 내부 상태
const isOpen = ref(false)
const messages = ref<{ sender: string; text: string; timestamp: Date }[]>([])
const newMessage = ref('')
const selectedMode = ref<'기본' | '현재 기사' | '모든 기사'>('기본')
const isTyping = ref(false)

const modes = [
  { 
    key: '기본', 
    label: '기본', 
    icon: '🤖',
    description: '일반 AI 대화 - 기본적인 질문과 대화를 나눌 수 있습니다'
  },
  { 
    key: '현재 기사', 
    label: '현재 기사', 
    icon: '📄',
    description: '현재 페이지 분석 - 지금 보고 있는 페이지의 뉴스를 분석합니다'
  },
  { 
    key: '모든 기사', 
    label: '모든 기사', 
    icon: '📚',
    description: 'RAG 검색 - 전체 뉴스 데이터베이스에서 관련 정보를 찾아 답변합니다'
  }
] as const

// Chatbot 토글
function toggleChatbot() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    emit('opened')
    // 웰컴 메시지
    if (messages.value.length === 0) {
      messages.value.push({
        sender: 'bot',
        text: '안녕하세요! 🎉 SSAFY 뉴스 AI 어시스턴트입니다.\n원하시는 모드를 선택하고 질문해주세요!',
        timestamp: new Date()
      })
    }
  }
}

// 페이지별 상세 컨텍스트 수집
async function getDetailedPageContext() {
  const routeName = String(route.name ?? '')
  
  try {
    switch (routeName) {
      case 'home':
        return await getHomePageContext()
      case 'search':
        return await getSearchPageContext()
      case 'detail':
        return await getNewsDetailContext()
      default:
        return getGeneralPageContext()
    }
  } catch (error) {
    console.error('컨텍스트 수집 오류:', error)
    return getGeneralPageContext()
  }
}

// 홈페이지 컨텍스트
async function getHomePageContext() {
  const articles = props.pageData?.articles || []
  
  return {
    page_type: 'home',
    articles: articles.map((article: any) => ({
      title: article.title,
      category: article.category,
      summary: article.summary,
      updated: article.updated,
      keywords: article.keywords
    })),
    total_count: articles.length,
    categories: [...new Set(articles.map((a: any) => a.category))],
    recent_date: articles[0]?.updated
  }
}

// 검색페이지 컨텍스트
async function getSearchPageContext() {
  const searchQuery = route.query.q || ''
  const articles = props.pageData?.articles || []
  
  return {
    page_type: 'search',
    search_query: searchQuery,
    search_results: articles.map((article: any) => ({
      title: article.title,
      category: article.category,
      summary: article.summary,
      updated: article.updated,
      keywords: article.keywords
    })),
    total_results: articles.length
  }
}

// 뉴스 상세페이지 컨텍스트
async function getNewsDetailContext() {
  const newsId = route.params.id
  console.log('뉴스 상세 컨텍스트 수집 시작, newsId:', newsId)
  
  try {
    // 현재 기사 정보
    console.log('기사 정보 요청:', `${import.meta.env.VITE_API_BASE_URL}/api/newsdetail/${newsId}/`)
    const articleResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/newsdetail/${newsId}/`)
    const article = articleResponse.data
    console.log('기사 정보 로딩 성공:', article.title)
    
    // 유사 기사들
    let similarArticles = []
    try {
      const similarResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/newsdetail/${newsId}/similar/`)
      similarArticles = similarResponse.data
      console.log('유사 기사 로딩 성공:', similarArticles.length, '개')
    } catch (err) {
      console.warn('유사 기사 로딩 실패:', err)
    }
    
    // 댓글들
    let comments = []
    try {
      const commentsResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/comments/${newsId}/`)
      comments = commentsResponse.data
      console.log('댓글 로딩 성공:', comments.length, '개')
    } catch (err) {
      console.warn('댓글 로딩 실패:', err)
    }
    
    const contextData = {
      page_type: 'detail',
      article: {
        title: article.title,
        category: article.category,
        summary: article.summary,
        content: article.content,
        full_text: article.full_text || article.content,
        author: article.author,
        updated: article.updated,
        keywords: article.keywords,
        like_count: article.like_count,
        view_count: article.view_count
      },
      similar_articles: similarArticles.map((sa: any) => ({
        title: sa.title,
        category: sa.category,
        summary: sa.summary
      })),
      comments: comments.map((comment: any) => ({
        content: comment.content,
        created_at: comment.created_at,
        username: comment.user?.username || '익명'
      }))
    }
    
    console.log('상세 페이지 컨텍스트 완성:', contextData)
    return contextData
    
  } catch (error) {
    console.error('뉴스 상세 컨텍스트 수집 실패:', error)
    return getGeneralPageContext()
  }
}

// 일반 페이지 컨텍스트
function getGeneralPageContext() {
  return {
    page_type: 'general',
    route_name: String(route.name ?? ''),
    page_data: props.pageData
  }
}

// 모드별 컨텍스트 및 API 모드 매핑
function getModeMapping(selectedMode: string) {
  switch (selectedMode) {
    case '기본':
      return { apiMode: 'none', needsContext: false }
    case '현재 기사':
      return { apiMode: 'now', needsContext: true }
    case '모든 기사':
      return { apiMode: 'all', needsContext: false }
    default:
      return { apiMode: 'none', needsContext: false }
  }
}

// 메시지 전송
async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text) return

  // 사용자 메시지 추가
  messages.value.push({ 
    sender: 'user', 
    text, 
    timestamp: new Date() 
  })
  newMessage.value = ''
  isTyping.value = true

  // 모드별 설정 가져오기
  const modeMapping = getModeMapping(selectedMode.value)
  console.log('선택된 모드:', selectedMode.value, '매핑:', modeMapping)
  console.log('현재 라우트:', route.name)
  
  // 컨텍스트 수집 (필요한 경우에만)
  let context = null
  if (modeMapping.needsContext) {
    try {
      console.log('컨텍스트 수집 시작...')
      context = await getDetailedPageContext()
      console.log('수집된 컨텍스트:', context)
    } catch (error) {
      console.error('컨텍스트 수집 중 오류:', error)
      context = getGeneralPageContext()
    }
  }

  // API 호출
  try {
    const requestData: any = {
      message: text,
      mode: modeMapping.apiMode
    }
    
    // 컨텍스트가 있는 경우에만 추가
    if (context) {
      requestData.context = JSON.stringify(context)
    }
    
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/chatbot/`,
      requestData,
      {
        headers: { 
          Authorization: `Token ${authStore.token}`,
          'Content-Type': 'application/json'
        },
      }
    )
    
    setTimeout(() => {
      messages.value.push({ 
        sender: 'bot', 
        text: res.data.response,
        timestamp: new Date()
      })
      isTyping.value = false
    }, 1000)
    
  } catch (err) {
    console.error('챗봇 호출 오류', err)
    setTimeout(() => {
      messages.value.push({ 
        sender: 'bot', 
        text: '죄송합니다. 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date()
      })
      isTyping.value = false
    }, 800)
  }
}

// 모드 변경시 알림
function changeMode(mode: typeof selectedMode.value) {
  selectedMode.value = mode
  const modeInfo = modes.find(m => m.key === mode)
  messages.value.push({
    sender: 'bot',
    text: `${modeInfo?.icon} ${mode} 모드로 변경되었습니다!\n${modeInfo?.description}`,
    timestamp: new Date()
  })
}

// 채팅 영역 스크롤
function scrollToBottom() {
  setTimeout(() => {
    const messagesEl = document.querySelector('.chatbot-messages')
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight
    }
  }, 100)
}

watch(messages, scrollToBottom, { deep: true })
</script>

<template>
  <div v-if="authStore.isLoggedIn">
    <!-- 플로팅 버튼 (독립적 위치) -->
    <Transition name="bounce">
      <div 
        v-if="!isOpen" 
        @click="toggleChatbot"
        class="chatbot-button group fixed z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full shadow-xl hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-30"></div>
        <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        
        <!-- 툴팁 (데스크톱에서만 표시) -->
        <div class="hidden sm:block absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          AI 어시스턴트
          <div class="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      </div>
    </Transition>

    <!-- 채팅 창 (독립적 위치) -->
    <Transition name="slide-up">
      <div 
        v-if="isOpen" 
        class="chatbot-large fixed z-50 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <!-- 헤더 -->
        <div class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-3 sm:p-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-base sm:text-lg">AI 어시스턴트</h3>
                <p class="text-white/80 text-xs sm:text-sm">스마트 뉴스 도우미</p>
              </div>
            </div>
            <button 
              @click="toggleChatbot" 
              class="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- 모드 선택 -->
          <div class="mt-4 flex gap-2">
            <button
              v-for="mode in modes"
              :key="mode.key"
              @click="changeMode(mode.key)"
              :class="[
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                selectedMode === mode.key
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              ]"
            >
              <span>{{ mode.icon }}</span>
              <span>{{ mode.label }}</span>
            </button>
          </div>
        </div>

        <!-- 메시지 영역 -->
        <div class="flex-1 p-4 overflow-y-auto chatbot-messages space-y-4">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'flex',
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'px-4 py-3 rounded-2xl',
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              ]"
              style="max-width: 85%;"
            >
              <p class="text-sm leading-relaxed whitespace-pre-line">{{ message.text }}</p>
              <div class="mt-2 text-xs opacity-70">
                {{ message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }}
              </div>
            </div>
          </div>
          
          <!-- 타이핑 인디케이터 -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-gray-100 px-4 py-3 rounded-2xl">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 입력 영역 -->
        <div class="p-4 border-t border-gray-100">
          <form @submit.prevent="sendMessage" class="flex gap-3">
            <div class="flex-1 relative">
              <input
                v-model="newMessage"
                placeholder="메시지를 입력하세요..."
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                :disabled="isTyping"
              />
            </div>
            <button
              type="submit"
              :disabled="!newMessage.trim() || isTyping"
              class="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center hover:scale-105"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 플로팅 버튼 위치 */
.chatbot-button {
  bottom: 1rem !important;
  right: 1rem !important;
}

/* 챗봇 반응형 크기 설정 */
.chatbot-large {
  /* 모바일 - 화면 비율에 맞춰 유연하게 조절 */
  width: 90vw !important;
  height: 80vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  min-width: 280px !important;
  min-height: 400px !important;
  /* 모바일에서는 중앙 정렬 */
  left: 50% !important;
  top: 50% !important;
  right: auto !important;
  bottom: auto !important;
  transform: translate(-50%, -50%) !important;
  /* 비율 유지 */
  aspect-ratio: auto !important;
}

/* 작은 모바일 화면 */
@media (max-width: 360px) {
  .chatbot-large {
    width: 95vw !important;
    height: 85vh !important;
    min-width: 250px !important;
    min-height: 350px !important;
  }
}

/* 태블릿 */
@media (min-width: 640px) and (max-width: 1023px) {
  .chatbot-button {
    bottom: 1.5rem !important;
    right: 1.5rem !important;
  }
  
  .chatbot-large {
    width: 80vw !important;
    height: 85vh !important;
    max-width: 540px !important;
    max-height: 750px !important;
    min-width: 400px !important;
    min-height: 500px !important;
    /* 태블릿에서는 우측 하단 위치로 변경 */
    left: auto !important;
    top: auto !important;
    right: 1.5rem !important;
    bottom: 1.5rem !important;
    transform: none !important;
  }
}

/* 데스크톱 - max 크기로 제한 */
@media (min-width: 1024px) {
  .chatbot-button {
    bottom: 1.5rem !important;
    right: 1.5rem !important;
  }
  
  .chatbot-large {
    width: 60vw !important;
    height: 80vh !important;
    max-width: 605px !important;
    max-height: 864px !important;
    min-width: 500px !important;
    min-height: 600px !important;
    /* 데스크톱에서는 우측 하단 위치 유지 */
    left: auto !important;
    top: auto !important;
    right: 1.5rem !important;
    bottom: 1.5rem !important;
    transform: none !important;
  }
}

/* 트랜지션 애니메이션 */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.slide-up-enter-active {
  animation: slide-up 0.4s ease-out;
}
.slide-up-leave-active {
  animation: slide-up 0.3s ease-in reverse;
}

@keyframes slide-up {
  0% {
    transform: translateY(100%) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* 스크롤바 스타일링 */
.chatbot-messages::-webkit-scrollbar {
  width: 4px;
}

.chatbot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

.chatbot-messages::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style> 