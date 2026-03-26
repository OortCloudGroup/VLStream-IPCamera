<template>
  <div class="systemBasic">
    <el-form v-if="props.tab==='sys1'" ref="sbForm" class="sbForm" label-position="top" :model="form">
      <el-form-item label="设备名称">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="设备编号">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="设备型号">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="设备序列号">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="主控版本">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="编码版本">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="Web版本">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="Plugin版本">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="通道个数">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="硬盘个数">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="报警输入个数">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="报警输出个数">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="主控版本属性">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='sys2'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="时区">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="校时">
        <el-radio-group v-model="form.time">
          <el-radio :label="1">
            NTP校时
          </el-radio>
          <el-radio :label="2">
            手动校时
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="form.time===1">
        <el-form-item label="服务器地址">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="NTP端口">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="校时时间间隔">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
      </div>
      <div v-if="form.time===2">
        <el-form-item label="设备时间">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="设置时间">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
      </div>
    </el-form>
    <el-form v-if="props.tab==='sys3'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用夏令时
        </el-checkbox>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="结束">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="偏移时间">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='sys4'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="波特率">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="数据位">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="停止位">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="校验">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="流控">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="解码器类型">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="解码器地址">
        <el-input v-model="form.name" placeholder="请输入" />
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
}
</style>
