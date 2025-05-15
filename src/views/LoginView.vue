<template>
  <div class="min-h-screen bg-muted flex items-center justify-center px-4">
    <div class="bg-white rounded-xl shadow-sm p-6 w-full max-w-sm space-y-6">
      <h1 class="text-2xl font-bold text-center">계정</h1>

      <!-- 탭 메뉴 -->
      <div class="flex border-b">
        <button
          :class="['flex-1 text-center py-2', activeTab === 'login' ? 'border-b-2 border-black font-semibold' : 'text-gray-500']"
          @click="activeTab = 'login'"
        >
          로그인
        </button>
        <button
          :class="['flex-1 text-center py-2', activeTab === 'signup' ? 'border-b-2 border-black font-semibold' : 'text-gray-500']"
          @click="activeTab = 'signup'"
        >
          회원가입
        </button>
      </div>

      <!-- 로그인 폼 -->
      <form v-if="activeTab === 'login'" class="space-y-4">
        <Input v-model="loginEmail" type="email" placeholder="이메일" />
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

const activeTab = ref<'login' | 'signup'>('login')

const authStore = useAuthStore()
const router = useRouter()

const loginEmail = ref('')
const loginPassword = ref('')

const signupUsername = ref('')
const signupEmail = ref('')
const signupPassword = ref('')
const signupConfirm = ref('')

const handleLogin = () => {
  authStore.login({
    username: 'exampleUser',
    email: loginEmail.value,
  })
  router.push('/')
}

const handleSignup = () => {
  if (signupPassword.value !== signupConfirm.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  authStore.login({
    username: signupUsername.value,
    email: signupEmail.value,
  })

  router.push('/')
}
</script>
