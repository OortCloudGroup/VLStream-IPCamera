import s1 from '@/assets/img/streamCloud/menu/de1.png'
import s1_ from '@/assets/img/streamCloud/menu/de1_.png'
import s2 from '@/assets/img/streamCloud/menu/de2.png'
import s2_ from '@/assets/img/streamCloud/menu/de2_.png'
import s3 from '@/assets/img/streamCloud/menu/de3.png'
import s3_ from '@/assets/img/streamCloud/menu/de3_.png'
import s4 from '@/assets/img/streamCloud/menu/de4.png'
import s4_ from '@/assets/img/streamCloud/menu/de4_.png'

export const decision = [
  {
    path: '/decision',
    meta: { title: '事件管理', icon: s1, icon_: s1_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/decision1',
    meta: { title: '场景治理', icon: s2, icon_: s2_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/decision2',
    meta: { title: '算法编排', icon: s3, icon_: s3_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/decision3',
    meta: { title: '智能分析申请', icon: s4, icon_: s4_ },
    component: () => import('../../views/page/home/video/video.vue')
  }
]
