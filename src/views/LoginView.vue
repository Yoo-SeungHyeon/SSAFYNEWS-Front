<!-- src/views/LoginView.vue -->
<template>
  <div class="min-h-screen bg-muted flex items-center justify-center px-4">
    <div class="bg-white rounded-xl shadow-sm p-6 w-full max-w-sm space-y-6">
      <h1 class="text-2xl font-bold text-center">계정</h1>

      <!-- 탭 메뉴 -->
      <div class="flex border-b">
        <button
          :class="['flex-1 text-center py-2', activeTab === 'login' ? 'border-b-2 border-black font-semibold' : 'text-gray-500']"
          @click="activeTab = 'login'">
          로그인
        </button>
        <button
          :class="['flex-1 text-center py-2', activeTab === 'signup' ? 'border-b-2 border-black font-semibold' : 'text-gray-500']"
          @click="activeTab = 'signup'">
          회원가입
        </button>
      </div>

      <!-- 로그인 폼 -->
      <form v-if="activeTab === 'login'" class="space-y-4">
        <Input v-model="loginUsername" type="text" placeholder="사용자 이름" />
        <Input v-model="loginPassword" type="password" placeholder="비밀번호" />
        <Button class="w-full" @click.prevent="handleLogin">로그인</Button>
      </form>


      <!-- 회원가입 폼 -->
      <form v-else class="space-y-4">
        <Input v-model="signupUsername" placeholder="사용자 이름" />
        <Input v-model="signupEmail" type="email" placeholder="이메일" />
        <Input v-model="signupPassword" type="password" placeholder="비밀번호" />
        <Input v-model="signupConfirm" type="password" placeholder="비밀번호 확인" />
        <Button class="w-full" @click.prevent="handleSignup">회원가입</Button>
      </form>
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
    const userRes = await axios.get('http://localhost:8000/accounts/user/', {
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

    // 회원가입 후 로그인과 동일하게 유저 정보 요청
    const userRes = await axios.get('http://localhost:8000/accounts/user/', {
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

