import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import Login from '../views/login/login.vue'

import { homeRoute } from './message'
import uiConfig from '@/config/UIConfig'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
    component: Layout,
    name: 'Home',
    children: [
      {
        path: '/index',
        redirect: '/zhhome',
        meta: { title: '看板' },
        children: homeRoute
      }
    ]
  },
  {
    path: '/login',
    meta: {
      title: '登录'
    },
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} |` + uiConfig.messageui.login_title
  next()
})

export default router
