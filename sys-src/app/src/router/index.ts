import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import StartpageView from '../views/StartpageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: GameView
    },
    {
      path: '/',
      name: 'start',
      component: StartpageView
    },
  ]
})

export default router
