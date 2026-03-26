<template>
  <div class="desc-setting">
    <div class="desc-row">
      <div class="section-title">
        <span class="line" />
        <span>基础信息</span>
        <div class="section-add" @click="openFieldPicker('basic')">
          <oort-svg-icon
            name="table_add"
            width="16"
            height="16"
            class="section-icon"
          />
          <span class="add-title">添加更多基础信息</span>
        </div>
      </div>
      <div class="field-tags">
        <div
          v-for="field in basicFields"
          :key="field.field_key"
          class="field-tag"
          :class="{ 'field-tag-active': activeField.list === 'basic' && activeField.key === field.field_key }"
          @mouseenter.stop="toggleCloseButton('basic', field.field_key, true)"
          @mouseleave.stop="toggleCloseButton('basic', field.field_key, false)"
        >
          <span class="field-tag-name">{{ field.label }}</span>
          <oort-svg-icon
            v-show="activeField.list === 'basic' && activeField.key === field.field_key"
            width="12"
            height="12"
            name="cer_del"
            class="close-icon"
            @click.stop="delBasic(field)"
          />
        </div>
      </div>
      <div class="section-title">
        <span class="line" />
        <span>扩展信息</span>
        <div class="section-add" @click="openFieldPicker('custom')">
          <oort-svg-icon
            name="table_add"
            width="16"
            height="16"
            class="section-icon"
          />
          <span class="add-title">添加更多扩展信息</span>
        </div>
      </div>
      <div class="field-tags">
        <div
          v-for="field in customFields"
          :key="field.field_key"
          class="field-tag"
          :class="{ 'field-tag-active': activeField.list === 'custom' && activeField.key === field.field_key }"
          @mouseenter.stop="toggleCloseButton('custom', field.field_key, true)"
          @mouseleave.stop="toggleCloseButton('custom', field.field_key, false)"
        >
          <span class="field-tag-name">{{ field.label }}</span>
          <oort-svg-icon
            v-show="activeField.list === 'custom' && activeField.key === field.field_key"
            width="12"
            height="12"
            name="cer_del"
            class="close-icon"
            @click.stop="del(field)"
          />
        </div>
      </div>
    </div>
    <div class="desc-preview">
      <div class="section-title">
        <span class="line" />
        <span>展示预览</span>
      </div>
      <div class="desc-right">
        <div>
          <span class="card-title">部门列表展示预览</span>
          <div class="desc_bg">
            <div class="preview-card">
              <div v-if="showDept" class="preview-header">
                {{ listPreviewTitle }}
              </div>
              <div class="preview-list">
                <div v-for="i in 16" :key="i" class="preview-row">
                  <oort-img :src="userL.avatar" class="preview-avatar" default-img="tx" />
                  <div style="display: flex;flex-direction: column">
                    <span class="preview-name">{{ userL.name }}</span>
                    <span class="preview-desc">
                      {{ buildDescription(previewDescData) || '' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span class="card-title">个人信息展示预览</span>
          <div class="desc_bg">
            <div class="preview-card">
              <div class="preview-header">
                <div>
                  <oort-img :src="userL.avatar" class="preview-avatar" default-img="tx" />
                </div>
                <div style="display: flex;flex-direction: column;gap: 5px">
                  <span class="preview-name">{{ userL.name }}</span>
                  <div class="preview-title">
                    {{ buildDescription(previewDescData) || '' }}
                  </div>
                </div>
              </div>
              <div class="preview-info">
                <template v-if="hasPreviewConfig">
                  <div
                    v-for="field in previewBasicFields"
                    :key="`basic-${field.field_key}`"
                    class="preview-row"
                  >
                    <span class="p_l">{{ field.label }}：</span>
                    <span class="p_r">{{ userL[fieldKeyMap[field.field_key] || field.field_key] || '' }}</span>
                  </div>
                  <div
                    v-for="field in previewCustomFields"
                    :key="`custom-${field.field_key}`"
                    class="preview-row"
                  >
                    <span class="p_l">{{ field.label }}：</span>
                    <span class="p_r">{{ userL[fieldKeyMap[field.field_key] || field.field_key] || '' }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <field-picker-dialog
      v-model:visible="moreDialogVisible"
      :type="moreDialogType"
      :entity-id="entityId"
      :entity-type="entityType"
      :selected-keys="selectedFieldKeys"
      @confirm="handleFieldPickerConfirm"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { userDetailDisplayGet, getUserInfoByUserId } from '@/api/address_book/index'
import FieldPickerDialog from './component/FieldPickerDialog.vue'

const store = useUserStore()

const props = defineProps<{
  deptName?: string // 兼容旧版本
  previewName?: string // 预览名称（部门/角色/用户）
  data?: {
    entity_id?: string
    entity_type?: number
    id?: string
    basic?: Array<{
      field_key: string
      label: string
      is_show?: number
    }>
    custom_field?: Array<{
      data_type?: string
      field_key: string
      label: string
      is_required?: boolean
      is_show?: number
      sort?: number
      id?: string
    }>
  } // 数据对象，用于删除操作
  basicList?: Array<{
    field_key: string
    label: string
    is_show?: number
  }> // 基础字段列表
  customFieldList?: Array<{
    data_type?: string
    field_key: string
    label: string
    is_required?: boolean
    is_show?: number
    sort?: number
    id?: string
  }> // 自定义字段列表
  modelId?: string // 通讯录模块id
  entityId?: string
  entityType?: number
  active?: boolean // 是否为当前激活的「通讯录描述」tab
  isUserSetting?: boolean // 标识是否为用户设置页面
  userId?: string | number // 用户ID，当isUserSetting为true时传入
  deptId?: string // 当前用户所在的部门ID
}>()

const emit = defineEmits(['update-custom-fields'])

// 存储接口返回的数据
const dataId = ref<string | number | null>(null)
type FieldItem = {
  data_type?: string
  field_key: string
  label: string
  is_required?: boolean
  is_show?: number
  sort?: number
  id?: string
}

const basicFields = ref<FieldItem[]>([])
const customFields = ref<FieldItem[]>([])

// 对基础字段进行排序，确保头像和姓名在最前面
const sortBasicFields = () => {
  const fields = [...basicFields.value]
  const photoIndex = fields.findIndex(f => f.field_key === 'oort_photo')
  const realNameIndex = fields.findIndex(f => f.field_key === 'realName')

  // 如果头像和姓名都不存在，或者已经在正确位置，则不需要排序
  if (photoIndex === -1 && realNameIndex === -1) {
    return
  }

  const result: FieldItem[] = []

  // 先添加头像
  if (photoIndex !== -1) {
    result.push(fields[photoIndex])
  }

  // 再添加姓名
  if (realNameIndex !== -1) {
    result.push(fields[realNameIndex])
  }

  // 添加其他字段
  fields.forEach((field, index) => {
    if (index !== photoIndex && index !== realNameIndex) {
      result.push(field)
    }
  })

  // 更新 basicFields，保持其他字段的相对顺序
  basicFields.value = result
  basicFields.value.forEach((item, index) => {
    item.sort = index
  })
}

// 预览区域不展示的字段（头像、姓名）
const PREVIEW_EXCLUDE_KEYS = ['oort_photo', 'realName']

const previewBasicFields = computed(() =>
  basicFields.value.filter((field) => !PREVIEW_EXCLUDE_KEYS.includes(field.field_key))
)
const previewCustomFields = computed(() =>
  customFields.value.filter((field) => !PREVIEW_EXCLUDE_KEYS.includes(field.field_key))
)

const hasPreviewConfig = computed(
  () => previewBasicFields.value.length > 0 || previewCustomFields.value.length > 0
)

const showAvatar = ref(false)
const showName = ref(false)
const showPosition = ref(false)
const showJob = ref(false)
const showPhone = ref(false)
const showDept = ref(false)
// 部门列表展示预览标题
const listPreviewTitle = computed(() => {
  if (props.entityType === 20 && props.previewName) {
    return props.previewName
  }
  return 'xx部门/xx分组'
})

const AVATAR_FIELD_KEYS = ['oort_photo']
const NAME_FIELD_KEYS = ['realName']
const POSITION_FIELD_KEYS = ['jobName']
const JOB_FIELD_KEYS = ['postName']
const PHONE_FIELD_KEYS = ['oort_phone']
const DEPT_FIELD_KEYS = ['deptName']

const hasFieldInConfig = (keys: string[]) => {
  const matcher = (field: FieldItem) => keys.includes(field.field_key)
  return basicFields.value.some(matcher) || customFields.value.some(matcher)
}

const updatePreviewVisibility = () => {
  showAvatar.value = hasFieldInConfig(AVATAR_FIELD_KEYS)
  showName.value = hasFieldInConfig(NAME_FIELD_KEYS)
  showPosition.value = hasFieldInConfig(POSITION_FIELD_KEYS)
  showJob.value = hasFieldInConfig(JOB_FIELD_KEYS)
  showPhone.value = hasFieldInConfig(PHONE_FIELD_KEYS)
  showDept.value = hasFieldInConfig(DEPT_FIELD_KEYS)
}

const normalizeFieldList = (list: Array<Record<string, any>> = []) => {
  return list
    .filter((field) => field && field.field_key)
    .map((field, index) => ({
      data_type: field.data_type || 'string',
      field_key: field.field_key,
      label: field.label || field.field_key,
      is_required: field.is_required || false,
      is_show: field.is_show ?? 1,
      sort: index,
      id: field.id || ''
    }))
}

// 预览区域描述字段数据（将已选字段转换为 describe_basic_fields / describe_custom_fields 结构）
const previewDescData = computed(() => {
  const basic = basicFields.value.map((field, index) => ({
    label: field.label,
    field_key: field.field_key,
    field_value: field.field_key,
    sort: field.sort ?? index
  }))

  const custom = customFields.value.map((field, index) => ({
    label: field.label,
    field_key: field.field_key,
    field_value: field.field_key,
    sort: field.sort ?? index
  }))

  return {
    describe_basic_fields: basic,
    describe_custom_fields: custom
  }
})

// 组合描述字段：describe_basic_fields + describe_custom_fields 的「label：field_key」，用竖线分隔
const buildDescription = (detailData: any) => {
  const basic = Array.isArray(detailData?.describe_basic_fields)
    ? detailData.describe_basic_fields
    : []
  const custom = Array.isArray(detailData?.describe_custom_fields)
    ? detailData.describe_custom_fields
    : []

  const all = [...basic, ...custom]
  if (!all.length) return ''

  const values = all
    .filter((item: any) => item)
    .sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0))
    .map((item: any) => {
      const label = item.label || ''
      const key = item.field_value || ''
      return `${label}：${key}`
    })

  return values.join(' | ')
}

// 调用 userDetailDisplayGet 接口
const fetchDisplayData = async() => {
  if (!props.modelId) {
    return
  }

  try {
    const params = {
      accessToken: store.userInfo?.accessToken,
      entity_type: props.entityType,
      entity_id: props.entityId,
      model_id: props.modelId
    }
    const res = await userDetailDisplayGet(params) as any
    if (res.code === 200 && res.data) {
      const data = res.data
      dataId.value = data.id ?? null

      let basicSource: any[] = []
      let customSource: any[] = []

      if (Array.isArray(data.list) && data.list.length > 0) {
        const firstItem = data.list[0]
        basicSource = firstItem.basic_field_display || []
        customSource = firstItem.custom_field_display || []
      } else {
        basicSource = data.basic_field_display || []
        customSource = data.custom_field_display || []
      }

      basicFields.value = normalizeFieldList(basicSource)
      customFields.value = normalizeFieldList(customSource)
      sortBasicFields()
      updatePreviewVisibility()
    } else {
      dataId.value = null
      basicFields.value = []
      customFields.value = []
      updatePreviewVisibility()
    }
  } catch (error) {
    // 接口调用失败，重置状态
    dataId.value = null
    basicFields.value = []
    customFields.value = []
    updatePreviewVisibility()
  }
}

// 只有在当前 tab 处于激活状态且有 modelId 时才调用接口
watch(
  () => [props.active, props.modelId] as const,
  ([active, modelId]) => {
    if (active && modelId) {
      fetchDisplayData()
    }
  }
)

// 获取保存数据的方法，供父组件调用
const getSaveData = () => {
  const id = dataId.value !== undefined && dataId.value !== null ? dataId.value : null

  return {
    basic_field_display: basicFields.value.map((field) => ({
      field_key: field.field_key,
      label: field.label
    })),
    custom_field_display: customFields.value.map((field) => ({
      field_key: field.field_key,
      id: field.id || '',
      label: field.label
    })),
    id: id
  }
}

// 暴露方法给父组件调用
defineExpose({
  getSaveData
})

// userL 对象用于存储字段值，初始化为示例数据
const userL = ref<Record<string, any>>({
  avatar: '',
  name: '张三',
  idCard: '11010119900101****',
  gender: '未知',
  loginAccount: 'zhangsan',
  oort_phone: '138****8888',
  oort_username: 'zhangsan',
  oort_namefl: 'ZS',
  oort_namepy: 'zhangsan',
  userId: 'U001',
  oort_status: '启用',
  dept: '技术部',
  deptId: 'D001',
  accountType: '正式账号',
  userType: '正式账号',
  oort_email: 'zhangsan@example.com',
  oort_office: 'A座101',
  officePhone: '010-12345678',
  privatePhone: '139****9999',
  position: '软件工程师',
  job: '高级工程师',
  oort_remark: '技术骨干，负责核心系统开发',
  oort_address: '北京市朝阳区建国路88号SOHO现代城A座',
  oort_area: '北京市朝阳区',
  oort_postcode: '100000',
  oort_dingding: '13800138000',
  oort_weixin: 'wx_zhangsan'
})

// 获取用户实际信息（仅当 entityType 为 40 时，即用户设置）
const fetchUserInfo = async() => {
  if (!props.isUserSetting || !props.userId) {
    return
  }

  const params = {
    accessToken: store.userInfo?.accessToken,
    desensitize: true,
    oort_uuid: props.userId
  }
  const res = await getUserInfoByUserId(params) as any

  if (res.code === 200 && res.data) {
    const userData = res.data
    userL.value.avatar = userData.oort_photo
    userL.value.name = userData.user_detail?.ex_data?.realName
    userL.value.idCard = userData?.user_detail?.ex_data?.idcard ?? ''
    userL.value.gender = userData?.user_detail?.ex_data?.sex || '未知'
    userL.value.loginAccount = userData.unique_login_id?.oort_loginid
    userL.value.oort_phone = userData?.user_detail?.ex_data?.oort_phone ?? ''
    userL.value.oort_username = userData.oort_name
    userL.value.oort_namefl = userData?.user_name_fpy || ''
    userL.value.oort_namepy = userData?.user_name_py || ''
    userL.value.userId = userData?.user_detail?.ex_data?.userCode || ''
    userL.value.oort_status = userData.oort_status === 1 ? '启用' : '禁用'
    const userDeptList = Array.isArray(userData.user_dept) ? userData.user_dept : []
    const targetDept = userDeptList.find((item: any) => item.oort_dcode === props.deptId) ||
      userDeptList.find((item: any) => item.is_main) ||
      userDeptList[0]

    if (targetDept?.dept) {
      userL.value.dept = targetDept.dept.oort_dname
      userL.value.deptId = targetDept.dept.dept_code
      userL.value.position = targetDept?.job?.[0]?.name ?? ''
      userL.value.job = targetDept?.post?.[0]?.name ?? ''
    } else {
      userL.value.dept = ''
      userL.value.deptId = ''
      userL.value.position = ''
      userL.value.job = ''
    }
    userL.value.oort_email = userData?.user_detail?.ex_data?.oort_email ?? ''
    const deptExData = targetDept?.ex_data || {}
    userL.value.oort_office = deptExData.oort_office ?? ''
    userL.value.officePhone = deptExData.tel ?? ''
    userL.value.privatePhone = userData?.unique_phone?.oort_phone ?? ''
    userL.value.oort_remark = userData?.user_detail?.ex_data?.mark ?? ''
    userL.value.oort_address = userData?.user_detail?.ex_data?.oort_address ?? ''
    userL.value.oort_area = Array.isArray(userData?.user_detail?.ex_data?.oort_area)
      ? userData.user_detail.ex_data.oort_area.join('')
      : (userData?.user_detail?.ex_data?.oort_area ?? '')
    userL.value.oort_postcode = userData?.user_detail?.ex_data?.oort_postcode ?? ''
    userL.value.oort_dingding = userData?.user_detail?.ex_data?.oort_dingding ?? ''
    userL.value.oort_weixin = userData?.user_detail?.ex_data?.oort_weixin ?? ''
  }
}

// 字段映射：从 field_key 映射到 userL 的字段名
const fieldKeyMap: Record<string, string> = {
  oort_photo: 'avatar',
  realName: 'name',
  idcard: 'idCard',
  sex: 'gender',
  loginId: 'loginAccount',
  oort_phone: 'oort_phone',
  oort_username: 'oort_username',
  oort_namefl: 'oort_namefl',
  oort_namepy: 'oort_namepy',
  userCode: 'userId',
  oort_status: 'oort_status',
  deptName: 'dept',
  deptCode: 'deptId',
  accountType: 'accountType',
  userType: 'userType',
  oort_email: 'oort_email',
  oort_office: 'oort_office',
  tel: 'officePhone',
  private: 'privatePhone',
  jobName: 'position',
  postName: 'job',
  mark: 'oort_remark',
  oort_address: 'oort_address',
  oort_area: 'oort_area',
  oort_postcode: 'oort_postcode',
  oort_dingding: 'oort_dingding',
  oort_weixin: 'oort_weixin'
}

// 根据props.data.basic赋值userL
watch(
  () => props.data,
  (val) => {
    if (val && Array.isArray(val.basic_field)) {
      val.basic_field.forEach((item) => {
        const userLKey = fieldKeyMap[item.field_key]
        if (userLKey && Object.prototype.hasOwnProperty.call(userL.value, userLKey)) {
          // 字段已存在，保持当前值（如果是从用户信息获取的，则已更新）
        }
      })
    }
  },
  { immediate: true, deep: true }
)

// 监听 userId 变化，自动获取用户信息
watch(
  () => props.userId,
  (newUserId) => {
    if (props.isUserSetting && newUserId) {
      fetchUserInfo()
    }
  },
  { immediate: true }
)

// 监听父组件传入的自定义字段数据
watch(
  () => props.customFieldList,
  (newCustomFields) => {
    if (Array.isArray(newCustomFields) && newCustomFields.length > 0) {
      customFields.value = normalizeFieldList(newCustomFields as any)
    } else if (!props.modelId) {
      customFields.value = []
    }
  },
  { immediate: true }
)

watch(
  () => [basicFields.value, customFields.value],
  () => updatePreviewVisibility(),
  { deep: true }
)

const syncUserFields = (fields: FieldItem[]) => {
  fields.forEach((field) => {
    // 使用字段映射，将 field_key 映射到 userL 的字段名
    const userLKey = fieldKeyMap[field.field_key] || field.field_key
    if (!(userLKey in userL.value)) {
      // 如果字段不存在，根据字段类型设置默认值
      if (fieldKeyMap[field.field_key]) {
        // 已映射的字段，使用默认值（已在 userL 初始化时设置）
      } else {
        // 未映射的字段（通常是扩展字段），设置为空字符串
        userL.value[userLKey] = ''
      }
    }
  })
}

watch(
  () => basicFields.value,
  (fields) => {
    syncUserFields(fields)
  },
  { deep: true }
)

watch(
  () => customFields.value,
  (fields) => {
    syncUserFields(fields)
  },
  { deep: true }
)

// 跟踪当前鼠标悬停的字段
const activeField = ref({ list: null as 'basic' | 'custom' | null, key: null as string | null })

// 控制关闭按钮的显示
const toggleCloseButton = (listType: 'basic' | 'custom', fieldKey: string, isEnter: boolean) => {
  if (isEnter) {
    activeField.value = { list: listType, key: fieldKey }
  } else {
    if (activeField.value.list === listType && activeField.value.key === fieldKey) {
      activeField.value = { list: null, key: null }
    }
  }
}

const removeFieldFromList = (list: FieldItem[], fieldKey: string) => {
  const index = list.findIndex((item) => item.field_key === fieldKey)
  if (index !== -1) {
    list.splice(index, 1)
    list.forEach((item, idx) => {
      item.sort = idx
    })
    delete userL.value[fieldKey]
    return true
  }
  return false
}

const delBasic = async(field: FieldItem) => {
  if (removeFieldFromList(basicFields.value, field.field_key)) {
    // ElMessage.success('删除成功')
    activeField.value = { list: null, key: null }
  }
}

const del = async(field) => {
  if (removeFieldFromList(customFields.value, field.field_key)) {
    // ElMessage.success('删除成功')
    emit('update-custom-fields', customFields.value)
    activeField.value = { list: null, key: null }
  }
}

const moreDialogVisible = ref(false)
const moreDialogType = ref<'basic' | 'custom'>('basic')
const entityId = computed(() => props.entityId ?? props.data?.entity_id ?? '')
const entityType = computed(() => props.entityType ?? props.data?.entity_type ?? 10)
const selectedFieldKeys = computed(() => {
  const list = moreDialogType.value === 'basic' ? basicFields.value : customFields.value
  return list.map((item) => item.field_key)
})

const openFieldPicker = (type: 'basic' | 'custom') => {
  if (!entityId.value) {
    let msg = '缺少实体信息，无法获取更多字段'
    const et = entityType.value
    if (et === 20) msg = '请选择部门'
    else if (et === 30) msg = '请选择角色'
    else if (et === 40) msg = '请选择用户'
    ElMessage.warning(msg)
    return
  }
  moreDialogType.value = type
  moreDialogVisible.value = true
}

const addFieldsToList = (targetRef: { value: FieldItem[] }, fields: FieldItem[], isBasic = false) => {
  fields.forEach((field) => {
    if (!targetRef.value.some((item) => item.field_key === field.field_key)) {
      targetRef.value.push({
        ...field,
        sort: targetRef.value.length
      })
      if (!(field.field_key in userL.value)) {
        userL.value[field.field_key] = ''
      }
    }
  })
  // 如果是基础字段列表，添加字段后重新排序
  if (isBasic) {
    sortBasicFields()
  }
}

const handleFieldPickerConfirm = (data: { added: FieldItem[], removed: FieldItem[] } | FieldItem[]) => {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      moreDialogVisible.value = false
      return
    }
    if (moreDialogType.value === 'basic') {
      addFieldsToList(basicFields, data, true)
    } else {
      addFieldsToList(customFields, data, false)
      emit('update-custom-fields', customFields.value)
    }
    moreDialogVisible.value = false
    return
  }

  const { added = [], removed = [] } = data

  // 处理删除的字段
  if (removed.length > 0) {
    removed.forEach((field) => {
      if (moreDialogType.value === 'basic') {
        removeFieldFromList(basicFields.value, field.field_key)
      } else {
        removeFieldFromList(customFields.value, field.field_key)
        emit('update-custom-fields', customFields.value)
      }
    })
  }

  // 处理新增的字段
  if (added.length > 0) {
    if (moreDialogType.value === 'basic') {
      addFieldsToList(basicFields, added, true)
    } else {
      addFieldsToList(customFields, added, false)
      emit('update-custom-fields', customFields.value)
    }
  }

  moreDialogVisible.value = false
}
</script>
<style scoped lang="scss">
.desc-setting {
  display: flex;
  gap: 48px;
  .desc-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 24px;
    span {
      font-size: 16px;
      color: #333333;
      line-height: 22px;
    }
    .line {
      width: 4px;
      height: 18px;
      background-color: var(--el-color-primary);
    }
  }
    .desc-row {
      flex: 1;
      display: flex;
      flex-direction: column;
      .desc_body{
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
        .desc-label {
          font-size: 14px;
          color: #333333;
        }
      }
      .section-title {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 24px;
        span {
          font-size: 16px;
          color: #333333;
          line-height: 22px;
        }
        .line {
          width: 4px;
          height: 18px;
          background-color: var(--el-color-primary);
        }
        .section-add{
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 3px;
          .section-icon{
            width: 16px;
            height: 16px;
          }
          .add-title{
            font-size: 13px;
            color: var(--el-color-primary);
          }
        }
      }
  }
  .desc-preview {
    flex: 1;
    .desc-right{
      display: flex;
      gap: 20px;
    }
    .card-title{
      margin-left: 55px;
      font-weight: normal;
      font-size: 15px;
    }
    .desc_bg{
      display: flex;
      //align-items: center;
      background-image: url("@/assets/img/address_book/sjmx.png");
      background-repeat: no-repeat;
      background-size: cover;
      width: 380px;
      height: 669px;
    }
    .section-title{
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 24px;
      span {
        font-size: 16px;
        color: #333333;
        line-height: 22px;
      }
      .line {
        width: 4px;
        height: 18px;
        background-color: var(--el-color-primary);
      }
    }
    .preview-card {
      width: 75%;
      height: 75%;
      margin: 70px auto 0;
      padding: 0 20px 20px 20px;
      overflow-y: scroll;
      scrollbar-width: none;
      .preview-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
        .preview-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
        }
        .preview-name {
          font-size: 14px;
        color: #333333;
        }
        .preview-title {
          font-size: 10px;
          color: #666666;
        }
      }
      .preview-list {
        .preview-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 20px;
          .preview-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
          .preview-name {
            font-size: 10.89px;
            color: #333333;
          }
          .preview-desc {
            font-size: 9.33px;
            color: #666666;
          }
        }
      }
      .preview-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;
        .preview-row {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          justify-content: space-between;
          .p_l {
            font-size: 12px;
            color: #333333;
          }
          .p_r{
            font-size: 10px;
            color: #333333;
          }
        }
      }
    }
  }
}
.desc-select {
  width: 360px;
}
.option-inner{
  display: flex;
  align-items: center;
  gap: 22px;
  .desc-img{
    width: 14px;
    height: 18px;
  }
}
.el-select__dropdown {
  width: 260px;
}
.el-select-dropdown__item{
  height: 45px;
  line-height: 45px;
  font-weight: 400;
}
.el-select-dropdown__item:hover {
  background: var(--el-color-primary-hb);
  color: var(--el-color-primary);
}
.el-select-dropdown__item.selected {
  background: var(--el-color-primary-hb) !important;
  color: var(--el-color-primary) !important;
}

// 字段标签样式
.field-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.field-tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  background: #F1F2F5;
  border-radius: 4px;
  cursor: default;
  transition: all 0.2s;

  .field-tag-name {
    color: #191919;
    font-size: 14px;
    line-height: 22px;
  }

  .close-icon {
    position: absolute;
    top: 2px;
    right: 2px;
    cursor: pointer;
    font-size: 12px;
    --el-icon-size: 12px;
  }
}

.field-tag-active {
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 #00000019;
}
</style>
