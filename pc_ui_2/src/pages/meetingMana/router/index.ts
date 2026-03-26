import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import Login from '../views/login/login.vue'

import { homeRoute } from './home'
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
        redirect: '/allMeeting',
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
  },
  {
    path: '/403',
    meta: {
      title: '没有权限'
    },
    component: () => import(/* webpackChunkName: "403" */ '../views/err/403.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

import { useUserStoreHook } from '@/store/modules/user'
import initConfig from '@/utils/initConfig'
const store = useUserStoreHook()
let isInitRouter = false
router.beforeEach(async(to, from, next) => {
  document.title = `${to.meta.title} |` + uiConfig.QRCodeManaPlat.login_title
  if (!isInitRouter && store.getStoreToken()) {
    await initConfig()
    isInitRouter = true
    store.setLocalRouter(homeRoute)
    next({ ...to, replace: true })
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} |` + uiConfig.QRCodeManaPlat.login_title
  next()
})

export default router
