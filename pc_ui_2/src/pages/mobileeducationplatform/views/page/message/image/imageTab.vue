<template>
  <div class="systemBasic">
    <!--显示设置-->
    <el-form v-if="props.tab==='mac1'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="场景">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <!--OSD设置-->
    <el-form v-if="props.tab==='mac2'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="音频编码">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="音频输入">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="输入音量">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="环境噪声过滤">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <!--图像参数切换-->
    <el-form v-if="props.tab==='mac3'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          关联预置点
        </el-checkbox>
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
console.log(props.tab)
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
}

.set_secu {
  gap: 8px;
  padding-bottom: 20px;
  font-size: 16px;
  color: #1A53FF;
  font-weight: 400;
}
</style>
