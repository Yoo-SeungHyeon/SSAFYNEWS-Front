// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './index.css'

// ✅ axios 설정 추가
import axios from 'axios'

// ✅ 환경 변수로부터 API 기본 주소 설정
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

// ✅ 필요 시 전역 등록도 가능
// app.config.globalProperties.$axios = axios  ← 컴포넌트에서 this.$axios 사용 가능

import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

useAuthStore().loadToken()

app.use(router)
app.mount('#app')
