<template>
  <div class="visible-scope-dialog">
    <div class="visible-scope-header">
      <div class="title">
        <oort-img :src="userAvatar" class="title-avatar" :default-img="avatarDefaultType" />
        <div class="title-text">
          <div class="name">
            {{ displayName }}
          </div>
          <div class="desc">
            {{ userDeptName }}
          </div>
        </div>
      </div>
    </div>
    <div class="display-switch-row">
      <span class="display-switch-label">是否在通讯录中显示：</span>
      <el-switch
        v-model="showInContact"
        @change="handleDisplaySwitchChange"
      />
    </div>
    <div class="mode-row">
      <div>
        <span class="mode-label">权限模式：</span>
        <el-radio-group v-model="mode">
          <el-radio :label="0">
            无限制
          </el-radio>
          <el-radio :label="1">
            隐藏
          </el-radio>
          <el-radio :label="2">
            限制外部门
          </el-radio>
          <el-radio :label="3">
            限制所有人
          </el-radio>
        </el-radio-group>
      </div>
      <el-button
        type="primary"
        @click="handleClear"
      >
        清空
      </el-button>
    </div>
    <div class="mode-tip">
      <img src="@/assets/img/address_book/tip_icon.png" alt="" />
      <div>
        {{ modeHint }}
      </div>
    </div>

    <div class="scope-groups">
      <div
        class="scope-group danger"
        :class="{ 'scope-group--disabled': !canEditHidden }"
      >
        <div class="group-title">
          <svg class="group-icon icon-hidden" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3l18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6c-1.6 0-3-.34-4.29-.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
            <path d="M9.17 9.17A3.5 3.5 0 0012 15.5a3.5 3.5 0 002.33-.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          </svg>
          <div>
            <div class="group-title__text">
              隐藏 / 不可见范围
            </div>
            <div class="group-title__desc">
              配置后，在通讯录中该用户不能看到以下部门和用户
            </div>
          </div>
        </div>
        <div class="group-cards">
          <div class="scope-card">
            <div class="scope-card__header" @click="toggleHiddenDepts">
              <div class="scope-card__header-left">
                <oort-svg-icon name="dept" width="18" height="18" />
                <span>不可见部门（{{ hiddenDepts.length }}）</span>
              </div>
              <el-icon>
                <component :is="hiddenDeptsExpanded ? ArrowUp : ArrowDown" />
              </el-icon>
            </div>
            <transition name="fade">
              <div v-show="hiddenDeptsExpanded" class="scope-card__body">
                <div class="avatar-group">
                  <el-avatar
                    class="avatar-32 plus-avatar actionable"
                    @click.stop="openDeptDialog('hiddenDepts')"
                  >
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </el-avatar>
                  <el-tooltip
                    v-for="item in displayHiddenDepts"
                    :key="item.id"
                    :content="item.desc || item.name || '-'"
                    placement="top"
                    :open-delay="300"
                  >
                    <div
                      class="user_item"
                      :class="{
                        'user-active':
                          activeDept.list === 'hiddenDepts' && activeDept.id === item.id
                      }"
                      @mouseenter.stop="toggleDeptCloseButton('hiddenDepts', item.id, true)"
                      @mouseleave.stop="toggleDeptCloseButton('hiddenDepts', item.id, false)"
                    >
                      <div class="dept-avatar">
                        <oort-svg-icon name="dept" width="20" height="20" />
                      </div>
                      <span class="oort_name">
                        {{ item.name || '-' }}
                      </span>
                      <oort-svg-icon
                        v-show="activeDept.list === 'hiddenDepts' && activeDept.id === item.id"
                        width="12"
                        height="12"
                        name="cer_del"
                        class="close-icon"
                        @click.stop="handleRemoveDept('hiddenDepts', item)"
                      />
                    </div>
                  </el-tooltip>
                  <div
                    v-if="hiddenDepts.length > DEPT_DISPLAY_LIMIT"
                    class="load-more"
                  >
                    <span
                      class="load-more__link"
                      @click.stop="showAllHiddenDepts = !showAllHiddenDepts"
                    >
                      {{ showAllHiddenDepts ? '收起' : '更多' }}
                    </span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <div class="scope-card">
            <div class="scope-card__header" @click="toggleHiddenUsers">
              <div class="scope-card__header-left">
                <oort-svg-icon name="user" width="18" height="18" />
                <span>不可见用户（{{ hiddenUsers.length }}）</span>
              </div>
              <el-icon>
                <component :is="hiddenUsersExpanded ? ArrowUp : ArrowDown" />
              </el-icon>
            </div>
            <transition name="fade">
              <div v-show="hiddenUsersExpanded" class="scope-card__body">
                <div class="avatar-group">
                  <el-avatar
                    class="avatar-32 plus-avatar actionable"
                    @click.stop="openUserSelectDialog('hiddenUsers')"
                  >
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </el-avatar>
                  <div
                    v-for="item in displayHiddenUsers"
                    :key="item.id"
                    class="user_item"
                    :class="{
                      'user-active':
                        activeUser.list === 'hiddenUsers' && activeUser.id === item.id
                    }"
                    @mouseenter.stop="toggleCloseButton('hiddenUsers', item.id, true)"
                    @mouseleave.stop="toggleCloseButton('hiddenUsers', item.id, false)"
                  >
                    <oort-img :src="item.avatar" class="avatar-32 user_img" default-img="tx" />
                    <span class="oort_name">
                      {{ item.name || '-' }}
                    </span>
                    <oort-svg-icon
                      v-show="activeUser.list === 'hiddenUsers' && activeUser.id === item.id"
                      width="12"
                      height="12"
                      name="cer_del"
                      class="close-icon"
                      @click.stop="handleRemoveUser('hiddenUsers', item)"
                    />
                  </div>
                  <div
                    v-if="hiddenUsers.length > USER_DISPLAY_LIMIT"
                    class="load-more"
                  >
                    <span
                      class="load-more__link"
                      @click.stop="showAllHiddenUsers = !showAllHiddenUsers"
                    >
                      {{ showAllHiddenUsers ? '收起' : '更多' }}
                    </span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <div
        class="scope-group success"
        :class="{ 'scope-group--disabled': !canEditExtra }"
      >
        <div class="group-title">
          <svg class="group-icon icon-visible" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="2" fill="none" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
          <div>
            <div class="group-title__text">
              额外 / 例外可见范围
            </div>
            <div class="group-title__desc">
              除默认范围外，用户可额外看到以下的部门和用户
            </div>
          </div>
        </div>
        <div class="group-cards">
          <div class="scope-card">
            <div class="scope-card__header" @click="toggleExtraDepts">
              <div class="scope-card__header-left">
                <oort-svg-icon name="dept" width="18" height="18" />
                <span>额外可见部门（{{ extraDepts.length }}）</span>
              </div>
              <el-icon>
                <component :is="extraDeptsExpanded ? ArrowUp : ArrowDown" />
              </el-icon>
            </div>
            <transition name="fade">
              <div v-show="extraDeptsExpanded" class="scope-card__body">
                <div class="avatar-group">
                  <el-avatar
                    class="avatar-32 plus-avatar actionable"
                    @click.stop="openDeptDialog('extraDepts')"
                  >
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </el-avatar>
                  <el-tooltip
                    v-for="item in displayExtraDepts"
                    :key="item.id"
                    :content="item.desc || item.name || '-'"
                    placement="top"
                    :open-delay="300"
                  >
                    <div
                      class="user_item"
                      :class="{
                        'user-active':
                          activeDept.list === 'extraDepts' && activeDept.id === item.id
                      }"
                      @mouseenter.stop="toggleDeptCloseButton('extraDepts', item.id, true)"
                      @mouseleave.stop="toggleDeptCloseButton('extraDepts', item.id, false)"
                    >
                      <div class="dept-avatar">
                        <oort-svg-icon name="dept" width="20" height="20" />
                      </div>
                      <span class="oort_name">
                        {{ item.name || '-' }}
                      </span>
                      <oort-svg-icon
                        v-show="activeDept.list === 'extraDepts' && activeDept.id === item.id"
                        width="12"
                        height="12"
                        name="cer_del"
                        class="close-icon"
                        @click.stop="handleRemoveDept('extraDepts', item)"
                      />
                    </div>
                  </el-tooltip>
                  <div
                    v-if="extraDepts.length > DEPT_DISPLAY_LIMIT"
                    class="load-more"
                  >
                    <span
                      class="load-more__link"
                      @click.stop="showAllExtraDepts = !showAllExtraDepts"
                    >
                      {{ showAllExtraDepts ? '收起' : '更多' }}
                    </span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <div class="scope-card">
            <div class="scope-card__header" @click="toggleExtraUsers">
              <div class="scope-card__header-left">
                <oort-svg-icon name="user" width="18" height="18" />
                <span>额外可见用户（{{ extraUsers.length }}）</span>
              </div>
              <el-icon>
                <component :is="extraUsersExpanded ? ArrowUp : ArrowDown" />
              </el-icon>
            </div>
            <transition name="fade">
              <div v-show="extraUsersExpanded" class="scope-card__body">
                <div class="avatar-group">
                  <el-avatar
                    class="avatar-32 plus-avatar actionable"
                    @click.stop="openUserSelectDialog('extraUsers')"
                  >
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </el-avatar>
                  <div
                    v-for="item in displayExtraUsers"
                    :key="item.id"
                    class="user_item"
                    :class="{
                      'user-active':
                        activeUser.list === 'extraUsers' && activeUser.id === item.id
                    }"
                    @mouseenter.stop="toggleCloseButton('extraUsers', item.id, true)"
                    @mouseleave.stop="toggleCloseButton('extraUsers', item.id, false)"
                  >
                    <oort-img :src="item.avatar" class="avatar-32 user_img" default-img="tx" />
                    <span class="oort_name">
                      {{ item.name || '-' }}
                    </span>
                    <oort-svg-icon
                      v-show="activeUser.list === 'extraUsers' && activeUser.id === item.id"
                      width="12"
                      height="12"
                      name="cer_del"
                      class="close-icon"
                      @click.stop="handleRemoveUser('extraUsers', item)"
                    />
                  </div>
                  <div
                    v-if="extraUsers.length > USER_DISPLAY_LIMIT"
                    class="load-more"
                  >
                    <span
                      class="load-more__link"
                      @click.stop="showAllExtraUsers = !showAllExtraUsers"
                    >
                      {{ showAllExtraUsers ? '收起' : '更多' }}
                    </span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="handleCancel">
        取消
      </el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">
        保存
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowDown, ArrowUp, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getContactScope, saveContactScope, deleteContactScope } from '@/api/address_book'
import { useCounter } from '@/store/counter'
import { deptList } from '@/api/address_book'
import { useUserStore } from '@/store/modules/user'

