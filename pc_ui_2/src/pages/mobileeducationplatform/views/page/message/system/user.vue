<template>
  <div class="macp_page">
    <el-tabs v-model="activeName" class="tenanat-tabs" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="u1" />
      <el-tab-pane label="在线用户" name="u2" />
    </el-tabs>
    <div>
      <user-tab :tab="activeName" />
    </div>
    <div class="submitBox flexRowAC">
      <div class="submit">
        保 存
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { TabsPaneContext } from 'element-plus'
import UserTab from '@/pages/cameraMana/views/page/message/system/userTab.vue'

const activeName = ref('u1')

// tabsClick
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

</script>
<style lang="scss" scoped>
.mer_content :deep(.header_cell) {
  color: #333;
  background-color: #FAFAFA;
}

.macp_page {
  height: calc(100% - 20px);
  width: 100%;
  overflow: auto;
  border-radius: 16px 16px 0px 0px;
  background: #fff;
  margin-top: 20px;
}

// tabs
:deep(.tenanat-tabs) {
  padding: 0 20px;

  .el-tabs__item {
    color: #999999;
  }

  .el-tabs__item.is-active {
    color: var(--el-color-primary);
  }
}

// tabs
:deep(.el-tabs__header) {
  padding-top: 10px;

  .el-tabs__nav-wrap::after {
    display: none;
  }

  .el-tabs__item.is-top {
    font-size: 16px;
    font-weight: 700;
  }
}

.submitBox {
  padding: 40px 20px;

  .submit {
    height: 48px;
    width: 170px;
    text-align: center;
    line-height: 48px;
    background: #1A53FF;
    border: 1px solid rgba(26, 83, 255, 1);
    border-radius: 2px;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
    font-weight: 400;
  }
}
</style>
