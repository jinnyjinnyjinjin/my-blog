import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '../views/PostView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/post/:slug', component: PostView },
    { path: '/post/:category/:year/:month/:slug', component: PostView },
    { path: '/tag/:tag', component: HomeView },
    { path: '/category/:category', component: HomeView },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