const store = useUserStore()
const storeC = useCounter()

interface ScopeItem {
  id: string | number
  name: string
  desc?: string
  avatar?: string
}

const props = defineProps<{
  data: Record<string, any>
  setType?: number // 设置类型 0 用户 1角色 2部门
}>()

const emit = defineEmits<{
  close: []
}>()

// 每个列表最多可设置的数量
const MAX_ITEMS = 20

// 权限模式: 0=无限制, 1=隐藏, 2=限制外部门, 3=限制所有人
const mode = ref<number>(0)

// 是否在通讯录中显示
const showInContact = ref<boolean>(true)

const hiddenDeptsExpanded = ref(true)
const hiddenUsersExpanded = ref(true)
const extraDeptsExpanded = ref(true)
const extraUsersExpanded = ref(true)

const hiddenDepts = ref<ScopeItem[]>([])
const hiddenUsers = ref<ScopeItem[]>([])
const extraDepts = ref<ScopeItem[]>([])
const extraUsers = ref<ScopeItem[]>([])

type UserListType = 'hiddenUsers' | 'extraUsers'
type DeptListType = 'hiddenDepts' | 'extraDepts'

const userSelectDialogVisible = ref(false)
const userSelectTarget = ref<UserListType>('hiddenUsers')

const moreDialogVisible = ref(false)
// const moreDialogTarget = ref<UserListType>('hiddenUsers')

