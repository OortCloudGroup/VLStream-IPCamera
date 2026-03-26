<template>
  <div class="appN_Page">
    <el-form ref="smnForm" class="deptNForm" label-position="top" :model="form" :rules="rules">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          循环写入
        </el-checkbox>
      </el-form-item>
      <el-form-item label="预录时间" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="录像延时" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="码流类型" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-button @click="emits('close')">
        取消
      </el-button>
      <el-button type="primary" @click="save(smnForm)">
        保存
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { channelAdd } from '@/api/message/indexNew'
import { useUserStore } from '@/store/modules/user'

const props = defineProps(['item'])
const emits: any = defineEmits(['handle', 'close'])
const store: any = useUserStore()
const smnForm = ref('') // form Ref
const form = reactive({
  name: '',
  enable: '',
  channel_id: [],
  status: 1
})
const rules = reactive<FormRules<any>>({
  name: [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  channel_id: [
    { required: true, message: '请选择', trigger: 'blur' }
  ]
})

// 保存
const save = async(formEl: any) => {
  if (!formEl) return
  await formEl.validate((valid: boolean) => {
    if (valid) {
      let arr: any = []
      form.channel_id.forEach((item: any) => {
        arr.push(item.id)
      })
      let data = {
        accessToken: store.userInfo.accessToken,
        name: form.name,
        channel_id: arr.join(','),
        status: form.status
      }
      if (props.item) data['req_id'] = props.item.id
      channelAdd(data).then((res: any) => {
        if (res.code === 200) {
          emits('close')
          emits('handle')
          ElMessage.success(res.msg)
        }
      })
    } else {
      return false
    }
  })
}

watch(() => props.item, (newVal) => {
  if (newVal) {
    form.name = newVal.name
    form.status = newVal.status
  } else {
    form.name = ''
  }
}, { immediate: true })
</script>
<style lang="scss" scoped>
// form
:deep(.deptNForm ) {
  padding: 0 20px;

  .el-form-item__content {
    height: 40px;
  }

  .el-input {
    height: 100%;
  }
}

.channelidBox {
  cursor: pointer;
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.set_secu{
  gap: 8px;
  padding-bottom: 20px;
  font-size: 16px;
  color: #1A53FF;
  font-weight: 400;

  .BtnImg {
    width: 24px;
    height: 24px;
  }
}
</style>
