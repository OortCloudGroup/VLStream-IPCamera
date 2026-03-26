<template>
  <div class="statisPage">
    <div class="staTab flexRowAC">
      <div class="staItem">
        扫码统计
      </div>
      <div class="staItem act">
        扫码历史
      </div>
    </div>
    <div>
      <el-table :data="tableData">
        <el-table-column prop="date" label="序号" width="180" />
        <el-table-column prop="value" label="扫码人员" />
        <el-table-column prop="value" label="扫码时间" />
      </el-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref<any>([])
tableData.value = [
  {
    date: '1',
    value: '扫码人'
  }
]
</script>
<style lang='scss' scoped>
.staTab {
  gap: 34px;

  .staItem {
    cursor: pointer;
    font-size: 16px;
    color: #939393;
  }

  .staItem.act {
    font-size: 16px;
    color: var(--el-color-primary);
  }
}
</style>