// 部门选择弹窗
const deptDialogVisible = ref(false)
const deptDialogTarget = ref<DeptListType>('hiddenDepts')

const saving = ref(false)

const activeUser = ref<{ list: UserListType | null; id: string | number | null }>({
  list: null,
  id: null
})

const activeDept = ref<{ list: DeptListType | null; id: string | number | null }>({
  list: null,
  id: null
})

// 列表展示数量控制：默认只显示部分，点击“更多”展示全部
const DEPT_DISPLAY_LIMIT = 5
const USER_DISPLAY_LIMIT = 6

const showAllHiddenDepts = ref(false)
const showAllHiddenUsers = ref(false)
const showAllExtraDepts = ref(false)
const showAllExtraUsers = ref(false)

// 各模式下可编辑区域控制
const canEditHidden = computed(() => mode.value === 1)
const canEditExtra = computed(() => mode.value === 2 || mode.value === 3)

// 显示名称
const displayName = computed(() => {
  const setType = props.setType ?? 0
  if (setType === 0) {
    // 用户类型
    return props.data?.oort_name || '-'
  } else if (setType === 1) {
    // 角色类型
    return props.data?.name || '-'
  } else if (setType === 2) {
    // 部门类型
    return props.data?.oort_dname || '-'
  }
  return '-'
})

// 头像默认类型
const avatarDefaultType = computed(() => {
  const setType = props.setType ?? 0
  if (setType === 0) {
    return 'tx'
  } else if (setType === 1) {
    return 'dept' // 角色使用部门图标
  } else if (setType === 2) {
    return 'dept'
  }
  return 'user'
})

// 用户头像与所属组织展示
const userAvatar = computed(() => {
  const setType = props.setType ?? 0
  if (setType === 0) {
    // 用户类型
    return props.data?.oort_photo || props.data?.user_photo || props.data?.avatar || ''
  } else if (setType === 1) {
    // 角色类型
    return props.data?.role_photo || ''
  } else if (setType === 2) {
    // 部门类型
    return props.data?.oort_dept_photo || ''
  }
  return ''
})
const userDeptName = computed(() => {
  const setType = props.setType ?? 0
  if (setType === 0) {
    // 用户类型
    if (props.data?.oort_dname) return props.data.oort_dname
    if (props.data?.dept_name_path) return props.data.dept_name_path
    if (props.data?.user_dept?.dept?.oort_dname) return props.data.user_dept.dept.oort_dname
  } else if (setType === 1) {
    // 角色类型
    return props.data?.oort_remark || props.data?.description || ''
  } else if (setType === 2) {
    // 部门类型
    return props.data?.dept_name_path || props.data?.oort_dname || ''
  }
  return ''
})

