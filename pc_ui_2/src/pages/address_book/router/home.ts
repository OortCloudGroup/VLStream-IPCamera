/*
* @Created by: 兰舰
* Email: gglanjian@qq.com
* Phone: 16620805419
* @Date: 2024-11-15 10:58:01
 * @Last Modified by: 兰舰
 * @Last Modified time: 2025-03-24 15:37:12
* @Copyright aPaaS-front-team. All rights reserved.
*/
import { bookRoute } from '@/pages/address_book/router/child/work.ts'
import subMenu from '@/components/commonsubMenu.vue'
import { errorRoutes } from '@/router/error'

export const homeRoute = [
  {
    path: '/txl',
    meta: { title: '通讯录', showMenu: false },
    name: 'txl',
    redirect: '/overviewApply',
    component: subMenu,
    children: bookRoute
  },
  ...errorRoutes
]
