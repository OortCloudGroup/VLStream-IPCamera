<template>
  <div>
    <el-dialog v-model="dialogVisible" title="编辑方案" width="60%" top="5vh" :close-on-click-modal="false">
      <InfoSetting
        :data="editDataRes"
        :basic-list="editBasicList"
        :custom-field-list="editCustomFieldList"
        :is-user-setting="isUserSetting"
        :user-id="currentUserId"
        @update-basic-list="handleEditUpdateBasicList"
        @update-custom-fields="handleEditUpdateCustomFields"
      />
      <template #footer>
        <div class="dialog-footer-btns">
          <el-button @click="handleCancel">
            取消
          </el-button>
          <el-button type="primary" @click="handleEditSave">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { defaultInfo, deptGet, roleGet, getUserInfoByUserId, save, deptSave, roleSave, userSave } from '@/api/address_book/index'
import InfoSetting from '@/pages/address_book/views/page/setting/InfoSetting.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  schemeItem: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'refresh'])

const store = useUserStore()

// 计算属性来控制弹窗显示
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 编辑方案相关数据
let editDataRes = ref()
let editBasicList = ref()
let editCustomFieldList = ref()

// 计算是否为用户设置（entity_type为40表示用户）
const isUserSetting = computed(() => {
  return props.schemeItem?.entity_type === 40
})

// 计算当前用户ID（从 schemeItem.entity_id 获取）
const currentUserId = computed(() => {
  return isUserSetting.value ? props.schemeItem?.entity_id : null
})

// 监听弹窗显示状态，自动加载方案数据
watch(() => props.visible, async(newVal) => {
  if (newVal && props.schemeItem?.id) {
    await loadSchemeData()
  }
})

// 加载方案数据
const loadSchemeData = async() => {
  const accessToken = store.userInfo?.accessToken
  const entityType = props.schemeItem?.entity_type
  const entityId = props.schemeItem?.entity_id

  if (!accessToken || !entityType || !entityId) return

  let res: any = null

  // 默认设置（实体类型 10）
  if (entityType === 10) {
    const params = {
      accessToken,
      entity_id: entityId,
      entity_type: 10
    }
    res = await defaultInfo(params)
  }

  // 部门设置（实体类型 20）
  if (entityType === 20) {
    const params = {
      accessToken,
      deptcode: entityId,
      entity_type: 20
    }
    res = await deptGet(params)
  }

  // 角色设置（实体类型 30）
  if (entityType === 30) {
    const params = {
      accessToken,
      ruuid: entityId,
      entity_type: 30
    }
    res = await roleGet(params)
  }

  // 用户设置（实体类型 40）
  if (entityType === 40) {
    const params = {
      accessToken,
      entity_type: 40,
      oort_uuid: entityId
    }
    res = await getUserInfoByUserId(params)
  }

  if (res && res.code === 200) {
    // 将获取的数据赋值给编辑弹出框使用的数据
    editDataRes.value = res.data
    editBasicList.value = res.data.basic_field
    editCustomFieldList.value = res.data.custom_field
  }
}

// 处理编辑方案中子组件开关状态变化
const handleEditUpdateBasicList = (fieldKey: string, isShow: boolean) => {
  if (editBasicList.value && Array.isArray(editBasicList.value)) {
    const item = editBasicList.value.find(item => item.field_key === fieldKey)
    if (item) {
      item.is_show = isShow ? 1 : 0
    }
  }
}

// 处理编辑方案中扩展字段更新
const handleEditUpdateCustomFields = (customFields: any[]) => {
  editCustomFieldList.value = customFields
}

// 编辑方案保存
const handleEditSave = async() => {
  if (!editDataRes.value) {
    ElMessage.error('编辑数据不存在')
    return
  }

  const accessToken = store.userInfo?.accessToken
  const entityType = editDataRes.value.entity_type
  let res: any = null

  // 默认设置（实体类型 10）
  if (entityType === 10) {
    const params = {
      accessToken,
      save_type: 0,
      entity_id: editDataRes.value.entity_id,
      entity_type: 10,
      module_id: editDataRes.value.id,
      module_name: editDataRes.value.module_name,
      basic_field: editBasicList.value,
      custom_field: editCustomFieldList.value || []
    }
    res = await save(params)
  }

  // 部门设置（实体类型 20）
  if (entityType === 20) {
    const params = {
      accessToken,
      save_type: 0,
      deptcode: editDataRes.value.entity_id,
      entity_type: 20,
      module_id: editDataRes.value.id,
      module_name: editDataRes.value.module_name,
      basic_field: editBasicList.value,
      custom_field: editCustomFieldList.value || []
    }
    res = await deptSave(params)
  }

  // 角色设置（实体类型 30）
  if (entityType === 30) {
    const params = {
      accessToken,
      save_type: 0,
      ruuid: editDataRes.value.entity_id,
      entity_type: 30,
      module_id: editDataRes.value.id,
      module_name: editDataRes.value.module_name,
      basic_field: editBasicList.value,
      custom_field: editCustomFieldList.value || []
    }
    res = await roleSave(params)
  }

  // 用户设置（实体类型 40）
  if (entityType === 40) {
    const params = {
      accessToken,
      save_type: 0,
      entity_type: 40,
      oort_uuid: editDataRes.value.entity_id,
      module_id: editDataRes.value.id,
      module_name: editDataRes.value.module_name,
      basic_field: editBasicList.value,
      custom_field: editCustomFieldList.value || []
    }
    res = await userSave(params)
  }

  if (res && res.code === 200) {
    ElMessage.success('保存成功')
    dialogVisible.value = false
    // 通知父组件刷新数据
    emit('refresh')
  }
}

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.dialog-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