// 顶部模式提示文案
const modeHint = computed(() => {
  if (mode.value === 1) {
    return '当前为【隐藏】模式：仅可配置下方“隐藏 / 不可见范围”，“额外 / 例外可见范围”区域不可操作。'
  }
  if (mode.value === 2) {
    return '当前为【限制外部门】模式：只能看本部门+额外指定的部门/用户。仅可配置下方“额外 / 例外可见范围”，“隐藏 / 不可见范围”区域不可操作。'
  }
  if (mode.value === 3) {
    return '当前为【限制所有人】模式：只能看指定的部门/用户。仅可配置下方“额外 / 例外可见范围”，“隐藏 / 不可见范围”区域不可操作。'
  }
  return '当前为【无限制】模式：下方“隐藏 / 不可见范围”和“额外 / 例外可见范围”均不可配置。'
})

const sliceDeptItems = (items: ScopeItem[]) => {
  if (!Array.isArray(items)) return []
  return items.slice(0, DEPT_DISPLAY_LIMIT)
}
const sliceUserItems = (items: ScopeItem[]) => {
  if (!Array.isArray(items)) return []
  return items.slice(0, USER_DISPLAY_LIMIT)
}

const displayHiddenDepts = computed(() =>
  showAllHiddenDepts.value ? hiddenDepts.value : sliceDeptItems(hiddenDepts.value)
)
const displayHiddenUsers = computed(() =>
  showAllHiddenUsers.value ? hiddenUsers.value : sliceUserItems(hiddenUsers.value)
)
const displayExtraDepts = computed(() =>
  showAllExtraDepts.value ? extraDepts.value : sliceDeptItems(extraDepts.value)
)
const displayExtraUsers = computed(() =>
  showAllExtraUsers.value ? extraUsers.value : sliceUserItems(extraUsers.value)
)

// 打开部门选择弹窗
const openDeptDialog = (target: DeptListType) => {
  deptDialogTarget.value = target
  deptDialogVisible.value = true
}

const openUserSelectDialog = (target: UserListType) => {
  userSelectTarget.value = target
  userSelectDialogVisible.value = true
}

const handleUserSelectClose = () => {
  userSelectDialogVisible.value = false
}

const handleUserSelectSave = (data: any) => {
  const users = Array.isArray(data?.user) ? data.user : []
  const mapped: ScopeItem[] = users.map((item: any) => ({
    id: item.oort_uuid || item.id || item.userId || Math.random(),
    name: item.oort_name || item.name || item.real_name || '--',
    desc: item.oort_dname || item.dept_name_path || '',
    avatar: item.oort_photo || item.avatar || ''
  }))

  // 检查数量限制
  if (mapped.length > MAX_ITEMS) {
    const targetName = userSelectTarget.value === 'hiddenUsers' ? '不可见用户' : '额外可见用户'
    ElMessage.warning(`${targetName}最多只能设置${MAX_ITEMS}个`)
    return
  }

  if (userSelectTarget.value === 'hiddenUsers') {
    hiddenUsers.value = mapped
  } else {
    extraUsers.value = mapped
  }

  userSelectDialogVisible.value = false
}

const selectedUserIds = computed(() => {
  const source = userSelectTarget.value === 'hiddenUsers' ? hiddenUsers.value : extraUsers.value
  return source.map((item) => item.id)
})

// 用户弹窗右侧列表使用的详情数据
const selectedUserListForDialog = computed(() => {
  const source = userSelectTarget.value === 'hiddenUsers' ? hiddenUsers.value : extraUsers.value
  return source.map((item) => ({
    oort_uuid: item.id,
    oort_name: item.name,
    oort_photo: item.avatar || '',
    oort_dname: item.desc || '',
    id: item.id,
    userId: item.id
  }))
})

const userSelectDialogTitle = computed(() =>
  userSelectTarget.value === 'hiddenUsers' ? '选择不可见用户' : '选择额外可见用户'
)

// 部门弹窗相关：标题与已选部门 ID
const deptDialogTitle = computed(() =>
  deptDialogTarget.value === 'hiddenDepts' ? '选择不可见部门' : '选择额外可见部门'
)

const selectedDeptIdsForDialog = computed(() => {
  const source = deptDialogTarget.value === 'hiddenDepts' ? hiddenDepts.value : extraDepts.value
  return source.map((item) => String(item.id))
})

// 部门弹窗右侧列表使用的详情数据（来源于 getContactScope 映射后的列表）
const selectedDeptListForDialog = computed(() => {
  const source = deptDialogTarget.value === 'hiddenDepts' ? hiddenDepts.value : extraDepts.value
  return source.map((item) => ({
    oort_dcode: item.id,
    oort_dname: item.name,
    oort_dept_photo: '',
    // desc 中已经优先放了 dept_name_path/path
    dept_name_path: item.desc || ''
  }))
})

// 部门弹窗确认/取消
const handleDeptDialogConfirm = (depts: any[]) => {
  // 记录部门信息到缓存
  depts.forEach(recordDeptInfo)
  const mapped: ScopeItem[] = (Array.isArray(depts) ? depts : []).map((dept: any) => ({
    id: dept.oort_dcode || dept.id || Math.random(),
    name: dept.oort_dname || dept.name || '--',
    desc: getDeptPath(dept)
  }))

  // 检查数量限制
  if (mapped.length > MAX_ITEMS) {
    const targetName = deptDialogTarget.value === 'hiddenDepts' ? '不可见部门' : '额外可见部门'
    ElMessage.warning(`${targetName}最多只能设置${MAX_ITEMS}个`)
    return
  }

  if (deptDialogTarget.value === 'hiddenDepts') {
    hiddenDepts.value = mapped
  } else {
    extraDepts.value = mapped
  }

  deptDialogVisible.value = false
}

