<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2024-11-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <common-page-header :config="uiConfig.address_book">
    <template #menu>
      <div class="routeMenuBox">
        <el-menu
          :default-active="routePath"
          :ellipsis="false"
          text-color="#33333360"
          active-text-color="var(--el-color-primary)"
          class="routeMenu flexRowAC"
          mode="horizontal"
          router
        >
          <div v-for="item in routesPath" :key="item.path">
            <el-menu-item v-if="!item.meta?.type&& item.meta.showMenu" :index="item.path">
              {{ item.meta?.title }}
            </el-menu-item>
          </div>
        </el-menu>
      </div>
    </template>
  </common-page-header>
</template>

<script lang="ts" setup>
import CommonPageHeader from '@/components/commonPageHeader.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import uiConfig from '@/config/UIConfig'
import { useUserStore } from '@/store/modules/user'

const store: any = useUserStore()
const route = useRoute()
const routePath = computed(() => {
  if (route.matched.length > 3) {
    let temPath = ''
    // 找到那个重定向的路由，
    let rm = route.matched
    for (let i = rm.length - 1; i >= 0; i--) {
      if (rm[i].redirect) {
        temPath = '/' + rm[i].name
        break
      }
    }
    return temPath
  } else {
    return ''
  }
})

const routesPath = ref<any>(store.getLocalRouter())

</script>
<style lang="scss" scoped>
// 菜单menu
:deep(.routeMenuBox ul.el-menu.el-menu--horizontal) {
  border: none;

  .el-menu-item {
    font-size: 18px;
    background-color: transparent;
  }

  .el-menu-item:hover {
    background-color: var(--el-menu-hover-bg-color);
  }

  .el-menu-item.is-active {
    font-size: 18px;
    color: var(--el-color-primary);
    font-weight: 700;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      height: 3px;
      width: 24px;
      background:  var(--el-color-primary);
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
    }
  }
}

</style>
