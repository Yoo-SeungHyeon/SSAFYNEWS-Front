<!-- src/views/LoginView.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
    
    <!-- 배경 장식 요소 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-8">
      
      <!-- 로고와 제목 -->
      <div class="text-center space-y-4">
        <div class="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto transform hover:scale-105 transition-transform duration-200">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SSAFYNEWS
          </h1>
          <p class="text-gray-600 mt-2">AI 맞춤 뉴스 서비스에 오신 것을 환영합니다</p>
        </div>
      </div>

      <!-- 탭 메뉴 -->
      <div class="relative bg-gray-50 rounded-2xl p-1">
        <div 
          class="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm transition-all duration-300 ease-in-out"
          :class="activeTab === 'login' ? 'left-1 right-1/2' : 'left-1/2 right-1'"
        ></div>
        <div class="relative flex">
          <button
            :class="[
              'flex-1 text-center py-3 rounded-xl font-medium transition-all duration-300 relative z-10',
              activeTab === 'login' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            ]"
            @click="activeTab = 'login'"
          >
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            로그인
          </button>
          <button
            :class="[
              'flex-1 text-center py-3 rounded-xl font-medium transition-all duration-300 relative z-10',
              activeTab === 'signup' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            ]"
            @click="activeTab = 'signup'"
          >
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            회원가입
          </button>
        </div>
      </div>

      <!-- 로그인 폼 -->
      <form v-if="activeTab === 'login'" class="space-y-6">
        <div class="space-y-4">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <Input 
              v-model="loginUsername" 
              type="text" 
              placeholder="사용자 이름" 
              class="pl-10 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <Input 
              v-model="loginPassword" 
              type="password" 
              placeholder="비밀번호" 
              class="pl-10 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
        <Button 
          class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
          @click.prevent="handleLogin"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
          로그인
        </Button>
      </form>

      <!-- 회원가입 폼 -->
      <form v-else class="space-y-6">
        <div class="space-y-4">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <Input 
              v-model="signupUsername" 
              placeholder="사용자 이름" 
              class="pl-10 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <Input 
              v-model="signupEmail" 
              type="email" 
              placeholder="이메일" 
              class="pl-10 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <Input 
              v-model="signupPassword" 
              type="password" 
              placeholder="비밀번호" 
              class="pl-10 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <Input 
              v-model="signupConfirm" 
              type="password" 
              placeholder="비밀번호 확인" 
              class="pl-10 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
        <Button 
          class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
          @click.prevent="handleSignup"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
          회원가입
        </Button>
      </form>

      <!-- 추가 정보 -->
      <div class="text-center text-sm text-gray-500 space-y-2">
        <p>AI가 추천하는 맞춤형 뉴스를 경험해보세요</p>
        <div class="flex items-center justify-center gap-4 text-xs">
          <span class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            실시간 업데이트
          </span>
          <span class="flex items-center gap-1">
            <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
            개인화 추천
          </span>
          <span class="flex items-center gap-1">
            <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
            스마트 큐레이션
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { login as loginApi, signup as signupApi } from '@/lib/auth'
import axios from 'axios'

const activeTab = ref<'login' | 'signup'>('login')
const authStore = useAuthStore()
const router = useRouter()

const loginUsername = ref('')
const loginPassword = ref('')

const handleLogin = async () => {
  try {
    const result = await loginApi(loginUsername.value, loginPassword.value)

    // 로그인 후 유저 정보 가져오기
    const userRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/accounts/user/`, {
      headers: {
        Authorization: `Token ${result.key}`,
      },
    })

    authStore.login({
      username: userRes.data.username,
      email: userRes.data.email,
      token: result.key,
    })

    router.push('/')
  } catch (err: any) {
    if (err.response?.data) {
      alert('로그인 실패:\n' + JSON.stringify(err.response.data, null, 2))
    } else {
      alert('로그인 실패 (네트워크 또는 알 수 없는 오류)')
    }
  }
}

const signupUsername = ref('')
const signupEmail = ref('')
const signupPassword = ref('')
const signupConfirm = ref('')

const handleSignup = async () => {
  if (signupPassword.value !== signupConfirm.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  try {
    const result = await signupApi(
      signupUsername.value,
      signupEmail.value,
      signupPassword.value,
      signupConfirm.value
    )

    const userRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/accounts/user/`, {
      headers: {
        Authorization: `Token ${result.key}`,
      },
    })

    authStore.login({
      username: userRes.data.username,
      email: userRes.data.email,
      token: result.key,
    })

    router.push('/')
  } catch (err: any) {
    if (err.response && err.response.data) {
      alert('회원가입 실패:\n' + JSON.stringify(err.response.data, null, 2))
    } else {
      alert('회원가입 실패 (네트워크 또는 알 수 없는 오류)')
    }
  }
}
</script>


