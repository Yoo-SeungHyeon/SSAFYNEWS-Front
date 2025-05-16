import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const username = ref('')
  const email = ref('')
  const token = ref<string | null>(null)

  // 로그인 처리
  function login(userData: { username: string; email: string; token: string }) {
    isLoggedIn.value = true
    username.value = userData.username
    email.value = userData.email
    token.value = userData.token
    localStorage.setItem('authToken', userData.token)
  }

  // 로그아웃 처리
  function logout() {
    isLoggedIn.value = false
    username.value = ''
    email.value = ''
    token.value = null
    localStorage.removeItem('authToken')
  }

  // 새로고침 시 토큰 및 사용자 정보 복원
  async function loadToken() {
    const saved = localStorage.getItem('authToken')
    if (saved) {
      token.value = saved
      isLoggedIn.value = true

      try {
        const res = await axios.get('http://localhost:8000/accounts/user/', {
          headers: {
            Authorization: `Token ${saved}`,
          },
        })

        username.value = res.data.username
        email.value = res.data.email
      } catch (err) {
        console.error('토큰으로 사용자 정보 가져오기 실패:', err)
        logout() // 토큰 만료 시 로그아웃
      }
    }
  }

  return {
    isLoggedIn,
    username,
    email,
    token,
    login,
    logout,
    loadToken,
  }
})
