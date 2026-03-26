import s1 from '@/assets/img/streamCloud/menu/v1.png'
import s1_ from '@/assets/img/streamCloud/menu/v1_.png'
import s2 from '@/assets/img/streamCloud/menu/v2.png'
import s2_ from '@/assets/img/streamCloud/menu/v2_.png'
import s3 from '@/assets/img/streamCloud/menu/v3.png'
import s3_ from '@/assets/img/streamCloud/menu/v3_.png'
import s4 from '@/assets/img/streamCloud/menu/v4.png'
import s4_ from '@/assets/img/streamCloud/menu/v4_.png'
import s5 from '@/assets/img/streamCloud/menu/v5.png'
import s5_ from '@/assets/img/streamCloud/menu/v5_.png'
import s6 from '@/assets/img/streamCloud/menu/v6.png'
import s6_ from '@/assets/img/streamCloud/menu/v6_.png'
import s7 from '@/assets/img/streamCloud/menu/v7.png'
import s7_ from '@/assets/img/streamCloud/menu/v7_.png'
export const video = [
  {
    path: '/video',
    meta: { title: '视频广场', icon: s1, icon_: s1_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/myVideo',
    meta: { title: '我的视频', icon: s2, icon_: s2_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/video1',
    meta: { title: '视频回放', icon: s3, icon_: s3_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/video2',
    meta: { title: '监控告警', icon: s4, icon_: s4_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/video3',
    meta: { title: '智能分析结果', icon: s5, icon_: s5_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/video4',
    meta: { title: '设备管理', icon: s6, icon_: s6_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/video5',
    meta: { title: '标签管理', icon: s7, icon_: s7_ },
    component: () => import('../../views/page/home/video/video.vue')
  }
]
