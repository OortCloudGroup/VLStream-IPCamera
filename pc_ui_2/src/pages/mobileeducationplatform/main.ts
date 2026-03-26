import { createApp } from 'vue'
import store from '@/store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
// 注册echarts

import 'element-plus/dist/index.css'
import '@/assets/style/index.scss'

import 'virtual:svg-icons-register'

const app = createApp(App)
app.use(store)
app.use(router)

import OortSvgIcon from '@/components/oortSvgIcon/index.vue'
import oortImg from '@/components/oort_img.vue'
app.component('OortSvgIcon', OortSvgIcon)
app.component('OortImg', oortImg)

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
