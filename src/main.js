import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import EnquiryView from './views/EnquiryView.vue'
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
      path: '/enquiry',
      name: 'enquiry',
      component: EnquiryView,
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchiveView,
    },
    {
      path: '/echo',
      name: 'echo',
      component: EchoView,
    },
    {
      path: '/archive/:categoryId',
      name: 'Category',
      component: () => import('@/views/CategoryView.vue')
    },
    {
      path: '/archive/collection/:collectionId',
      name: 'Collection',
      component: () => import('@/views/CollectionView.vue')
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicy',
      component: () => import('@/views/PrivacyPolicyView.vue')
    }
  ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')
