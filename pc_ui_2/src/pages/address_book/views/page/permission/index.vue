<template>
  <div class="setting-page">
    <div class="setting-header">
      <el-tabs v-model="mainTab" class="main-tabs">
        <el-tab-pane label="用户设置" name="user" />
        <el-tab-pane label="部门设置" name="dept" />
        <el-tab-pane label="角色设置" name="role" />
      </el-tabs>
    </div>
    <div class="setting-body">
      <div class="setting-content">
        <addressBookPer v-if="mainTab==='user'" />
        <deptPermission v-if="mainTab==='dept'" />
        <rolePermission v-if="mainTab==='role'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import addressBookPer from './addressBookPer.vue'
import deptPermission from './deptPermission.vue'
import rolePermission from './rolePermission.vue'
const mainTab = ref('user')
</script>

<style scoped lang="scss">
.setting-page {
  padding: 20px;
  width: 100%;
  border-radius: var(--common-border-radius) var(--common-border-radius) 0 0;
  flex: 1;
  background: #fff;
  .setting-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .main-tabs {
      width: 100%;
      :deep(.el-tabs__nav) {
        font-size: 18px;
        line-height: 28px;
        font-weight: 400;
      }
      :deep(.el-tabs__active-bar){
        width: 120px;
      }
      :deep(.el-tabs__item){
        width: 120px;
        padding: 0;
        font-size: 18px;
        letter-spacing: 0;
        line-height: 28px;
        font-weight: 400;
      }
      :deep(.el-tabs__item.is-active) {
        color: var(--el-color-primary);
      }
      :deep(.sub-tabs .el-tabs__nav-wrap::after) {
        display: none;
      }
    }
    .save-btn {
      background: #1976FF;
      border-radius: 4px;
      font-size: 15px;
      padding: 8px 32px;
      font-weight: 500;
    }
  }
}
</style>
