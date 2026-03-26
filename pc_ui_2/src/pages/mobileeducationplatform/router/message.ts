
const messageRoute = [
  {
    path: '/home',
    meta: { title: '首页', icon: 'mob_home', showMenu: true },
    component: () => import('../views/page/message/home.vue')
  },

  {
    path: '/shouldTalk',
    meta: { title: '本月应谈', icon: 'mob_shouldTalk', showMenu: true },
    component: () => import('../views/page/message/discussion/discussion.vue')
  },
  {
    path: '/alreadyTalk',
    meta: { title: '已谈民警', icon: 'mob_alreadyTalk', showMenu: true },
    component: () => import('../views/page/message/alreadyTalk.vue')
  },
  {
    path: '/talkRecord',
    meta: { title: '谈话记录', icon: 'mob_talkRecord', showMenu: true },
    component: () => import('../views/page/message/discussion/memcon.vue')
  },
  {
    path: '/talkStatis',
    meta: { title: '谈话统计', icon: 'mob_talkStatis', showMenu: true },
    children: [
      {
        path: '/talkStatisIndex',
        name: 'talkStatisIndex',
        meta: { title: '统计看板', showMenu: true },
        component: () => import('../views/page/message/talkStatis.vue')
      },
      {
        path: '/talkStatisPolice',
        name: 'talkStatisPolice',
        meta: { title: '民警统计', showMenu: true },
        children: [
          {
            path: '/tjPersonal',
            name: 'tjPersonal',
            meta: { title: '个人谈话', showMenu: true },
            component: () => import('../views/page/message/talkStatis/tjPersonal.vue')
          },
          {
            path: '/tjDepartment',
            name: 'tjDepartment',
            meta: { title: '组织结构谈话', showMenu: true },
            component: () => import('../views/page/message/talkStatis/tjDepartment.vue')
          },
          {
            path: '/tjType',
            name: 'tjType',
            meta: { title: '谈话类型', showMenu: true },
            component: () => import('../views/page/message/talkStatis/tjType.vue')
          },
          {
            path: '/tjWCL',
            name: 'tjWCL',
            meta: { title: '谈话完成率', showMenu: true },
            component: () => import('../views/page/message/talkStatis/tjWCL.vue')
          }
        ]

      },
      {
        path: '/talkStatisPrisoner',
        name: 'talkStatisPrisoner',
        meta: { title: '罪犯统计', showMenu: true },
        children: [
          {
            path: '/prisonerTHSC',
            name: 'prisonerTHSC',
            meta: { title: '罪犯谈话时长', showMenu: true },
            component: () => import('../views/page/message/talkStatis/prisonerTHSC.vue')
          },
          {
            path: '/prisonerTHCS',
            name: 'prisonerTHCS',
            meta: { title: '罪犯谈话次数', showMenu: true },
            component: () => import('../views/page/message/talkStatis/prisonerTHCS.vue')
          },
          {
            path: '/prisonerTHWCL',
            name: 'prisonerTHWCL',
            meta: { title: '罪犯谈话完成率', showMenu: true },
            component: () => import('../views/page/message/talkStatis/prisonerTHWCL.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/case',
    meta: { title: '案例库', icon: 'mob_case', showMenu: true },
    component: () => import('../views/page/message/caseRecord/case.vue')
  },
  // {
  //   path: '/voice',
  //   meta: { title: '语音识别', icon: 'mob_voice', showMenu: true },
  //   component: () => import('../views/page/message/voice.vue')
  // },
  {
    path: '/dictionary',
    meta: { title: '数据字典', icon: 'mob_dictionary', showMenu: true },
    component: () => import('../views/page/message/dictionary.vue')
  },
  // ,
  // {
  //   path: '/scheduledTask',     //mob_permission.svg   权限     //角色    mob_role    //数据字典  mob_dictionary    mob_scheduledtask
  //   meta: { title: '定时任务', icon: 'mob_scheduledTask', showMenu: true },
  //   component: () => import('../views/page/message/scheduledTask.vue')
  // }
  {
    path: '/audioManage',
    meta: { title: '文件管理', icon: 'mob_dictionary', showMenu: true },
    component: () => import('../views/page/message/audioManage/index.vue')
  },
  {
    path: '/ConversationPartnerMana',
    meta: { title: '谈话对象管理', icon: 'mob_dictionary', showMenu: true },
    component: () => import('../views/page/message/ConversationPartnerMana.vue')
  }
]

import subMenu from '@/components/commonsubMenu.vue'
import { errorRoutes } from '@/router/error'

export const homeRoute = [
  {
    path: '/zhhome',
    meta: { title: '首页', showMenu: true },
    name: 'zhhome',
    redirect: '/home',
    component: subMenu,
    children: messageRoute
  },
  ...errorRoutes
]

