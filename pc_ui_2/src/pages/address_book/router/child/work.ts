/*
* @Created by: 兰舰
* Email: gglanjian@qq.com
* Phone: 16620805419
* @Date: 2024-11-15 11:01:55
 * @Last Modified by: 兰舰
 * @Last Modified time: 2024-11-30 16:06:11
* @Copyright aPaaS-front-team. All rights reserved.
*/
import { errorRoutes } from '@/router/error'

export const bookRoute = [
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/pages/address_book/views/page/setting/index.vue'),
    meta: {
      title: '通讯录设置',
      showMenu: true,
      icon: 'address_book_setting'
    }
  },
  {
    path: '/permission',
    name: 'permission',
    component: () => import('@/pages/address_book/views/page/permission/index.vue'),
    meta: {
      title: '通讯录权限',
      showMenu: true,
      icon: 'address_book_permission'
    }
  },
  ...errorRoutes
]
