import subMenu from '@/components/commonsubMenu.vue'
import { errorRoutes } from '@/router/error'
const homeRoute2 = [
  // {
  //   path: '/home',
  //   meta: { title: '仪表盘', icon: 'app_grade', showMenu: true },
  //   component: () => import('../views/page/home/index.vue')
  // },
  {
    path: '/allMeeting',
    name: 'allMeeting',
    meta: { title: '会议列表', icon: 'app_grade', showMenu: true },
    component: () => import('../views/page/meetingMana/allmeeting.vue')
  },
  {
    path: '/allMeetRoom',
    name: 'allMeetRoom',
    meta: { title: '会议室管理', icon: 'app_grade', showMenu: true },
    component: () => import('../views/page/meetingMana/allMeetRoom.vue')
  },
  {
    path: '/newMeeting',
    name: 'newMeeting',
    meta: { title: '新建会议', icon: 'app_grade', showMenu: false },
    component: () => import('../views/page/meetingMana/newMeetingOut.vue')
  },
  {
    path: '/newVote',
    name: 'newVote',
    meta: { title: '新建投票', icon: 'app_grade', showMenu: false },
    component: () => import('../views/page/meetingMana/components/questionPage.vue')
  }
  // {
  //   path: '/meetingMana',
  //   meta: { title: '会议管理', icon: 'app_grade', showMenu: true },
  //   redirect: '/allMeeting',
  //   children: [
  //     {
  //       path: '/allMeeting',
  //       name: 'allMeeting',
  //       meta: { title: '全部会议', icon: 'app_grade', showMenu: true },
  //       component: () => import('../views/page/meetingMana/allMeeting.vue')
  //     },
  //     {
  //       path: '/newMeeting',
  //       name: 'newMeeting',
  //       meta: { title: '新建会议', icon: 'app_grade', showMenu: false },
  //       component: () => import('../views/page/meetingMana/newMeeting.vue')
  //     }
  //   ]
  // }
]

// 无顶部菜单
export const homeRoute = [
  {
    path: '/zhhome',
    meta: { title: '首页', showMenu: true },
    name: 'zhhome',
    redirect: '/allMeeting',
    component: subMenu,
    children: homeRoute2
  },
  ...errorRoutes
]

