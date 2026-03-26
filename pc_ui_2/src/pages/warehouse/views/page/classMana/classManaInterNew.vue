<template>
  <div class="wareNPage">
    <el-form ref="clasMIN" class="wareNForm" label-position="top" :model="form" label-width="auto" :rules="rules">
      <el-form-item label="界面名称:" prop="name">
        <el-input v-model="form.name" show-word-limit maxlength="20" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="界面类型:" prop="type">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option label="浏览界面" :value="1" />
          <el-option label="搜索界面" :value="2" />
          <el-option label="录入界面" :value="3" />
          <el-option label="详情界面" :value="4" />
          <el-option label="统计界面" :value="5" />
        </el-select>
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
import { onMounted, reactive, ref, watch } from 'vue'
import type { FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { ckmtClassifyInAdd, ckmtClassifyInEdit, ckmtClassifyInInfo, ckmtClassifyInTem } from '@/api/warehouse'
import { ElMessage, FormInstance } from 'element-plus'
import { generateBrowerInterfaceJSON, generateInterfaceJSON } from '../xForm/util/formUtils'
import { useXFormStore } from '@/store/xForm'
const store = useUserStore()
const emits = defineEmits(['handle', 'close'])
const props = defineProps(['cid', 'id'])
const clasMIN = ref<FormInstance>() // 必填项
const form = reactive({
  name: '',
  type: ''
})
const rules = reactive<FormRules<any>>({
  name: [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择', trigger: 'blur' }
  ]
})

// 保存
const submitClick = () => {
  clasMIN.value?.validate().then(async() => {
    let data = {
      accessToken: store.userInfo.accessToken,
      cid: props.cid,
      name: form.name,
      type: form.type
    }
    if (props.id) {
      data['id'] = props.id
      let res = await ckmtClassifyInEdit(data)
      if (res.code === 200) {
        ElMessage.success('修改成功')
        emits('handle')
        emits('close')
      }
    } else {
      let res = await ckmtClassifyInAdd(data)
      if (res.code === 200) {
        // 新增浏览页面和搜索页面录入界面，自动生成主表样式的页面
        let arr = []
        if (form.type !== 1) {
          arr = generateInterfaceJSON(useXFormStore().currentTable)
        } else {
          arr = generateBrowerInterfaceJSON(useXFormStore().currentTable)
        }
        let json = { json: arr }
        const params = {
          accessToken: store.userInfo.accessToken,
          id: res.data.id,
          templet: json
        }
        let saveRes = await ckmtClassifyInTem(params)
        if (saveRes.code === 200) {
          ElMessage.success('添加成功')
          emits('handle')
          emits('close')
        }
      }
    }
  }).catch(() => {
    return false
  })
}

// 分类界面详情
const infoClick = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    id: props.id
  }
  let res = await ckmtClassifyInInfo(data)
  if (res.code === 200) {
    form.name = res.data.name
    form.type = res.data.type
    form['id'] = res.data.id
  }
}

watch(() => props.id, (valNew) => {
  if (valNew) {
    infoClick()
  }
})

onMounted(() => {
  if (props.id) {
    infoClick()
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
