<template>
  <div class="systemBasic">
    <!--视频-->
    <el-form v-if="props.tab==='mac1'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="码流类型">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="视频分类">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="分辨率">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="码率质量">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="图像质量">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="视频帧率">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="码率上线">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="视频编码">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="Smart264">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="编码复杂度">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="I帧间隔">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="SVC">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="码流平滑">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <!--音频-->
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
    <!--ROI-->
    <el-form v-if="props.tab==='mac3'" class="sbForm" label-position="top" :model="form">
      <div class="set_secu flexRowAC">
        码流类型
      </div>
      <el-form-item label="码流类型">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <div class="set_secu flexRowAC">
        固定区域
      </div>
      <el-form-item label="区域编号">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="提升等级">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="区域名称">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <!--码流信息叠加-->
    <el-form v-if="props.tab==='mac4'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用支持智能后检索
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
