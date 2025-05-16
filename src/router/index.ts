import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import SearchView from '@/views/SearchView.vue'
import DetailView from '@/views/DetailView.vue'


const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/search', name: 'search', component: SearchView },
  { path: '/detail/:id', name: 'detail', component: DetailView, props: true },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
