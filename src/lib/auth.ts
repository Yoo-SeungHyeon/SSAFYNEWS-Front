// src/lib/auth.ts
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 회원가입
export async function signup(username: string, email: string, password1: string, password2: string) {
  const res = await axios.post(`${API_BASE_URL}/accounts/signup/`, {
    username,
    email,
    password1,
    password2,
  })

  if (!res.data?.key) {
    throw new Error('회원가입 후 토큰을 받지 못했습니다.')
  }

  return res.data // { key: ... }
}

// 로그인
export async function login(username: string, password: string) {
  const res = await axios.post(`${API_BASE_URL}/accounts/login/`, {
    username,
    password,
  })
  return res.data // { key: "..." }
}
