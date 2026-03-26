<template>
  <div class="systemBasic">
    <div v-if="props.tab==='mac1'">
      <el-table :show-overflow-tooltip="true" header-cell-class-name="header_cell" stripe :data="tableData">
        <el-table-column prop="name" label="序号" />
        <el-table-column prop="name1" label="用户名" />
        <el-table-column prop="name2" label="用户类型" />
      </el-table>
    </div>
    <div v-if="props.tab==='mac2'">
      <el-table :show-overflow-tooltip="true" header-cell-class-name="header_cell" stripe :data="tableData">
        <el-table-column prop="name" label="磁盘号" />
        <el-table-column prop="name1" label="服务器地址" />
        <el-table-column prop="name2" label="路径文件" />
        <el-table-column prop="name2" label="类型" />
        <el-table-column prop="name2" label="操作" />
      </el-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['tab'])
let tableData = ref<any>()

</script>
<style lang="scss" scoped>
.systemBasic {
  padding-left: 20px;
  width: 880px;

  .sbForm {
    .el-input {
      height: 40px;
    }
  }
}

.set_secu {
  gap: 8px;
  padding-bottom: 20px;
  font-size: 16px;
  color: #1A53FF;
  font-weight: 400;
}
</style>
