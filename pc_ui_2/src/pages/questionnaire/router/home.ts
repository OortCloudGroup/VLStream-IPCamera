import subMenuOut from '../layout/subMenuOut.vue'
import { errorRoutes } from '@/router/error'
const homeRoute2 = [
  {
    path: '/home',
    meta: { title: '我的问卷', icon: 'app_grade', showMenu: true },
    component: () => import('@/pages/questionnaire/views/page/homepage/home.vue')
  },
  {
    path: '/question',
    meta: { title: '发布问卷', icon: 'app_grade', showMenu: false },
    component: () => import('@/pages/questionnaire/views/page/newQues/newQues.vue')
  },
  {
    path: '/statiResult',
    meta: { title: '统计结果', icon: 'app_grade', showMenu: false },
    component: () => import('@/pages/questionnaire/views/page/homepage/statiResult.vue')
  },
  {
    path: '/myToDo',
    meta: { title: '我的待办', icon: 'app_grade', showMenu: true },
    component: () => import('@/pages/questionnaire/views/page/myToDo/myToDo.vue')
  },
  {
    path: '/starQuestionnaire',
    meta: { title: '星标问卷', icon: 'app_grade', showMenu: true },
    component: () => import('@/pages/questionnaire/views/page/starQuestionnaire/starQuestionnaire.vue')
  },
  {
    path: '/recycleBin',
    meta: { title: '回收站', icon: 'app_grade', showMenu: true },
    component: () => import('@/pages/questionnaire/views/page/recycleBin/recycleBin.vue')
  },
  {
    path: '/folder',
    meta: { title: '文件夹', icon: 'openDock', showMenu: true },
    component: () => import('@/pages/questionnaire/views/page/folder/folder.vue')
  }]

// 无顶部菜单
export const homeRoute = [
  {
    path: '/zhhome',
    meta: { title: '首页', showMenu: true },
    name: 'zhhome',
    redirect: '/home',
    component: subMenuOut,
    children: homeRoute2
  },
  ...errorRoutes
]

