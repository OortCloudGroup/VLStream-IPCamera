import s1 from '@/assets/img/streamCloud/menu/di1.png'
import s1_ from '@/assets/img/streamCloud/menu/di1.png'
export const dispatch = [
  {
    path: '/dispatch',
    meta: { title: '容器实例', icon: s1, icon_: s1_ },
    component: () => import('../../views/page/home/video/video.vue')
  }
]
