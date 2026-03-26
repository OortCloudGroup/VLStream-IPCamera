<template>
  <div class="systemBasic">
    <el-form v-if="props.tab==='up1'" ref="sbForm" class="sbForm" label-position="top" :model="form">
      <el-form-item label="重启">
        <div>
          重启设备
        </div>
      </el-form-item>
      <el-form-item label="恢复默认值">
        <div>
          重启设备
        </div>
      </el-form-item>
      <el-form-item label="参数采集">
        <div>
          重启设备
        </div>
      </el-form-item>
      <el-form-item label="固件升级">
        <div>
          重启设备
        </div>
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='up3'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="硬件服务">
        <el-checkbox v-model="form.enable">
          启用补光灯
        </el-checkbox>
      </el-form-item>
      <el-form-item label="软件服务-预览连接数">
        <div class="softBox flexRowAC">
          <el-input v-model="form.desc" placeholder="请输入" />
          <el-checkbox v-model="form.enable">
            启用三码流
          </el-checkbox>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps(['tab'])
const form = reactive({
  name: '',
  enable: '',
  time: 1,
  desc: []
})
</script>
<style lang="scss" scoped>
.systemBasic {
  padding-left: 20px;
  width: 480px;

  .sbForm {
    .el-input {
      height: 40px;
    }
  }
  .softBox{
    width: 100%;
    gap: 12px;
  }
}
</style>
