import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const username = ref('')
  const email = ref('')

  function login(userData: { username: string; email: string }) {
    isLoggedIn.value = true
    username.value = userData.username
    email.value = userData.email
  }

  function logout() {
    isLoggedIn.value = false
    username.value = ''
    email.value = ''
  }

  return { isLoggedIn, username, email, login, logout }
})
