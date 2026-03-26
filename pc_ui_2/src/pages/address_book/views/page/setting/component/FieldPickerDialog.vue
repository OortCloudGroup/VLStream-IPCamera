<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="35%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="field-picker">
      <el-skeleton v-if="loading" :rows="6" animated />
      <template v-else>
        <el-empty
          v-if="fieldOptions.length === 0"
          description="暂无可用字段"
          :image-size="120"
        />
        <el-checkbox-group
          v-else
          v-model="checkedKeys"
          class="field-checkbox-group"
        >
          <el-checkbox
            v-for="item in fieldOptions"
            :key="item.field_key"
            :label="item.field_key"
          >
            <div class="field-item">
              <span class="field-label">{{ item.label }}</span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </template>
    </div>
    <div class="dialog_header_btns">
      <el-button @click="handleClose">
        取 消
      </el-button>
      <el-button type="primary" @click="handleConfirm">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { defaultInfo, deptGet, roleGet, getUserInfoByUserId } from '@/api/address_book/index'
import { useUserStore } from '@/store/modules/user'

type FieldItem = {
  data_type?: string
  field_key: string
  label: string
  is_required?: boolean
  is_show?: number
  sort?: number
  id?: string
}

const props = defineProps<{
  visible: boolean
  type: 'basic' | 'custom'
  entityId?: string
  entityType?: number
  selectedKeys: string[]
}>()

const emit = defineEmits(['update:visible', 'confirm'])

const store = useUserStore()

const loading = ref(false)
const fieldOptions = ref<FieldItem[]>([])
const checkedKeys = ref<string[]>([])

const dialogTitle = computed(() =>
  props.type === 'basic' ? '添加更多基础信息' : '添加更多扩展信息'
)

const normalizeFields = (list: any[] = []) => {
  return list
    .filter((item) => {
      if (!item || !item.field_key || item.is_show !== 1) return false
      // 过滤掉头像和姓名相关字段
      const key = item.field_key
      if (key === 'oort_photo' || key === 'oort_name' || key === 'oort_username') {
        return false
      }
      return true
    })
    .map((item, index) => ({
      data_type: item.data_type || 'string',
      field_key: item.field_key,
      label: item.label || item.field_key,
      is_required: item.is_required || false,
      is_show: item.is_show ?? 1,
      sort: index,
      id: item.id || ''
    }))
}

const syncCheckedWithSelected = () => {
  // 已选字段保持为选中状态
  checkedKeys.value = Array.from(new Set([...props.selectedKeys, ...checkedKeys.value]))
}

const fetchFields = async() => {
  if (!props.entityId || !props.entityType) {
    fieldOptions.value = []
    return
  }

  loading.value = true
  try {
    const accessToken = store.userInfo?.accessToken
    const entityType = props.entityType

    let res: any = null

    if (entityType === 10) {
      const params = {
        accessToken,
        entity_id: props.entityId,
        entity_type: 10
      }
      res = await defaultInfo(params)
    }

    if (entityType === 20) {
      const params = {
        accessToken,
        deptcode: props.entityId,
        entity_type: 20
      }
      res = await deptGet(params)
    }

    if (entityType === 30) {
      const params = {
        accessToken,
        ruuid: props.entityId,
        entity_type: 30
      }
      res = await roleGet(params)
    }

    if (entityType === 40) {
      const params = {
        accessToken,
        entity_type: 40,
        oort_uuid: props.entityId
      }
      res = await getUserInfoByUserId(params)
    }

    if (res && res.code === 200 && res.data) {
      const list =
        props.type === 'basic' ? res.data.basic_field || [] : res.data.custom_field || []
      fieldOptions.value = normalizeFields(list)
      syncCheckedWithSelected()
    } else {
      fieldOptions.value = []
    }
  } catch (error) {
    fieldOptions.value = []
  } finally {
    loading.value = false
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      checkedKeys.value = [...props.selectedKeys]
      fetchFields()
    } else {
      checkedKeys.value = []
    }
  }
)

watch(
  () => props.type,
  () => {
    if (props.visible) {
      checkedKeys.value = [...props.selectedKeys]
      fetchFields()
    }
  }
)

watch(
  () => props.selectedKeys.join(','),
  () => {
    if (props.visible) {
      checkedKeys.value = [...props.selectedKeys]
      fetchFields()
    }
  }
)

watch(
  () => props.entityId,
  () => {
    if (props.visible) {
      checkedKeys.value = []
      fetchFields()
    }
  }
)

const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  const newKeys = checkedKeys.value.filter(
    (key) => !props.selectedKeys.includes(key)
  )
  const removedKeys = props.selectedKeys.filter(
    (key) => !checkedKeys.value.includes(key)
  )

  if (newKeys.length === 0 && removedKeys.length === 0) {
    handleClose()
    return
  }

  const addedFields = fieldOptions.value.filter((item) =>
    newKeys.includes(item.field_key)
  )
  const removedFields = fieldOptions.value.filter((item) =>
    removedKeys.includes(item.field_key)
  )

  emit('confirm', {
    added: addedFields,
    removed: removedFields
  })
  handleClose()
}
</script>

<style scoped lang="scss">
.field-picker {
  min-height: 220px;
  padding: 8px 0;
}

.field-checkbox-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding-right: 8px;
  :deep(.el-checkbox) {
    margin-right: 0;
    margin-bottom: 0;
  }
}

.field-item {
  display: flex;
  align-items: center;
  .field-label {
    font-size: 14px;
    color: #333333;
  }
}

.dialog_header_btns {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>

