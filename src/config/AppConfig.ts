/**
 Created by  lanjian   on 2024/5/8  15:32
 Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
 */

import { env } from './envConfig'

const oaAppConfig = {
  // 摄像机管理后台
  'cameraMana': {
    appID: '7c170a697c0447f8a45bbac4d96dfef6',
    secretKey: '9cc161f366e24ab98e1362f0e21a721d',
    requestType: 'app'
  }
}

const appEnv = env

let AppConfig = oaAppConfig
if (appEnv === 'oa') {
  AppConfig = oaAppConfig
}

export default AppConfig