const handleDeptDialogCancel = () => {
  deptDialogVisible.value = false
}

// 组装保存 payload
const buildScopePayload = () => {
  const setType = props.setType ?? 0 // 默认用户类型
  const mapIds = (items: ScopeItem[]) => items.map((item) => String(item.id))

  const payload: any = {
    set_type: setType,
    mode: mode.value,
    hide_personal: !showInContact.value,
    hidden_depts: mapIds(payloadHiddenDepts.value),
    hidden_users: mapIds(payloadHiddenUsers.value),
    extra_depts: mapIds(payloadExtraDepts.value),
    extra_users: mapIds(payloadExtraUsers.value)
  }

  // 根据 set_type 设置对应的 id
  if (setType === 0) {
    // 用户类型
    const userId = props.data?.oort_uuid
    if (!userId) return null
    payload.user_id = userId
  } else if (setType === 1) {
    // 角色类型
    const roleId = props.data?.ruuid || props.data?.role_id || props.data?.id
    if (!roleId) return null
    payload.role_id = roleId
  } else if (setType === 2) {
    // 部门类型
    const deptId = props.data?.oort_dcode || props.data?.id
    if (!deptId) return null
    payload.dept_code = deptId
  }

  return payload
}

// 调用保存接口
const saveScope = async() => {
  const payload = buildScopePayload()
  if (!payload) return
  saving.value = true
  try {
    const res: any = await saveContactScope(payload)
    if (res?.code === 200) {
      ElMessage.success('保存成功')
      emit('close')
    }
  } finally {
    saving.value = false
  }
}

// 保存按钮点击
const handleSave = () => {
  saveScope()
}

// 取消按钮点击
const handleCancel = () => {
  emit('close')
}

// 是否在通讯录中显示开关变化
const handleDisplaySwitchChange = () => {
}

// 清空权限配置
const handleClear = async() => {
  const setType = props.setType ?? 0 // 默认用户类型
  const params: any = {
    set_type: setType
  }

  // 根据 set_type 设置对应的 id
  if (setType === 0) {
    // 用户类型
    const userId = props.data?.oort_uuid
    if (!userId) return
    params.user_id = userId
  } else if (setType === 1) {
    // 角色类型
    const roleId = props.data?.ruuid || props.data?.role_id || props.data?.id
    if (!roleId) return
    params.role_id = roleId
  } else if (setType === 2) {
    // 部门类型
    const deptId = props.data?.oort_dcode || props.data?.id
    if (!deptId) return
    params.dept_code = deptId
  }

  const res: any = await deleteContactScope(params)
  if (res?.code === 200) {
    // 清空成功后重新加载数据
    await loadScopeData()
  }
}

// 从列表中删除单个用户
const handleRemoveUser = (list: UserListType, item: ScopeItem) => {
  if (list === 'hiddenUsers') {
    hiddenUsers.value = hiddenUsers.value.filter((u) => u.id !== item.id)
  } else {
    extraUsers.value = extraUsers.value.filter((u) => u.id !== item.id)
  }
}

// 从列表中删除单个部门
const handleRemoveDept = (list: DeptListType, item: ScopeItem) => {
  if (list === 'hiddenDepts') {
    hiddenDepts.value = hiddenDepts.value.filter((d) => d.id !== item.id)
  } else {
    extraDepts.value = extraDepts.value.filter((d) => d.id !== item.id)
  }
}

// 控制 hover 时删除按钮显示
const toggleCloseButton = (list: UserListType, id: string | number, isEnter: boolean) => {
  if (isEnter) {
    activeUser.value = { list, id }
  } else if (activeUser.value.list === list && activeUser.value.id === id) {
    activeUser.value = { list: null, id: null }
  }
}

// 控制部门 hover 删除按钮显示
const toggleDeptCloseButton = (list: DeptListType, id: string | number, isEnter: boolean) => {
  if (isEnter) {
    activeDept.value = { list, id }
  } else if (activeDept.value.list === list && activeDept.value.id === id) {
    activeDept.value = { list: null, id: null }
  }
}

// 根据模式计算真正需要提交给后端的数组
const payloadHiddenDepts = computed(() =>
  mode.value === 1 ? hiddenDepts.value : []
)
const payloadHiddenUsers = computed(() =>
  mode.value === 1 ? hiddenUsers.value : []
)
const payloadExtraDepts = computed(() =>
  mode.value === 2 || mode.value === 3 ? extraDepts.value : []
)
const payloadExtraUsers = computed(() =>
  mode.value === 2 || mode.value === 3 ? extraUsers.value : []
)

const toggleHiddenDepts = () => {
  hiddenDeptsExpanded.value = !hiddenDeptsExpanded.value
}
const toggleHiddenUsers = () => {
  hiddenUsersExpanded.value = !hiddenUsersExpanded.value
}
const toggleExtraDepts = () => {
  extraDeptsExpanded.value = !extraDeptsExpanded.value
}
const toggleExtraUsers = () => {
  extraUsersExpanded.value = !extraUsersExpanded.value
}

