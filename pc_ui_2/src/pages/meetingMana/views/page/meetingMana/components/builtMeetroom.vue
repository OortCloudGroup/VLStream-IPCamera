<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2025-04-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <div class="page">
    <el-form ref="formRef" class="refForm" label-position="top" :model="form" :rules="rules">
      <el-form-item label="会议室名称" prop="name">
        <el-input v-model="form.name" placeholder="输入会议室名称" />
      </el-form-item>
      <el-form-item label="容纳人数" prop="capacity">
        <el-input
          v-model.number="form.capacity"
          type="number"
          show-word-limit
          :max="999999999"
          placeholder="输入容纳人数"
          :min="1"
        />
      </el-form-item>
      <el-form-item label="会议室地址" prop="address">
        <el-input v-model="form.address" placeholder="输入会议室地址" />
      </el-form-item>
      <el-form-item label="设备列表">
        <el-input
          v-model="form.equipment"
          placeholder="例：&quot;投影仪&quot;,&quot;视频会议系统&quot;,&quot;白板&quot;"
        />
      </el-form-item>
      <el-form-item label="会议室门牌编号">
        <el-input
          v-model="form.door_number"
          placeholder="例：802944028"
        />
      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-button @click="emits('close')">
        取消
      </el-button>
      <el-button type="primary" @click="save(formRef)">
        保存
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts" name="addRoom">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, FormRules } from 'element-plus'
import { conferenceroomAdd, conferenceroomEdit } from '@/api/meetingMana'

const store: any = useUserStore()
const props = defineProps(['item'])
const emits: any = defineEmits(['handle', 'close'])
const formRef = ref('') // form Ref

const form = reactive({
  name: '',
  address: '',
  capacity: undefined,
  door_number: '',
  equipment: ''
})
const rules = reactive<FormRules<any>>({
  name: [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  capacity: [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入', trigger: 'blur' }
  ]
})

// 保存
const save = async(formEl: any) => {
  if (!formEl) return
  await formEl.validate(async(valid: boolean) => {
    if (valid) {
      let data = {
        accessToken: store.userInfo.accessToken,
        room_uid: props.item?.room_uid,
        ...form
      }
      let res: any = props.item ? await conferenceroomEdit(data) : await conferenceroomAdd(data)
      if (res.code === 200) {
        emits('close')
        emits('handle')
        ElMessage.success('保存成功')
      }
    } else {
      return false
    }
  })
}

function dataInfo(val) {
  form.name = val.name
  form.address = val.address
  form.capacity = val.capacity
  form.door_number = val.door_number
  form.equipment = val.equipment
}

if (props.item) dataInfo(props.item)
</script>
<style lang="scss" scoped>

</style>
