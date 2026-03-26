<template>
  <div class="wareNPage">
    <el-form
      ref="waMaForm"
      class="wareNForm flexRowAC"
      :model="form"
      label-position="top"
      label-width="auto"
      :rules="rules"
    >
      <el-form-item :label="props.title+'人'" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="资产编码" prop="record_id">
        <el-input
          v-model="form.record_idName"
          :disabled="disabledFlag"
          type="text"
          placeholder="先选择资产"
          @click="wareSelClick"
        />
      </el-form-item>
      <el-form-item label="数量:" prop="num">
        <el-input v-model="form.num" type="number" show-word-limit maxlength="20" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remarks" show-word-limit maxlength="20" type="text" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="图片" />
      <div />
    </el-form>
    <div style="text-align: right;">
      <el-button @click="emits('close')">
        取消
      </el-button>
      <el-button type="primary" @click="submitClick">
        保存
      </el-button>
    </div>
    <el-dialog
      v-model="warenVisi"
      title="选择资产"
      width="30%"
      :close-on-click-modal="false"
    >
      <ware-mana-new-dia @close="warenVisi=false" @handle="handleSel" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormRules } from 'element-plus'
import { ckmtOperationAdd } from '@/api/warehouse'
import { ElMessage, FormInstance } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import WareManaNewDia from '@/pages/warehouse/views/page/wareMana/wareManaNewDia.vue'

const emits: any = defineEmits(['handle', 'close'])
const props: any = defineProps(['status', 'title', 'item'])
const store: any = useUserStore()
const warenVisi = ref<boolean>(false)
const disabledFlag = ref<boolean>(false)
const waMaForm = ref<FormInstance>() // 必填项
const form = reactive({
  data: '',
  name: '',
  num: '',
  record_idName: '',
  record_id: '',
  remarks: '',
  status: props.status
})
const rules = reactive<FormRules<any>>({
  name: [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  record_id: [
    { required: true, message: '请选择', trigger: 'blur' }
  ],
  num: [
    { required: true, message: '请输入', trigger: 'blur' }
  ]
})

// 选择资产
const wareSelClick = () => {
  if (!props.item) {
    warenVisi.value = true
  }
}

// 选择资产handle
const handleSel = (val) => {
  form.record_idName = val['wg01']
  form.record_id = val.record_id
}

// 保存
const submitClick = async() => {
  waMaForm.value?.validate().then(async() => {
    let data = {
      accessToken: store.userInfo.accessToken,
      req_info: [{
        // data: '',
        name: form.name,
        num: parseInt(form.num),
        record_id: form.record_id,
        remarks: form.remarks,
        status: form.status
      }]
    }
    let res: any = await ckmtOperationAdd(data)
    if (res.code === 200) {
      ElMessage.success('添加记录成功')
      emits('handle')
      emits('close')
    }
  }).catch(() => {
    return false
  })
}

watch(() => props.item, (newVal) => {
  if (newVal) {
    disabledFlag.value = true
    form.record_idName = newVal['wg01']
    form.record_id = newVal.record_id
  } else {
    disabledFlag.value = false
    form.record_idName = ''
    form.record_id = ''
  }
}, { immediate: true })
</script>
<style lang="scss" scoped>
.wareNPage {
  padding: 0 20px;

}

:deep(.wareNForm) {
  flex-wrap: wrap;
  column-gap: 40px;

  .el-form-item {
    width: calc(50% - 20px);
  }

  .el-date-editor {
    width: 100%;
  }
}
</style>
