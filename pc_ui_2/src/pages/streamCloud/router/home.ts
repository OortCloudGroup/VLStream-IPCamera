import { video } from './child/video'
import { decision } from './child/decision'
import { ware } from './child/ware'
import { dispatch } from './child/dispatch'
import subMenu from '../views/page/home/subMenu.vue'

export const homeRoute = [
  {
    path: '/home',
    meta: { title: '工作台' },
    component: () => import('../views/page/home/workbench/workbench.vue')
  },
  {
    path: '/videoC',
    meta: { title: '视频汇聚' },
    name: 'videoC',
    redirect: '/video',
    component: subMenu,
    children: video
  },
  {
    path: '/decisionC',
    meta: { title: '决策式AI' },
    name: 'decisionC',
    redirect: '/decision',
    component: subMenu,
    children: decision
  },
  {
    path: '/wareC',
    meta: { title: '算法仓库' },
    name: 'wareC',
    redirect: '/ware',
    component: subMenu,
    children: ware
  },
  {
    path: '/dispatchC',
    meta: { title: 'AI算力调度' },
    name: 'dispatchC',
    redirect: '/dispatch',
    component: subMenu,
    children: dispatch
  }
]
