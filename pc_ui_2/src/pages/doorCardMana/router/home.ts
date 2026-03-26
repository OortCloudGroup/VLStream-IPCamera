import subMenuOut from '../layout/subMenuOut.vue'
import { errorRoutes } from '@/router/error'
const homeRoute2 = [
  // {
  //   path: '/home',
  //   meta: { title: '仪表盘', icon: 'app_grade', showMenu: true },
  //   component: () => import('../views/page/home/index.vue')
  // },
  {
    path: '/tableList',
    name: 'tableList',
    meta: { title: '门牌列表', icon: 'app_grade', showMenu: true },
    component: () => import('../views/page/table/tableList.vue')
  }
]

// 无顶部菜单
export const homeRoute = [
  {
    path: '/zhhome',
    meta: { title: '首页', showMenu: true },
    name: 'zhhome',
    redirect: '/tableList',
    component: subMenuOut,
    children: homeRoute2
  },
  ...errorRoutes
]

