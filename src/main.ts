// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './index.css' // TailwindCSS 스타일 (shadcn 설치 시 포함됨)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
