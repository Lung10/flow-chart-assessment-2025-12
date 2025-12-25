import { createRouter, createWebHistory } from 'vue-router'

// Router configuration
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // home route
      path: '/',
      name: 'home', // name of the route
      component: () => Promise.resolve({ template: '' }), // no component needed - App.vue handles everything, this is just a placeholder
    },
  ],
})

export default router
