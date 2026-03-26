<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2025-04-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <div class="case_newpage">
    <el-form ref="formRef" class="formBox" :model="form" :rules="rules" label-position="top">
      <el-form-item label="案例名称" prop="caseName">
        <el-input v-model="form.caseName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="案例类别" prop="caseType">
        <el-select
          v-model="form.caseType"
          placeholder="请选择"
          size="large"
        >
          <el-option
            v-for="item in caseTypes"
            :key="item.id"
            :label="item['categoryName']"
            :value="item['categoryType']"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="案例描述" prop="caseDescription">
        <el-input v-model="form.caseDescription" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="关联谈话记录">
        <el-select
          v-model="form.talkRecordName"
          :disabled="!form.caseType"
          multiple
          filterable
          remote
          reserve-keyword
          value-key="id"
          :placeholder="!form.caseType?'请选择案例类别':'请输入'"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="`${item.theme}(${item.policeName}/${item.policeCode})`"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上传word文档">
        <el-upload
          :show-file-list="false"
          class="avatar-uploader elIconBox"
          action="#"
          accept=".word,.doc,.docx"
          :on-change="beforeAvatarUpload"
          :multiple="false"
          :auto-upload="false"
        >
          <div class="elIconBoxUpOut">
            <div class="elIconBoxUp flexRowAC">
              <el-icon size="32">
                <Plus />
              </el-icon>
              选择
            </div>
            <div v-if="form.file">
              {{ form.file['name'] }}
            </div>
            <span class="sp flexRowAC"><el-icon><WarningFilled /></el-icon>仅支持 word,doc,docx 文档</span>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-button @click="emits('close')">
        取消
      </el-button>
      &nbsp;&nbsp;
      <el-button type="primary" @click="saveClick(formRef)">
        保存
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { getMemconList, saveCaseRecord } from '@/api/mobileeducationplatform/case'
import { useUserStore } from '@/store/modules/user'

const store: any = useUserStore()
const props:any = defineProps<{
  list: any[]
}>()
const emits: any = defineEmits(['handle', 'close'])
const formRef = ref('') // form Ref
let caseTypes = ref<any>(props.list || [])
const form = reactive({
  orgName: store.userInfo?.oort_depname,
  orgId: store.userInfo?.oort_depcode,
  createBy: store.userInfo?.oort_name || '',
  caseName: '',
  caseDescription: '',
  caseType: '',
  file: '',
  talkRecordName: '',
  talkRecordId: ''
})

const rules = reactive<FormRules<any>>({
  caseName: [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  caseDescription: [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  caseType: [
    { required: true, message: '请选择', trigger: 'blur' }
  ]
})

// 文件大小
const beforeAvatarUpload = (file: any) => {
  let isLt2M = file.size / 1024 / 1024 < 50
  if (!isLt2M) {
    ElMessage.error('文件过大，请压缩后上传')
  } else {
    form.file = file
  }
  return isLt2M
}

// 添加
const saveClick = async(formEl: any) => {
  if (!formEl) return
  await formEl.validate(async(valid: boolean) => {
    if (valid) {
      let list:any = form.talkRecordName || []
      let talkRecordNameArr:any
      let talkRecordIdArr:any
      if (list && list.length) {
        talkRecordNameArr = list.map((item: any) => `${item.theme}(${item.policeName}/${item.policeCode})`).join(',')
        talkRecordIdArr = list.map((item: any) => item.id).join(',')
      }
      let data = {
        accessToken: store.userInfo.accessToken,
        ...form,
        talkRecordName: talkRecordNameArr,
        talkRecordId: talkRecordIdArr,
        file: form.file?.['raw']
      }
      const formD = new FormData()
      for (let key in data) {
        if (data[key]) formD.append(key, data[key])
      }
      let res: any = await saveCaseRecord(formD)
      if (res.code === 200) {
        ElMessage.success('保存成功')
        emits('handle')
        emits('close')
      }
    } else {
      return false
    }
  })
}

// 关联谈话记录
const options = ref<any>([])
const loading = ref(false)
const remoteMethod = async(query: string) => {
  if (query) {
    loading.value = true
    let data = {
      departmentCode: store.userInfo?.oort_depcode,
      // talkType: form.caseType,
      theme: query,
      size: 99
    }
    let res = await getMemconList(data)
    if (res.code === 200) {
      loading.value = false
      options.value = res.data.records || []
    }
  } else {
    options.value = []
  }
}

</script>
<style lang="scss" scoped>lang
.case_newpage {
  height: 100%;
}

// form
:deep(.formBox ) {
  padding: 0 20px;

  .el-form-item__content .el-input, .el-select, .el-select__wrapper {
    min-height: 40px;
  }
}

.elIconBox {
  flex-direction: column;
  width: 188px;
  height: 110px;
  margin-bottom: 20px;
  color: var(--el-color-primary);
  border-radius: 4px;
  background: hsl(0, 0%, 100%);
  border: 1px dashed var(--el-color-primary);
  cursor: pointer;
  justify-content: center;

  &:hover {
    border: 1px solid var(--el-color-primary) !important;
    background-color: var(--el-color-primary-hb) !important;
  }

}

.elIconBoxUpOut {
  .elIconBoxUp {
    flex-direction: column;
    justify-content: center;
    width: 188px;
    height: 110px;
  }

  .sp {
    gap: 4px;
    font-size: 12px;
    color: #999;
  }
}
</style>
