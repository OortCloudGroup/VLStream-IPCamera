<template>
  <div class="systemBasic">
    <!--基本信息-->
    <el-form v-if="props.tab==='mac1'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用限位
        </el-checkbox>
      </el-form-item>
      <el-form-item label="限位模式">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="限位状态">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <!--限位-->
    <el-form v-if="props.tab==='mac2'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用限位
        </el-checkbox>
      </el-form-item>
      <el-form-item label="限位模式">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="限位状态">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <!--零方位角-->
    <el-form v-if="props.tab==='mac3'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          关联预置点
        </el-checkbox>
      </el-form-item>
    </el-form>
    <!--配置清除-->
    <el-form v-if="props.tab==='mac7'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          全选
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          清除所有的预置点
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          清除所有的巡航路径
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          清除所有的隐私块
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          清除所有的限位设置
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          清除所有的定时任务
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          清除所有的守望
        </el-checkbox>
      </el-form-item>
    </el-form>
    <!--云台优先-->
    <el-form v-if="props.tab==='mac8'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="云台优先">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="延时">
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