// 部门信息缓存，用于计算部门路径
const deptInfoMap = new Map<string, { name: string; parentId: string; code?: string }>()
const deptCodeMap = new Map<string, { name: string; parentId: string; id: string }>()

// 根节点
function getRootNode() {
  return {
    oort_dname: (storeC.tenantData as any)?.company_name || '全部',
    oort_dcode: '',
    pdeptcode: '',
    is_subdept: true
  }
}

// 记录部门信息到缓存
function recordDeptInfo(dept: any) {
  if (!dept) return
  const id = dept.oort_dcode ?? ''
  if (id === undefined) return
  const name = dept.oort_dname || ''
  const parentId = dept.pdeptcode ?? ''
  const code = dept.dept_code || ''

  const existing = deptInfoMap.get(id)
  if (!existing || existing.name !== name || existing.parentId !== parentId || existing.code !== code) {
    deptInfoMap.set(id, { name, parentId, code })
  }

  if (code) {
    const codeExisting = deptCodeMap.get(code)
    if (!codeExisting || codeExisting.id !== id || codeExisting.name !== name || codeExisting.parentId !== parentId) {
      deptCodeMap.set(code, { id, name, parentId })
    }
  }
}

// 去重连续相同的段
function dedupeSequential(segments: string[]): string[] {
  return segments.filter((name, index) => index === 0 || name !== segments[index - 1])
}

// 获取部门路径：顶级公司 + 层级名称
function getDeptPath(dept: any): string {
  if (!dept) return ''
  const rootName = getRootNode().oort_dname

  const codePath = dept.dept_code_path || ''
  const codeSegments = codePath.split('/').filter(Boolean)
  const namesFromCodes = codeSegments
    .map(code => deptCodeMap.get(code)?.name)
    .filter(Boolean) as string[]

  // 如果没有 code_path，则降级使用接口中的 dept_name_path 作为层级名称来源
  const namePath = dept.dept_name_path || dept.path || ''
  const nameSegments = namePath.split('/').filter(Boolean)

  let segments: string[] = []

  if (namesFromCodes.length) {
    segments = [...namesFromCodes]
  } else if (nameSegments.length) {
    segments = [...nameSegments]
  }

  if (rootName && segments[0] !== rootName) {
    segments.unshift(rootName)
  }

  if (dept.oort_dname && segments[segments.length - 1] !== dept.oort_dname) {
    segments.push(dept.oort_dname)
  }

  return dedupeSequential(segments).filter(Boolean).join('/')
}

// 根据部门代码从缓存获取部门名称
const getDeptNameByCode = (deptCode: string): string => {
  if (!deptCode) return ''
  const cached = deptInfoMap.get(deptCode)
  return cached?.name || ''
}

// 批量加载部门信息到缓存（根据父部门代码逐层加载）
const loadDeptByParentCode = async(parentCode: string): Promise<void> => {
  const params: any = {
    accessToken: store.userInfo?.accessToken,
    page: 1,
    pagesize: 99,
    isdel: 1
  }
  if (parentCode) {
    params.pdeptcode = parentCode
    params.all_child = true
  } else {
    // 根节点，加载第一层
    params.dept_code = ''
  }

  const res: any = await deptList(params)
  if (res?.code === 200) {
    const list = res.data?.list || []
    list.forEach(recordDeptInfo)
  }
}

// 根据 dept_name_path构建名称路径
const buildDeptNamePathFromCodePath = async(codePath: string): Promise<string> => {
  if (!codePath) return ''

  const codeSegments = codePath.split('/').filter(Boolean)
  if (codeSegments.length === 0) return ''

  const root = getRootNode()
  recordDeptInfo(root)

  const missingCodes = codeSegments.filter(code => !getDeptNameByCode(code))

  // 如果有缺失的部门，尝试批量加载所有部门
  if (missingCodes.length > 0) {
    const params: any = {
      accessToken: store.userInfo?.accessToken,
      page: 1,
      pagesize: 99,
      isdel: 1
    }
    const res: any = await deptList(params)
    if (res?.code === 200) {
      const list = res.data?.list || []
      list.forEach(recordDeptInfo)
    }
  }

  // 如果批量加载后还有缺失的部门，逐层加载
  const stillMissingCodes = codeSegments.filter(code => !getDeptNameByCode(code))
  if (stillMissingCodes.length > 0) {
    let currentParentCode = ''
    for (const code of codeSegments) {
      if (!getDeptNameByCode(code)) {
        await loadDeptByParentCode(currentParentCode)
      }
      currentParentCode = code
    }
  }

  // 从缓存中获取部门名称
  const nameSegments: string[] = []
  for (const code of codeSegments) {
    const name = getDeptNameByCode(code)
    if (name) {
      nameSegments.push(name)
    } else {
      nameSegments.push(code)
    }
  }

  // 组合成完整路径
  const rootName = getRootNode().oort_dname
  if (rootName && nameSegments.length > 0 && nameSegments[0] !== rootName) {
    nameSegments.unshift(rootName)
  }

  return dedupeSequential(nameSegments).filter(Boolean).join('/')
}

