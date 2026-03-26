<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2024-11-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <div class="flexRowAC certPage">
    <div class="subMenu_content act">
      <router-view class="route_view" />
      <Bottom />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Bottom from '@/components/bottom.vue'

</script>
<style lang="scss" scoped>
.certPage {
  align-items: flex-start;
  height: 100%;
  margin-left: 20px;
  gap: 20px;

  .sidebar-el-menu.el-menu {
    padding-top: 20px;
    height: calc(100% - 20px);
    overflow: auto;
    &.subMenuLeft {
      width: 260px;
      flex-shrink: 0;
    }
  }

  .subMenu_content {
    height: calc(100% - 20px);
    border-radius: 10px 10px 0px 0px;
    background-color: #fff;
    margin-top: 20px;
    width: calc(100% - 280px);
    overflow: auto;
  }

  .route_view {
    min-height: calc(100vh - 64px);
  }

  .subMenu_content.act {
    flex: 1;
  }
}

</style>
