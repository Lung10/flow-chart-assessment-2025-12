import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // No component needed - App.vue handles everything
      component: () => Promise.resolve({ template: '' }),
    },
  ],
})

export default router