// 加载部门信息以构建路径缓存
const loadDeptInfoForPath = async(deptIds: string[]) => {
  if (!deptIds || deptIds.length === 0) return

  // 记录根节点信息
  const root = getRootNode()
  recordDeptInfo(root)

  // 批量加载部门信息
  const params: any = {
    accessToken: store.userInfo?.accessToken,
    page: 1,
    pagesize: 99,
    isdel: 1
  }

  try {
    const res: any = await deptList(params)
    if (res?.code === 200) {
      const list = res.data?.list || []
      list.forEach(recordDeptInfo)
    }
  } catch (error) {
    // 忽略错误
  }
}

const formatDeptList = async(detailList?: any[], fallbackList?: any[]): Promise<ScopeItem[]> => {
  if (Array.isArray(detailList) && detailList.length) {
    // 根据 dept_name_path 构建完整的名称路径
    const results: ScopeItem[] = []
    for (const item of detailList) {
      const codePath = item.dept_name_path || item.dept_path || ''
      let namePath = ''

      if (codePath) {
        // 根据代码路径构建名称路径
        namePath = await buildDeptNamePathFromCodePath(codePath)
      }

      results.push({
        id: item.dept_code || item.oort_dcode || item.id || item.code || Math.random(),
        name: item.dept_name || item.oort_dname || item.name || '--',
        desc: namePath || codePath || ''
      })
    }
    return results
  }

  if (Array.isArray(fallbackList) && fallbackList.length) {
    const deptIds = fallbackList.map(value => value?.dept_code || value?.oort_dcode || value?.id || value).filter(Boolean)
    await loadDeptInfoForPath(deptIds)

    return fallbackList.map((value) => {
      const dept = {
        oort_dcode: value?.oort_dcode || value?.id || value,
        oort_dname: value?.oort_dname || value?.name || String(value),
        dept_code: value?.dept_code,
        dept_code_path: value?.dept_code_path,
        dept_name_path: value?.dept_name_path,
        pdeptcode: value?.pdeptcode
      }
      recordDeptInfo(dept)
      return {
        id: dept.dept_code || dept.oort_dcode || Math.random(),
        name: value?.dept_name || dept.oort_dname || String(value),
        desc: dept.dept_name_path || getDeptPath(dept)
      }
    })
  }
  return []
}

const formatUserList = (detailList?: any[], fallbackList?: any[]): ScopeItem[] => {
  // 优先使用 *_users_name 这种带详情的列表
  if (Array.isArray(detailList) && detailList.length) {
    return detailList.map((item) => ({
      id: item.user_id || item.oort_uuid || item.userId || Math.random(),
      name: item.user_name || item.oort_name || item.real_name || '--',
      desc: item.dept_name_path || item.oort_dname || item.oort_loginid || '',
      // 接口字段为 user_photo，这里优先使用
      avatar: item.user_photo || item.oort_photo || item.avatar || ''
    }))
  }

  // 其次使用 *_users 这种仅有 ID 或少量信息的列表
  if (Array.isArray(fallbackList) && fallbackList.length) {
    return fallbackList.map((value) => ({
      id: value?.user_id || value?.oort_uuid || Math.random(),
      name: value?.user_name || value?.oort_name || String(value),
      desc: value?.dept_name_path || value?.oort_dname || '',
      avatar: value?.user_photo || value?.oort_photo || value?.avatar || ''
    }))
  }

  return []
}

const loadScopeData = async() => {
  const setType = props.setType ?? 0 // 默认用户类型
  const params: any = {
    set_type: setType
  }

  // 根据 set_type 设置对应的 id
  let targetId: string | undefined
  if (setType === 0) {
    // 用户类型
    targetId = props.data?.oort_uuid
    if (!targetId) {
      hiddenDepts.value = []
      hiddenUsers.value = []
      extraDepts.value = []
      extraUsers.value = []
      showInContact.value = true
      return
    }
    params.user_id = targetId
  } else if (setType === 1) {
    // 角色类型
    targetId = props.data?.ruuid || props.data?.role_id || props.data?.id
    if (!targetId) {
      hiddenDepts.value = []
      hiddenUsers.value = []
      extraDepts.value = []
      extraUsers.value = []
      showInContact.value = true
      return
    }
    params.role_id = targetId
  } else if (setType === 2) {
    // 部门类型
    targetId = props.data?.oort_dcode || props.data?.id
    if (!targetId) {
      hiddenDepts.value = []
      hiddenUsers.value = []
      extraDepts.value = []
      extraUsers.value = []
      showInContact.value = true
      return
    }
    params.dept_code = targetId
  }

  const res: any = await getContactScope(params)
  if (res?.code === 200) {
    const detail = res.data || {}
    mode.value = detail.mode ?? 0
    // hide_personal: true=隐藏, false=显示
    showInContact.value = !(detail.hide_personal ?? false)
    hiddenDepts.value = await formatDeptList(detail.hidden_depts_name, detail.hidden_depts)
    hiddenUsers.value = formatUserList(detail.hidden_users_name, detail.hidden_users)
    extraDepts.value = await formatDeptList(detail.extra_depts_name, detail.extra_depts)
    extraUsers.value = formatUserList(detail.extra_users_name, detail.extra_users)
  }
}

