import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Quiz from './views/Quiz.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/quiz/:examId', name: 'Quiz', component: Quiz, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
