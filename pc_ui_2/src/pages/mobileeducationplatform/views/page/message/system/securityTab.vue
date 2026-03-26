<template>
  <div class="systemBasic">
    <el-form v-if="props.tab==='s1'" ref="sbForm" class="sbForm" label-position="top" :model="form">
      <el-form-item label="RTSP认证">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="RTSP摘要算法">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="WEB认证">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="WEB摘要算法">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='s2'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用IP地址过滤
        </el-checkbox>
      </el-form-item>
      <el-form-item label="IP地址过滤方式">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <div>IP地址过滤</div>
    </el-form>
    <el-form v-if="props.tab==='s3'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          开启非法登录锁定
        </el-checkbox>
      </el-form-item>
      <el-form-item label="错误尝试次数">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='s4'" class="sbForm" label-position="top" :model="form">
      <div>安全加固</div>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用IP地址过滤
        </el-checkbox>
      </el-form-item>
      <div>空间超时配置</div>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用控件超时
        </el-checkbox>
      </el-form-item>
      <el-form-item label="超时时间">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <div>摘要算法</div>
      <el-form-item label="Digest">
        <el-input v-model="form.desc" placeholder="请输入" />
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
</style>
