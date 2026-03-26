<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="查看方案"
      width="60%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <InfoSetting
        v-if="viewDataRes"
        :data="viewDataRes"
        :basic-list="viewBasicList"
        :custom-field-list="viewCustomFieldList"
        :is-user-setting="isUserSetting"
        :user-id="currentUserId"
      />
      <template #footer>
        <div class="dialog-footer-btns">
          <el-button @click="handleClose">
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { defaultInfo, deptGet, roleGet, getUserInfoByUserId } from '@/api/address_book/index'
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

const emit = defineEmits(['update:visible'])

const store = useUserStore()

// 弹窗显隐
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 查看方案数据
const viewDataRes = ref<any>()
const viewBasicList = ref<any[]>()
const viewCustomFieldList = ref<any[]>()

// 是否为用户设置（entity_type 为 40 表示用户）
const isUserSetting = computed(() => {
  return props.schemeItem?.entity_type === 40
})

// 当前用户 ID（从 schemeItem.entity_id 获取）
const currentUserId = computed(() => {
  return isUserSetting.value ? props.schemeItem?.entity_id : null
})

// 监听弹窗显示状态，加载方案数据
watch(
  () => props.visible,
  async(newVal) => {
    if (newVal && props.schemeItem) {
      await loadSchemeData()
    }
  }
)

// 加载方案数据（只读查看），根据 entity_type 调用不同接口
const loadSchemeData = async() => {
  const accessToken = store.userInfo?.accessToken
  const entityType = props.schemeItem?.entity_type

  if (!accessToken || !entityType) return

  let res: any = null

  // 默认设置（实体类型 10）
  if (entityType === 10) {
    const params = {
      accessToken,
      entity_id: props.schemeItem?.entity_id || 'oortoort-aabb-ccdd-eeff-eb29bb427381',
      entity_type: 10
    }
    res = await defaultInfo(params)
  }

  // 部门设置（实体类型 20）
  if (entityType === 20) {
    const params = {
      accessToken,
      deptcode: props.schemeItem?.entity_id || props.schemeItem?.deptcode || '',
      entity_type: 20
    }
    res = await deptGet(params)
  }

  // 角色设置（实体类型 30）
  if (entityType === 30) {
    const params = {
      accessToken,
      ruuid: props.schemeItem?.entity_id || props.schemeItem?.ruuid || '',
      entity_type: 30
    }
    res = await roleGet(params)
  }

  // 用户设置（实体类型 40）
  if (entityType === 40) {
    const params = {
      accessToken,
      entity_type: 40,
      oort_uuid: props.schemeItem?.entity_id || props.schemeItem?.oort_uuid || ''
    }
    res = await getUserInfoByUserId(params)
  }

  if (res.code === 200) {
    viewDataRes.value = res.data
    viewBasicList.value = res.data.basic_field
    viewCustomFieldList.value = res.data.custom_field
  }
}

const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.dialog-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.add-custom-field-btn) {
  display: none;
}

:deep(.section-title) {
  .icon_svg {
    display: none !important;
  }
}

:deep(.custom-form){
  .btn_icon, .info-icon,.container_svg{
    display: none !important;
  }
  .label-wrapper{
    padding-right: 0 !important;
  }
}
</style>
