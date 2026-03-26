<template>
  <div class="macp_page">
    <el-tabs v-model="activeName" class="tenanat-tabs" @tab-click="handleClick">
      <el-tab-pane label="SNMP" name="mac1" />
      <el-tab-pane label="FTP" name="mac2" />
      <el-tab-pane label="Email" name="mac3" />
      <el-tab-pane label="平台接入" name="mac4" />
      <el-tab-pane label="HTTPS" name="mac5" />
      <el-tab-pane label="QoS" name="mac6" />
      <el-tab-pane label="802.1X" name="mac7" />
      <el-tab-pane label="集成协议" name="mac8" />
      <el-tab-pane label="网络服务" name="mac9" />
      <el-tab-pane label="HTTP监听" name="mac10" />
    </el-tabs>
    <div>
      <advance-tab :tab="activeName" />
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
import AdvanceTab from '@/pages/cameraMana/views/page/message/network/advanceTab.vue'

const activeName = ref('mac1')

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
