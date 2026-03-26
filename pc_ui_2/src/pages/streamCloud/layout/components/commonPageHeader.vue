<template>
  <div class="header_container flexRowAC">
    <div class="main_header_logos">
      <div v-if="config" class="main_header_logos">
        <oort-img v-if="logoWhite" :src="logoWhite" style="height:2.19rem;width: auto" />
        <span>{{ login_logo_text }}</span>
      </div>
    </div>
    <div class="routeMenuBox">
      <el-menu
        :default-active="routePath"
        :ellipsis="false"
        text-color="#A4A7B2"
        class="routeMenu flexRowAC"
        background-color="var(--oort-primary)"
        mode="horizontal"
        router
      >
        <div v-for="item in routesPath" :key="item.path">
          <el-menu-item :index="item.path">
            {{ item.meta?.title }}
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <common-page-header-right-info />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import config from '@/config'
import CommonPageHeaderRightInfo from '@/components/commonPageHeaderRightInfo.vue'
import OortImg from '@/components/oort_img.vue'
import initConfig from '@/utils/initConfig'

const route = useRoute()
const router = useRouter()
let logoWhite = ref('') // 图片
let login_logo_text = ref('') // 图片说明
let routePath = ref('') // 默认菜单

if (route.matched.length > 3) {
  let rm = route.matched
  let r_matched: any = rm[rm.length - 2].name || rm[rm.length - 3].name || 'home'
  routePath.value = '/' + r_matched
}
// 默认项目管理
let routesPaths: any
if (router.options.routes[0].name === 'Home') {
  routesPaths = router.options.routes[0].children?.filter(v => v.name === 'home')[0].children
}
let routesPath = ref<any>(routesPaths)

initConfig().then((res: any) => {
  if (res.status === 200) {
    logoWhite.value = config['logo']
    logoWhite.value = config['logoWhite']
  }
})
</script>
<style lang="scss" scoped>
// 菜单menu
:deep(.routeMenuBox ul.el-menu.el-menu--horizontal) {
  border: none;

  .el-menu-item {
    font-size: 18px;
  }
  .el-menu-item:hover {
    color: #1A53FF;
    background-color: transparent;
  }

  .el-menu-item.is-active {
    color: #1A53FF;
    font-weight: 700;
    border-bottom: 3px solid #1A53FF;
    background-color: transparent;
  }
}

.header_container {
  flex: 1;
  height: 64px;
  min-height: 64px;
  padding: 20px;
  justify-content: space-between;
  background-color: #1C233F;
}
</style>
