import subMenu from '@/components/commonsubMenu.vue'
import { errorRoutes } from '@/router/error.ts'

const homeRoute2 = [
  {
    path: '/home',
    meta: { title: '数据看板', icon: 'app_grade', showMenu: true },
    component: () => import('../views/page/homepage/home.vue')
  },
  {
    path: '/QRCode',
    meta: { title: '生成二维码', icon: 'audit_manage', showMenu: true },
    children: [
      {
        path: '/codeCreate',
        meta: { title: '创建二维码', showMenu: true },
        component: () => import('../views/page/QRCode/codeCreate.vue')
      },
      {
        path: '/codeType',
        meta: { title: '类型管理', showMenu: true },
        component: () => import('../views/page/QRCode/codeType.vue')
      }]
  },
  {
    path: '/codeMana',
    meta: { title: '二维码管理', icon: 'openDock', showMenu: true },
    component: () => import('../views/page/QRCodeMana/codeMana.vue')
  }]

// 无顶部菜单
export const homeRoute = [
  {
    path: '/zhhome',
    meta: { title: '首页', showMenu: true },
    name: 'zhhome',
    redirect: '/home',
    component: subMenu,
    children: homeRoute2
  },
  ...errorRoutes
]

