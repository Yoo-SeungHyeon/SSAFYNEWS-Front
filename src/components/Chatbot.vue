<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import type { PropType } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

// 1) Props 정의
const props = defineProps({
  pageData: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
    required: false
  }
})

// 2) Emit 정의
const emit = defineEmits<{
  (e: 'opened'): void
}>()

// 3) 내부 상태
const isOpen = ref(false)
const messages = ref<{ sender: string; text: string }[]>([])
const newMessage = ref('')

// 4) Chatbot 토글
function toggleChatbot() {
  isOpen.value = !isOpen.value
  if (isOpen.value) emit('opened')
}

// 5) 현재 화면·페이지 데이터 컨텍스트 조합
function getCurrentScreenContext() {
  const routeName = String(route.name ?? '');
  let ctx = `현재 화면: ${routeName}`;
  if (props.pageData && Object.keys(props.pageData).length) {
    ctx += `\n페이지 데이터:\n${JSON.stringify(props.pageData, null, 2)}`
  }
  return ctx
}

// 6) 메시지 전송
async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text) return

  // 6-1) 사용자 메시지 추가
  messages.value.push({ sender: 'user', text })
  newMessage.value = ''

  // 6-2) API 호출
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/chatbot/`,
      {
        message: text,
        context: getCurrentScreenContext(),
      },
      {
        headers: { Authorization: `Token ${authStore.token}` },
      }
    )
    messages.value.push({ sender: 'bot', text: res.data.response })
  } catch (err) {
    console.error('챗봇 호출 오류', err)
    messages.value.push({ sender: 'bot', text: '서비스에 문제가 발생했습니다.' })
  }
}

// 7) pageData가 바뀌면 이전 대화 초기화 (선택)
watch(
  () => props.pageData,
  () => {
    messages.value = []
  }
)
</script>

<template>
  <div v-if="authStore.isLoggedIn" class="chatbot-container" :class="{ open: isOpen }">
    <div v-if="!isOpen" class="chatbot-icon" @click="toggleChatbot">💬</div>

    <div v-else class="chatbot-window">
      <div class="chatbot-header">
        챗봇
        <button @click="toggleChatbot" class="close-button">×</button>
      </div>

      <div class="chatbot-messages">
        <div v-for="(m, i) in messages" :key="i" :class="m.sender === 'user' ? 'user' : 'bot'">
          {{ m.text }}
        </div>
      </div>

      <div class="chatbot-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
        <button @click="sendMessage">보내기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chatbot-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 100;
}

.chatbot-icon {
  background: #007bff;
  color: #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.chatbot-window {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 360px;
  height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.chatbot-header {
  background: #f0f0f0;
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.chatbot-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.chatbot-messages .user {
  align-self: flex-end;
  background: #e6f7ff;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 6px;
}

.chatbot-messages .bot {
  align-self: flex-start;
  background: #f0f0f0;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 6px;
}

.chatbot-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
}

.chatbot-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
}

.chatbot-input button {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 15px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chatbot-input button:hover {
  background: #0056b3;
}

.chatbot-container:not(.open) .chatbot-window {
  display: none;
}
</style>
