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

import OortSvgIcon from '@/components/oortSvgIcon/index.vue'
import oortImg from '@/components/oort_img.vue'

const app = createApp(App)
app.use(store)
app.use(router)

app.component('OortSvgIcon', OortSvgIcon)
app.component('OortImg', oortImg)

// 高级搜索-导出
import SearchHeightBox from '@/components/SearchHeightBox.vue'
import ExportExcelPdf from '@/components/exportExcelPdf.vue'
app.component('SearchHeightBox', SearchHeightBox)
app.component('ExportExcelPdf', ExportExcelPdf)

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
