<template>
  <div class="sidebar" :class="{sidebarW:!collapse}">
    <div class="sidebarT flexRowAC">
      <img class="sidebarImg" src="@/assets/img/warehouse/logo.png" alt="" />
      <div v-if="!collapse">
        管理平台
      </div>
    </div>
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="item in routesPath">
        <!--  item.children   -->
        <template v-if="item.children">
          <el-sub-menu :key="item.path" :index="item.path">
            <template #title>
              <img class="elmenuIconImg" :src="item.meta?.icon" alt="" />
              <img class="elmenuIconImg" :src="item.meta?.icon_" alt="" />
              <span>{{ item.meta?.title }}</span>
            </template>
            <div v-for="(subItem,i) in item.children" :key="i">
              <el-sub-menu
                v-if="subItem.children"
                :key="subItem.path"
                :index="subItem.path"
              >
                <template #title>
                  {{ subItem.meta?.title }}
                </template>
                <el-menu-item v-for="(threeItem, i) in subItem.children" :key="i" :index="threeItem.path">
                  {{ threeItem.meta?.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.path">
                {{ subItem.meta?.title }}
              </el-menu-item>
            </div>
          </el-sub-menu>
        </template>
        <!--   item     -->
        <template v-else>
          <el-menu-item :key="item.path" :index="item.path">
            <img class="elmenuIconImg" :src="item.meta?.icon" alt="" />
            <img class="elmenuIconImg" :src="item.meta?.icon_" alt="" />
            <template #title>
              <span>{{ item.meta?.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCounter } from '@/store/counter'
import { ElMenuItem } from 'element-plus'

const route = useRoute()
const router = useRouter()
const onRoutes = computed(() => {
  return route.path
})
const storeC: any = useCounter()
const collapse = computed(() => storeC.collapse)
// 默认项目管理
let routesPaths: any
if (router.options.routes[0].name === 'Home') {
  routesPaths = router.options.routes[0].children?.filter(v => v.name === 'project')[0].children
}
let routesPath = ref<any>(routesPaths)

// 统一支付 and 服务商 路由切换
// let routeClickFlag = false
// const routesClick = () => {
//   routeClickFlag = !routeClickFlag
//   if (routeClickFlag) {
//     routesPaths = router.options.routes[0].children?.filter(v => v.name === 'service')[0].children
//   } else {
//     routesPaths = router.options.routes[0].children?.filter(v => v.name === 'project')[0].children
//   }
//   routesPath.value = routesPaths
// }
</script>
<style lang='scss' scoped>
.elmenuIconImg {
  width: 14px;
  height: 14px;
  background-size: cover;
  margin-right: 8px;
}

.sidebarT {
  justify-content: center;
  height: 64px;
  font-size: 20px;
  color: #333333;
  font-weight: bold;
  background-color: #fff;
}

.sidebarImg {
  width: 32px;
  height: 32px;
  background: #1A53FF;
  border-radius: 6px;
  background-size: cover;
  margin-right: 10px;
}

.sidebar-el-menu:not(.el-menu--collapse),.sidebarW {
  width: 250px;
  flex-shrink: 0;
}

.sidebar {
  height: 100%;
  overflow: auto;

  :deep(.el-menu) {
    height: calc(100% - 64px);
    border-right: none;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.65);

    .el-menu-item {
      color: rgba(0, 0, 0, 0.65);

      &.is-active {
        @extend .ullihover;
        border-right: 3px solid #4246FF;

        .el-icon {
          color: #4246FF;
        }

        .el-sub-menu__title > span {
          color: #4246FF;
        }

        // 选择 显示
        .elmenuIconImg:first-child {
          display: none;
        }

        .elmenuIconImg:nth-child(2) {
          display: flex;
        }
      }
    }

    > li:hover, .el-sub-menu:hover {
      @extend .ullihover;
    }

    // 不选择 显示
    .elmenuIconImg:first-child {
      display: flex;
    }

    .elmenuIconImg:nth-child(2) {
      display: none;
    }

    .el-sub-menu.is-active {
      // 选择 显示
      .elmenuIconImg:first-child {
        display: none;
      }

      .elmenuIconImg:nth-child(2) {
        display: flex;
      }

      .el-sub-menu__title {
        color: #4246FF;
      }
    }

    .el-sub-menu__title {
      color: rgba(0, 0, 0, 0.65);

      &:hover {
        @extend .ullihover;
      }
    }
  }
}

.ullihover {
  background-color: #E6F0FF;
  color: #4246FF;
}
</style>
