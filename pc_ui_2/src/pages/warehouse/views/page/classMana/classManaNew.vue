<template>
  <div class="wareNPage">
    <el-form ref="clasMIN" class="wareNForm" label-position="top" :model="form" label-width="auto" :rules="rules">
      <el-form-item label="上级分类:">
        <el-input v-model="form.pidName" disabled show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="分类名称:" prop="name">
        <el-input v-model="form.name" show-word-limit maxlength="20" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="分类排序:">
        <el-input v-model="form.sort" type="number" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-button @click="emits('close')">
        取消
      </el-button>
      <el-button type="primary" @click="submitClick">
        保存
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import type { FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { ckmtClassifyAdd, ckmtClassifyEdit } from '@/api/warehouse'
import { ElMessage, FormInstance } from 'element-plus'

const store: any = useUserStore()
const emits: any = defineEmits(['handle', 'close'])
const props = defineProps(['item', 'obj'])
const clasMIN = ref<FormInstance>() // 必填项
const form = reactive({
  pid: props.item.id,
  pidName: props.item.name,
  name: props.obj?.name || '',
  sort: props.obj?.sort || 1
})
const rules = reactive<FormRules<any>>({
  name: [
    { required: true, message: '请输入', trigger: 'blur' }
  ]
})

// 保存
const submitClick = () => {
  clasMIN.value?.validate().then(async() => {
    let data = {
      accessToken: store.userInfo.accessToken,
      name: form.name,
      pid: form.pid,
      sort: parseInt(form.sort)
    }
    if (props.obj) {
      data['id'] = props.obj.id
      let res: any = await ckmtClassifyEdit(data)
      if (res.code === 200) {
        ElMessage.success('修改分类成功')
        emits('handle')
        emits('close')
      }
    } else {
      let res: any = await ckmtClassifyAdd(data)
      if (res.code === 200) {
        ElMessage.success('添加分类成功')
        emits('handle')
        emits('close')
      }
    }
  }).catch(() => {
    return false
  })
}

function dataInfo(val: any) {
  form.pid = val.id
  form.pidName = val.name
  if (props.obj) {
    form.name = props.obj.name
    form.sort = props.obj.sort
  } else {
    form.name = ''
    form.sort = ''
  }
}

watchEffect(() => {
  if (props.item) {
    dataInfo(props.item)
  }
})

</script>
<style lang="scss" scoped>
.wareNPage {
  padding: 0 20px;

}

:deep(.wareNForm) {
  flex-wrap: wrap;
  column-gap: 40px;

  .el-date-editor {
    width: 100%;
  }
}
</style>
