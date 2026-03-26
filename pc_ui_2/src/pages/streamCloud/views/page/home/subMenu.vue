<template>
  <div class="flexRowAC certPage">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
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
              <template v-if="subItem.menuShow!=='hidden'">
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
              </template>
            </div>
          </el-sub-menu>
        </template>
        <!--   item     -->
        <template v-else>
          <template v-if="item.menuShow!=='hidden'">
            <el-menu-item :key="item.path" :index="item.path">
              <img class="elmenuIconImg" :src="item.meta?.icon" alt="" />
              <img class="elmenuIconImg" :src="item.meta?.icon_" alt="" />
              <template #title>
                <span>{{ item.meta?.title }}</span>
              </template>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMenuItem } from 'element-plus'

const route = useRoute()
const router = useRouter()
let routesPath = ref<any>([])

// 默认菜单
const onRoutes = computed(() => {
  return route.path
})

// 右边栏 子级路由 3层路由嵌套
watch(() => route.path, () => {
  if (route.matched.length > 3) {
    let rm = route.matched
    let r_matched = rm[rm.length - 2].name || rm[rm.length - 3].name || 'videoC'
    let RORN = router.options.routes[0]
    if (RORN.name === 'Home') {
      let RORN_ = RORN.children?.[0].children?.filter(v => v.name === r_matched)[0].children
      routesPath.value = RORN_
    }
  }
}, { immediate: true })
</script>
<style lang="scss" scoped>
.elmenuIconImg {
  width: 20px;
  height: 20px;
  background-size: cover;
  margin-right: 8px;
}

.certPage {
  align-items: flex-start;
  height: 100%;
  gap: 20px;

  .sidebar-el-menu.el-menu {
    width: 260px;
    flex-shrink: 0;
    height: 100%;
  }

  .content {
    height: calc(100% - 20px);
    border-radius: 10px 10px 0px 0px;
    background-color: #1C233F;
    margin-top: 20px;
    flex: 1;
  }
}

.certPage {
  height: 100%;
  overflow: auto;

  :deep(.el-menu) {
    height: calc(100% - 64px);
    border-right: none;
    background-color: #1C233F;
    color: #A4A7B2;

    .el-menu-item {
      color: #A4A7B2;

      &.is-active {
        @extend .ullihover;
        border-right: 4px solid #1A53FF;

        .el-icon {
          color: #fff;
        }

        .el-sub-menu__title > span {
          color: #fff;
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
        color: #A4A7B2;
      }
    }

    .el-sub-menu__title {
      color: #A4A7B2;

      &:hover {
        @extend .ullihover;
      }
    }
  }
}

.ullihover {
  background-color: #32395E;
  color: #fff;
}
</style>