watch(
  () => [props.data, props.setType],
  () => {
    const setType = props.setType ?? 0
    let hasId = false
    if (setType === 0) {
      hasId = !!props.data?.oort_uuid
    } else if (setType === 1) {
      hasId = !!(props.data?.ruuid || props.data?.role_id || props.data?.id)
    } else if (setType === 2) {
      hasId = !!(props.data?.oort_dcode || props.data?.id)
    }
    if (hasId) {
      loadScopeData()
    }
  },
  { immediate: true }
)

defineExpose({
  mode,
  payloadHiddenDepts,
  payloadHiddenUsers,
  payloadExtraDepts,
  payloadExtraUsers,
  userSelectDialogVisible,
  userSelectDialogTitle,
  selectedUserIds,
  selectedUserListForDialog,
  handleUserSelectSave,
  handleUserSelectClose,
  moreDialogVisible,
  // 以下与“更多”弹窗相关的导出暂时保留（当前未使用）
  // moreDialogTitle,
  // moreDialogList,
  // handleMoreListUpdate,
  deptDialogVisible,
  deptDialogTitle,
  selectedDeptIdsForDialog,
  selectedDeptListForDialog,
  handleDeptDialogConfirm,
  handleDeptDialogCancel
})
</script>

<style scoped lang="scss">
.visible-scope-dialog {
  min-height: 200px;

  .visible-scope-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;

    .title {
      display: flex;
      align-items: center;
      gap: 12px;

        .title-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
      }

      .title-text {
        .name {
          font-size: 16px;
          color: #1d2129;
        }

        .desc {
          font-size: 12px;
          color: #86909c;
        }
      }
    }
  }

  .display-switch-row {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;

    .display-switch-label {
      color: #4e5969;
    }
  }

  .mode-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 4px;
    font-size: 14px;

    .mode-label {
      color: #4e5969;
    }
  }

  .mode-tip {
    height: 40px;
    min-width: 780px;
    display: flex;
    align-items: center;
    background: #EDF5FF;
    border: 1px solid #CDE4FF;
    padding-left: 10px;
    gap: 6px;
    margin: 10px 0;
    img{
      width: 16px;
    }
    div{
      color: #167EFF;
      font-size: 14px;
      line-height: normal;
      text-align: left;

    }
  }

  .scope-groups {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .scope-group {
    border-radius: 12px;
    padding: 16px;

    // 改为边框样式，降低整体色彩饱和度
    &.danger {
      border: 1px solid #ffd6d6;
      background: #ffffff;
    }

    &.success {
      border: 1px solid #c5f1d8;
      background: #ffffff;
    }

    &.scope-group--disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    .group-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;

      .group-icon {
        width: 22px;
        height: 22px;
      }

      .icon-hidden {
        color: #e74949;
      }

      .icon-visible {
        color: #2cb67d;
      }

      .group-title__text {
        color: #1d2129;
        font-size: 15px;
        font-weight: 600;
      }

      .group-title__desc {
        color: #86909c;
        font-size: 12px;
      }
    }
  }

  .group-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .scope-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f2f3f5;
      cursor: pointer;

      &-left {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #1d2129;
      }
    }

    &__body {
      padding: 12px 16px;
    }
  }

  .scope-item {
    display: flex;
    padding: 10px;
    border-radius: 8px;
    background: #f7f8fa;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    &__dept-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #eef2ff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #5c6ac4;
    }

    &__content {
      margin-left: 10px;

      .scope-item__name {
        font-size: 14px;
        font-weight: 600;
        color: #1d2129;
      }

      .scope-item__desc {
        font-size: 12px;
        color: #86909c;
      }
    }
  }

  .avatar-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .avatar-group :deep(.el-avatar) {
    margin-left: -8px;
    border: 2px solid #fff;
    box-shadow: 0 0 2px #eee;
  }

  .avatar-group :deep(.el-avatar):first-child {
    margin-left: 0;
  }

  .avatar-32 {
    width: 32px !important;
    height: 32px !important;
    font-size: 16px !important;
    line-height: 32px !important;
  }

  .plus-avatar {
    border: 1px dashed #cfd3dc;
    color: #8c8c8c;
    cursor: default;
  }

  .user_item {
    position: relative;
    padding: 6px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: default;
  }

  .user_img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .dept-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #fff;
    background: #eef3ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5c6ac4;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  .oort_name {
    color: #191919;
    font-size: 14px;
    line-height: 22px;
  }

  .user-active {
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 #00000019;
  }

  :deep(.close-icon) {
    font-size: 12px;
    --el-icon-size: 12px;
    cursor: pointer;
  }

  .close-icon {
    position: absolute;
    top: 2px;
    right: 2px;
  }

  .load-more__link {
    display: inline-flex;
    align-items: center;
    color: var(--el-color-primary);
    font-size: 14px;
    padding: 0 8px;
    cursor: pointer;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    margin-top: 20px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
