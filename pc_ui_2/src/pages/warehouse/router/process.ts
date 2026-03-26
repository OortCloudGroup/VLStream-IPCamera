import s1 from '@/assets/img/warehouse/menu1.png'
import s1_ from '@/assets/img/warehouse/menu1_.png'
import s2 from '@/assets/img/warehouse/menu2.png'
import s2_ from '@/assets/img/warehouse/menu2_.png'
import s3 from '@/assets/img/warehouse/menu3.png'
import s3_ from '@/assets/img/warehouse/menu3_.png'

export const processRoute = [
  {
    path: '/home',
    meta: { title: '主页', icon: s1, icon_: s1_ },
    component: () => import('../views/page/homepage/newHome.vue')
  },
  // {
  //   path: '/wareManage',
  //   meta: { title: '仓库管理', icon: s2, icon_: s2_ },
  //   component: () => import('../views/page/wareMana/wareMana.vue')
  // },
  {
    path: '/dataManage',
    meta: { title: '数据管理', icon: s2, icon_: s2_ },
    component: () => import('../views/page/dataMana/dataMana.vue')
  },
  {
    path: '/classifyMana',
    meta: { title: '分类管理', icon: s3, icon_: s3_ },
    component: () => import('../views/page/classMana/classMana.vue')
  },
  {
    path: '/tableMaintain',
    meta: { title: '主表维护', icon: s3, icon_: s3_ },
    component: () => import('../views/page/tableMaintain/tableMaintain.vue')
  }
]
