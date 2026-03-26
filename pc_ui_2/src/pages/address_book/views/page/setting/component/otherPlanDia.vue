<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="props.isEdit ? '编辑方案' : '另存为方案'"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="方案名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入方案名称" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="描述" prop="oort_remark">
          <el-input v-model="formData.oort_remark" type="textarea" :rows="6" placeholder="请输入描述" maxlength="200" show-word-limit />
          <aiIconRemark disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer-btns">
          <el-button @click="handleCancel">
            取消
          </el-button>
          <el-button type="primary" @click="handleSaveScheme">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { save, deptSave, roleSave, userSave, edit } from '@/api/address_book/index'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dataRes: {
    type: Object,
    default: () => ({})
  },
  basicList: {
    type: Array,
    default: () => []
  },
  customFieldList: {
    type: Array,
    default: () => []
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'success'])

const store = useUserStore()
const formRef = ref<FormInstance>()

// 计算属性来控制弹窗显示
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 监听弹窗打开，初始化表单数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (props.isEdit && props.dataRes) {
      // 编辑模式，填充表单数据
      formData.value = {
        name: props.dataRes.module_name || '',
        oort_remark: props.dataRes.oort_remark || ''
      }
    } else {
      // 新增模式，重置表单
      formData.value = {
        name: '',
        oort_remark: ''
      }
    }
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }
})

// 表单数据
const formData = ref({
  name: '',
  oort_remark: ''
})
// 表单验证规则
const formRules = ref<FormRules>({
  name: [
    { required: true, message: '请输入方案名称', trigger: 'blur' }
  ]
})

// 取消操作
const handleCancel = () => {
  // 重置表单
  formData.value = {
    name: '',
    oort_remark: ''
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
  dialogVisible.value = false
}

// 保存方案
const handleSaveScheme = async() => {
  if (!formRef.value) return

  await formRef.value.validate()

  if (props.isEdit) {
    // 编辑模式，调用 edit 接口
    const editParams = {
      accessToken: store.userInfo?.accessToken,
      id: props.dataRes?.id || '',
      module_id: props.dataRes?.module_id || props.dataRes?.id || '',
      module_name: formData.value.name,
      oort_remark: formData.value.oort_remark,
      entity_id: props.dataRes?.entity_id || '',
      entity_type: props.dataRes?.entity_type || 20,
      basic_id: props.dataRes?.basic_id || null,
      model_icon: props.dataRes?.model_icon || '',
      status: props.dataRes?.status || 1
    }

    const res = await edit(editParams) as any
    if (res.code === 200) {
      ElMessage.success('方案编辑成功')
      dialogVisible.value = false
      emit('success')
      // 重置表单
      handleCancel()
    }
  } else {
    // 新增模式，根据 entity_type 调用不同的保存接口
    const accessToken = store.userInfo?.accessToken
    const entityType = props.dataRes?.entity_type || 20
    let res: any = null

    // 默认设置（实体类型 10）
    if (entityType === 10) {
      const params = {
        accessToken,
        save_type: 1, // 另存为类型
        entity_id: props.dataRes?.entity_id || 'oortoort-aabb-ccdd-eeff-eb29bb427381',
        entity_type: 10,
        module_id: '111111111',
        module_name: formData.value.name,
        oort_remark: formData.value.oort_remark,
        basic_field: props.basicList || [],
        custom_field: props.customFieldList || []
      }
      res = await save(params)
    }

    // 部门设置（实体类型 20）
    if (entityType === 20) {
      const params = {
        accessToken,
        save_type: 1, // 另存为类型
        deptcode: props.dataRes?.entity_id || props.dataRes?.deptcode || '',
        entity_type: 20,
        module_id: '111111111',
        module_name: formData.value.name,
        oort_remark: formData.value.oort_remark,
        basic_field: props.basicList || [],
        custom_field: props.customFieldList || []
      }
      res = await deptSave(params)
    }

    // 角色设置（实体类型 30）
    if (entityType === 30) {
      const params = {
        accessToken,
        save_type: 1, // 另存为类型
        ruuid: props.dataRes?.entity_id || props.dataRes?.ruuid || '',
        entity_type: 30,
        module_id: '111111111',
        module_name: formData.value.name,
        oort_remark: formData.value.oort_remark,
        basic_field: props.basicList || [],
        custom_field: props.customFieldList || []
      }
      res = await roleSave(params)
    }

    // 用户设置（实体类型 40）
    if (entityType === 40) {
      const params = {
        accessToken,
        save_type: 1, // 另存为类型
        entity_type: 40,
        oort_uuid: props.dataRes?.entity_id || props.dataRes?.oort_uuid || '',
        module_id: '111111111',
        module_name: formData.value.name,
        oort_remark: formData.value.oort_remark,
        basic_field: props.basicList || [],
        custom_field: props.customFieldList || []
      }
      res = await userSave(params)
    }

    if (res && res.code === 200) {
      ElMessage.success('方案保存成功')
      dialogVisible.value = false
      emit('success')
      // 重置表单
      handleCancel()
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
