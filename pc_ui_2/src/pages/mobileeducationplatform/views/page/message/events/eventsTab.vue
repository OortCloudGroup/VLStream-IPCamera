<template>
  <div class="systemBasic">
    <!--移动侦测-->
    <el-form v-if="props.tab==='mac1'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用移动侦测
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用PTZ运动报警上报
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用动态分析
        </el-checkbox>
      </el-form-item>
    </el-form>
    <!--遮挡报警-->
    <el-form v-if="props.tab==='mac2'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用
        </el-checkbox>
      </el-form-item>
    </el-form>
    <!--报警输入-->
    <el-form v-if="props.tab==='mac3'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="报警输入号">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="IP地址">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="报警类型">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="报警名称">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          处理报警输入
        </el-checkbox>
      </el-form-item>
    </el-form>
    <!--报警输出-->
    <el-form v-if="props.tab==='mac4'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="报警输入号">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="IP地址">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="延时">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="报警名称">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="报警状态">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <div class="set_secu flexRowAC">
        布防时间
      </div>
    </el-form>
    <!--报警输出-->
    <el-form v-if="props.tab==='mac5'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="异常类型">
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

.set_secu {
  gap: 8px;
  padding-bottom: 20px;
  font-size: 16px;
  color: #1A53FF;
  font-weight: 400;
}
</style>
