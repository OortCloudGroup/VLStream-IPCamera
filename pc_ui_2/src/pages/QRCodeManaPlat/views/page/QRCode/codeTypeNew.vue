<template>
  <div class="c_new_page">
    <el-form :model="form" label-position="top" label-width="auto">
      <el-form-item label="类型名称：">
        <el-input v-model="form.qrTypeName" show-word-limit maxlength="20" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="类型ID">
        <el-input v-model="form.qrTypeId" placeholder="请输入类型ID，eg: 000" show-word-limit maxlength="3" />
      </el-form-item>
      <el-form-item label="第三方处理系统值：">
        <el-input v-model="form.otherSystemValues" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="描述：">
        <el-input
          v-model="form.qrTypeDescription"
          type="textarea"
          show-word-limit
          maxlength="256"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <div class="btnBox">
      <el-button @click="$emit('close')">
        取消
      </el-button>
      <el-button type="primary" @click="submitClick">
        {{ props.itemObj?.id ?"保存":"发布" }}
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { typeSave } from '@/api/QRcode'
import { ElMessage } from 'element-plus'

const props = defineProps(['itemObj'])
const emit = defineEmits(['close', 'handle'])
const form = reactive({
  qrTypeName: '',
  qrTypeId: '000',
  applicationName: '',
  otherSystemValues: '',
  qrTypeDescription: ''
})

// 保存
const submitClick = async() => {
  if (!form.qrTypeName) {
    return ElMessage.warning('类型名称')
  }
  if (form.qrTypeId.length !== 3) {
    return ElMessage.warning('类型ID不正确，类型ID三位字符串')
  }
  let data = {
    qrTypeName: form.qrTypeName,
    applicationName: form.applicationName,
    otherSystemValues: form.otherSystemValues,
    qrTypeDescription: form.qrTypeDescription,
    qrTypeId: form.qrTypeId
  }
  if (props.itemObj) {
    data['id'] = props.itemObj.id
  }
  let res: any = await typeSave(data)
  if (res.code === 200) {
    emit('handle')
    ElMessage.success('发布成功')
  }
}

watch(() => props.itemObj, () => {
  // 编辑
  if (props.itemObj) {
    form.qrTypeName = props.itemObj.qrTypeName
    form.qrTypeName = props.itemObj.qrTypeName
    form.applicationName = props.itemObj.applicationName
    form.otherSystemValues = props.itemObj.otherSystemValues
    form['id'] = props.itemObj.id
  }
}, { immediate: true })
</script>
<style lang='scss' scoped>
.c_new_page {
  padding: 20px;
}

.btnBox {
  text-align: right;
}
</style>
