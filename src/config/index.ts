type HEADERS = {
  [key: string]: any
}
type Config = {
  URL: string,
  gateWay: string,
  frontURLStr: string,
  configJSONData: object
  weixinLogin: boolean
  showDeal: boolean
  headers: HEADERS
  common?: any,
  webRTCSocketURL?: string

}

const config: Config = {
  // URL: '/http://192.168.88.98:8000', // 公司测试环境地址
  URL: '/carema',
  gateWay: '',
  frontURLStr: '/oort/oortcloud-policefront/',
  // 配置文件
  configJSONData: {},
  // 登录界面是否显示微信扫码登录
  weixinLogin: true,
  // 登录界面是否显示 服务协议和用户政策
  showDeal: false,
  // 请求头
  headers: {},
  webRTCSocketURL: 'ws://146.56.220.167:8082'
}

// 仓库环境本地调试
// config.URL = 'http://192.168.88.52:32610'

export default config
