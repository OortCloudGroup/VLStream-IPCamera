/*
* @Created by: 兰舰
* Email: gglanjian@qq.com
* Phone: 16620805419
* @Date: 2024-11-15 10:58:06
 * @Last Modified by: 兰舰
 * @Last Modified time: 2024-11-15 10:59:077
* @Copyright aPaaS-front-team. All rights reserved.
*/
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
        redirect: '/setting',
        name: 'home',
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

import { useUserStoreHook } from '@/store/modules/user'
import initConfig from '@/utils/initConfig'
const store = useUserStoreHook()
let isInitRouter = false
router.beforeEach(async(to, from, next) => {
  document.title = `${to.meta.title} |` + uiConfig.address_book.login_title
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
  document.title = `${to.meta.title} |` + uiConfig.address_book.login_title
  next()
})

export default router
