import s1 from '@/assets/img/streamCloud/menu/wa1.png'
import s1_ from '@/assets/img/streamCloud/menu/wa1_.png'
import s2 from '@/assets/img/streamCloud/menu/wa2.png'
import s2_ from '@/assets/img/streamCloud/menu/wa2_.png'
import s3 from '@/assets/img/streamCloud/menu/wa3.png'
import s3_ from '@/assets/img/streamCloud/menu/wa3.png'
export const ware = [
  {
    path: '/ware',
    meta: { title: '算法管理', icon: s1, icon_: s1_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/ware1',
    meta: { title: '算法训练平台', icon: s2, icon_: s2_ },
    component: () => import('../../views/page/home/video/video.vue')
  },
  {
    path: '/ware2',
    meta: { title: '开放服务中心', icon: s3, icon_: s3_ },
    component: () => import('../../views/page/home/video/video.vue')
  }
]
