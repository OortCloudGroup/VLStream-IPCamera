import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import Login from '../views/login/login.vue'

// 项目管理
// @ts-ignore
import { processRoute } from './process.ts'
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
        redirect: '/home',
        name: 'project',
        children: processRoute
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

import { useUserStoreHook } from '@/store/modules/userWare'
import initConfig from '@/utils/initConfig'
const store = useUserStoreHook()
let isInitRouter = false
router.beforeEach(async(to, from, next) => {
  document.title = `${to.meta.title} |` + uiConfig.warehouse.login_title
  if (!isInitRouter && store.getStoreToken()) {
    await initConfig()
    isInitRouter = true
    store.setLocalRouter(processRoute)
    next({ ...to, replace: true })
  } else {
    next()
  }
})

export default router
