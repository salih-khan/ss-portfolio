import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Import global styles
import './assets/global.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/enquiry',
      name: 'enquiry',
      component: () => import('@/views/EnquiryView.vue')
    },
    {
      path: '/archive',
      name: 'archive',
      component: () => import('@/views/ArchiveView.vue')
    },
    {
      path: '/echo',
      name: 'echo',
      component: () => import('@/views/EchoView.vue')
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
