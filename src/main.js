import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import InquiryView from './views/InquiryView.vue'
import ArchiveView from './views/ArchiveView.vue'
import EchoView from './views/EchoView.vue'

// Import global styles
import './assets/global.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/inquiry',
      name: 'inquiry',
      component: InquiryView,
    },

    {
      path: '/archive',
      name: 'archive',
      component: ArchiveView,
    },
    {
      path: '/archive/:category',
      name: 'Category',
      component: () => import('@/views/CategoryView.vue'),
    },
    {
      path: '/echo',
      name: 'echo',
      component: EchoView,
    },
    {
      path: '/collection/:path',
      name: 'Collection',
      component: () => import('./views/CollectionView.vue'),
    },
  ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')
