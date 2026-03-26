<template>
  <div class="setting-page">
    <div class="setting-header">
      <el-tabs v-model="mainTab" class="main-tabs">
        <el-tab-pane label="默认设置" name="default">
          <el-tabs v-model="subTab" class="sub-tabs" style="display: flex;flex-wrap: nowrap">
            <div class="sub-line">
              <el-tab-pane label="信息设置" name="info" />
              <el-tab-pane label="通讯录描述" name="desc" />
              <div v-if="mainTab === 'default' && subTab === 'info'" class="sub-actions">
                <div class="lcw" @click="saveAs">
                  <oort-svg-icon width="18" height="18" name="lcw_icon" />
                  <span>另存为</span>
                </div>
                <div class="lcw" @click="chooseScheme">
                  <oort-svg-icon width="18" height="18" name="xzfa_icon" />
                  <span>选择方案</span>
                </div>
              </div>
            </div>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="部门设置" name="dept">
          <el-tabs v-model="subTab" class="sub-tabs" style="display: flex;flex-wrap: nowrap">
            <div class="sub-line">
              <el-tab-pane label="信息设置" name="info" />
              <el-tab-pane label="通讯录描述" name="desc" />
              <div v-if="mainTab === 'dept' && subTab === 'info'" class="sub-actions">
                <div class="lcw" @click="deptSaveAs">
                  <oort-svg-icon width="18" height="18" name="lcw_icon" />
                  <span>另存为</span>
                </div>
                <div class="lcw" @click="deptChooseScheme">
                  <oort-svg-icon width="18" height="18" name="xzfa_icon" />
                  <span>选择方案</span>
                </div>
              </div>
            </div>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="角色设置" name="role">
          <el-tabs v-model="subTab" class="sub-tabs" style="display: flex;flex-wrap: nowrap">
            <div class="sub-line">
              <el-tab-pane label="信息设置" name="info" />
              <el-tab-pane label="通讯录描述" name="desc" />
              <div v-if="mainTab === 'role' && subTab === 'info'" class="sub-actions">
                <div class="lcw" @click="roleSaveAs">
                  <oort-svg-icon width="18" height="18" name="lcw_icon" />
                  <span>另存为</span>
                </div>
                <div class="lcw" @click="roleChooseScheme">
                  <oort-svg-icon width="18" height="18" name="xzfa_icon" />
                  <span>选择方案</span>
                </div>
              </div>
            </div>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="用户设置" name="user">
          <el-tabs v-model="subTab" class="sub-tabs" style="display: flex;flex-wrap: nowrap">
            <div class="sub-line">
              <el-tab-pane label="信息设置" name="info" />
              <el-tab-pane label="通讯录描述" name="desc" />
              <div v-if="mainTab === 'user' && subTab === 'info'" class="sub-actions">
                <div class="lcw" @click="userSaveAs">
                  <oort-svg-icon width="18" height="18" name="lcw_icon" />
                  <span>另存为</span>
                </div>
                <div class="lcw" @click="userChooseScheme">
                  <oort-svg-icon width="18" height="18" name="xzfa_icon" />
                  <span>选择方案</span>
                </div>
              </div>
            </div>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
      <div v-if="subTab==='info'" class="save">
        <el-button type="primary" class="bt" @click="saveBt">
          保存
        </el-button>
      </div>
      <div v-if="subTab==='desc'" class="save">
        <el-button type="primary" class="bt" @click="saveDescBt">
          保存
        </el-button>
      </div>
    </div>
    <div class="setting-body">
      <el-alert v-if="mainTab==='default'" type="warning" class="dsconfig-alert">
        <template #default>
          <img src="@/assets/img/address_book/tip_icon2.png" alt="" />
          <span>通讯录设置优先级：用户设置 > 角色设置 > 部门设置 > 默认设置；如果设置冲突则会合并设置</span>
        </template>
      </el-alert>
      <InfoSetting
        v-show="mainTab==='default' && subTab==='info'"
        :data="dataRes"
        :basic-list="basicList"
        :custom-field-list="customFieldList"
        @update-basic-list="handleUpdateBasicList"
        @update-custom-fields="handleUpdateCustomFields"
      />
      <desc-set
        v-show="mainTab==='default' && subTab==='desc'"
        ref="defaultDescSetRef"
        :model-id="defaultModelId"
        :entity-id="defaultEntityId"
        :entity-type="defaultEntityType"
        :active="mainTab==='default' && subTab==='desc'"
        :data="dataRes"
        :basic-list="basicList"
        :custom-field-list="customFieldList"
      />
      <user-dia
        v-show="mainTab==='user' && subTab==='info'"
        ref="userDiaRef"
        :active="mainTab==='user' && subTab==='info'"
      />
      <desc-set
        v-show="mainTab==='user' && subTab==='desc'"
        ref="userDescSetRef"
        :preview-name="previewName"
        :model-id="userModelId"
        :entity-id="userEntityId"
        :entity-type="userEntityType"
        :active="mainTab==='user' && subTab==='desc'"
        :data="userDiaRef?.dataRes"
        :basic-list="userDiaRef?.basicList"
        :custom-field-list="userDiaRef?.customFieldList"
        :is-user-setting="true"
        :user-id="userDiaRef?.currentUserId"
      />
      <role-dia
        v-show="mainTab==='role' && subTab==='info'"
        ref="roleDiaRef"
        :active="mainTab==='role' && subTab==='info'"
      />
      <desc-set
        v-show="mainTab==='role' && subTab==='desc'"
        ref="roleDescSetRef"
        :preview-name="previewName"
        :model-id="roleModelId"
        :entity-id="roleEntityId"
        :entity-type="roleEntityType"
        :active="mainTab==='role' && subTab==='desc'"
        :data="roleDiaRef?.dataRes"
        :basic-list="roleDiaRef?.basicList"
        :custom-field-list="roleDiaRef?.customFieldList"
      />
      <dept-dia
        v-show="mainTab==='dept' && subTab==='info'"
        ref="deptDiaRef"
        :active="mainTab==='dept' && subTab==='info'"
      />
      <desc-set
        v-show="mainTab==='dept' && subTab==='desc'"
        ref="deptDescSetRef"
        :preview-name="previewName"
        :model-id="deptModelId"
        :entity-id="deptEntityId"
        :entity-type="deptEntityType"
        :active="mainTab==='dept' && subTab==='desc'"
        :data="deptDiaRef?.dataRes"
        :basic-list="deptDiaRef?.basicList"
        :custom-field-list="deptDiaRef?.customFieldList"
      />
    </div>
    <el-dialog
      v-model="otherPlanDia"
      :title="isEditMode ? '编辑方案' : '另存为方案'"
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
        <div class="dialog-footer-btns" style="padding-right: 40px">
          <el-button @click="handleCancelPlan">
            取消
          </el-button>
          <el-button type="primary" @click="handleSaveScheme">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible" title="选择方案" width="55%" :close-on-click-modal="false">
      <div class="scheme-container">
        <!-- 我的方案 -->
        <div class="scheme-section">
          <div class="scheme-section-title">
            我的方案
          </div>
          <div class="scheme-list">
            <div v-for="item in mySchemeList" :key="item.id" :class="['scheme-card', selectedScheme === item.id ? 'active' : '']" @click="selectScheme(item.id)">
              <div class="scheme-header">
                <div class="scheme-title-wrapper">
                  <span class="scheme-title" @click.stop="handleEditScheme(item)">{{ item.module_name }}</span>
                  <span v-if="item.is_default === 1" class="scheme-badge">
                    已生效
                  </span>
                </div>
                <div class="scheme-actions">
                  <oort-svg-icon name="view" width="20" height="20" @click.stop="viewScheme(item)" />
                  <oort-svg-icon name="edit" width="20" height="20" @click.stop="editScheme(item)" />
                  <oort-svg-icon width="14" height="14" name="table_del" @click.stop="deleteScheme(item)" />
                </div>
              </div>
              <div class="scheme-desc">
                {{ item.oort_remark || '方案备注' }}
              </div>
              <div class="scheme-stats">
                <div class="stat show">
                  <img src="@/assets/img/address_book/show_icon.png" />
                  <span>显示 {{ item.show_count }}</span>
                </div>
                <div class="stat hide">
                  <img src="@/assets/img/address_book/hide_icon.png" />
                  <span>隐藏 {{ item.hide_count }}</span>
                </div>
                <div class="stat total">
                  <img src="@/assets/img/address_book/total_icon.png" />
                  <span>总计 {{ item.total_count }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="scheme-pagination">
            <el-pagination
              background
              :page-sizes="[10, 20, 50, 100]"
              :page-size="myPageSize"
              :current-page="myPage"
              :total="myTotal"
              layout="total, prev, pager, next, sizes"
              class="justifyAlign"
              @size-change="handleMySizeChange"
              @current-change="handleMyCurrentChange"
            />
          </div>
        </div>
        <!-- 公有方案 -->
        <div class="scheme-section">
          <div class="scheme-section-title">
            公有方案
          </div>
          <div class="scheme-list">
            <div v-for="item in publicSchemeList" :key="item.id" :class="['scheme-card', selectedScheme === item.id ? 'active' : '']" @click="selectScheme(item.id)">
              <div class="scheme-header">
                <span class="scheme-title">{{ item.module_name }}</span>
                <div class="scheme-actions">
                  <oort-svg-icon name="view" width="20" height="20" @click.stop="viewScheme(item)" />
                </div>
              </div>
              <div class="scheme-desc">
                {{ item.oort_remark || '方案备注' }}
              </div>
              <div class="scheme-stats">
                <div class="stat show">
                  <img src="@/assets/img/address_book/show_icon.png" />
                  <span>显示 {{ item.show_count }}</span>
                </div>
                <div class="stat hide">
                  <img src="@/assets/img/address_book/hide_icon.png" />
                  <span>隐藏 {{ item.hide_count }}</span>
                </div>
                <div class="stat total">
                  <img src="@/assets/img/address_book/total_icon.png" />
                  <span>总计 {{ item.total_count }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="scheme-pagination">
            <el-pagination
              background
              :page-sizes="[10, 20, 50, 100]"
              :page-size="publicPageSize"
              :current-page="publicPage"
              :total="publicTotal"
              layout="total, prev, pager, next, sizes"
              class="justifyAlign"
              @size-change="handlePublicSizeChange"
              @current-change="handlePublicCurrentChange"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer-btns">
          <el-button @click="dialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="confirmScheme">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="editPlanVisible" top="50px" title="编辑方案" width="60%" :close-on-click-modal="false">
      <InfoSetting :data="editDataRes" :basic-list="editBasicList" :custom-field-list="editCustomFieldList" @update-basic-list="handleEditUpdateBasicList" @update-custom-fields="handleEditUpdateCustomFields" />
      <template #footer>
        <div class="dialog-footer-btns">
          <el-button @click="editPlanVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="handleEditSave">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <view-plan-dia
      v-model:visible="viewPlanVisible"
      :scheme-item="viewSchemeItem"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import InfoSetting from './InfoSetting.vue'
import roleDia from './roleDia.vue'
import userDia from './userDia.vue'
import deptDia from './deptDia.vue'
import descSet from './descSet.vue'
import viewPlanDia from './component/viewPlanDia.vue'
import { defaultInfo, save, list, select, deleteBoard, userDetailDisplaySave, edit, deptGet, roleGet, getUserInfoByUserId, deptSave, roleSave, userSave } from '@/api/address_book/index'

const store = useUserStore()
const mainTab = ref('default')
const subTab = ref('info')
const dataRes = ref()
const otherPlanDia = ref(false)
const dialogVisible = ref(false)
const editPlanVisible = ref(false)
const selectedScheme = ref('')
const formRef = ref<FormInstance>()
// 编辑模式标识
const isEditMode = ref(false)
// 编辑方案的数据
const editSchemeData = ref<any>({})
const deptDiaRef = ref()
const roleDiaRef = ref()
const userDiaRef = ref()
const defaultDescSetRef = ref()
const userDescSetRef = ref()
const roleDescSetRef = ref()
const deptDescSetRef = ref()
// 当前选中的部门名称
const currentDeptName = ref('xx部门/xx分组')
// 当前选中的角色名称
const currentRoleName = ref('xx角色')
// 当前选中的用户名称
const currentUserName = ref('xx用户')
// 各个设置的 modelId
const defaultModelId = ref('')
const userModelId = ref('')
const roleModelId = ref('')
const deptModelId = ref('')
// 方案列表
const schemeList = ref()
// 我的方案列表
const mySchemeList = ref<any[]>([])
// 公有方案列表
const publicSchemeList = ref<any[]>([])
// 我的方案分页
const myPage = ref(1)
const myPageSize = ref(20)
const myTotal = ref(0)
// 公有方案分页
const publicPage = ref(1)
const publicPageSize = ref(20)
const publicTotal = ref(0)
// 查看方案
const viewPlanVisible = ref(false)
const viewSchemeItem = ref<any>({})

watch(
  mainTab,
  () => {
    subTab.value = 'info'
  }
)

const defaultEntityId = computed(() => 'oortoort-aabb-ccdd-eeff-eb29bb427381')
const defaultEntityType = 10
const deptEntityId = computed(() => deptDiaRef.value?.pidObj?.oort_dcode || '')
const deptEntityType = 20
const roleEntityId = computed(() => roleDiaRef.value?.currentRoleObj?.ruuid || '')
const roleEntityType = 30
const userEntityId = computed(() => {
  const userObj = userDiaRef.value?.currentUserObj
  if (userObj?.oort_uuid) {
    return userObj.oort_uuid
  }
  return userDiaRef.value?.currentNodeId || ''
})
const userEntityType = 40

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

// 取消方案操作
const handleCancelPlan = () => {
  // 重置表单
  formData.value = {
    name: '',
    oort_remark: ''
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
  isEditMode.value = false
  editSchemeData.value = {}
  otherPlanDia.value = false
}

// 另存为方案
const saveAs = () => {
  // 设置为新增模式
  isEditMode.value = false
  // 重置表单
  formData.value = {
    name: '',
    oort_remark: ''
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
  otherPlanDia.value = true
}

// 点击方案名称或描述打开编辑弹窗
const handleEditScheme = (item: any) => {
  isEditMode.value = true
  editSchemeData.value = {
    id: item.id,
    module_id: item.module_id || item.id,
    module_name: item.module_name || '',
    oort_remark: item.oort_remark || '',
    entity_id: item.entity_id || '',
    entity_type: item.entity_type || 20,
    basic_id: item.basic_id || null,
    model_icon: item.model_icon || '',
    status: item.status || 1
  }
  formData.value = {
    name: item.module_name || '',
    oort_remark: item.oort_remark || ''
  }
  otherPlanDia.value = true
}

const saveBt = async() => {
  // 如果是部门设置，调用deptDia2的onSubmit方法
  if (mainTab.value === 'dept' && subTab.value === 'info') {
    if (deptDiaRef.value && deptDiaRef.value.onSubmit) {
      deptDiaRef.value.onSubmit()
    }
    return
  }

  // 如果是角色设置，调用roleDia2的onSubmit方法
  if (mainTab.value === 'role' && subTab.value === 'info') {
    if (roleDiaRef.value && roleDiaRef.value.onSubmit) {
      roleDiaRef.value.onSubmit()
    }
    return
  }

  // 如果是用户设置，调用userDia2的onSubmit方法
  if (mainTab.value === 'user' && subTab.value === 'info') {
    if (userDiaRef.value && userDiaRef.value.onSubmit) {
      userDiaRef.value.onSubmit()
    }
    return
  }

  // 默认设置的保存逻辑
  // 先调用defaultInfo接口获取默认方案
  const defaultParams = {
    accessToken: store.userInfo?.accessToken,
    entity_id: 'oortoort-aabb-ccdd-eeff-eb29bb427381',
    entity_type: 10
  }

  const defaultRes = await defaultInfo(defaultParams) as any
  if (defaultRes.code !== 200) {
    ElMessage.error('获取默认方案失败')
    return
  }

  // 使用defaultInfo返回的数据作为保存参数
  const params = {
    accessToken: store.userInfo?.accessToken,
    entity_id: defaultRes.data.entity_id,
    entity_type: defaultRes.data.entity_type,
    module_id: defaultRes.data.id,
    module_name: defaultRes.data.module_name,
    save_type: 0,
    basic_field: basicList.value,
    custom_field: customFieldList.value || []
  }

  const res = await save(params) as any
  if (res.code === 200) {
    ElMessage.success('保存成功')
    // 保存成功后刷新数据
    await refreshDefaultInfo()
  }
}

// 保存通讯录描述
const saveDescBt = async() => {
  let descSetRef: any = null
  let modelId = ''

  // 根据当前标签页获取对应的 descSet ref 和 modelId
  if (mainTab.value === 'default') {
    descSetRef = defaultDescSetRef.value
    modelId = defaultModelId.value
  } else if (mainTab.value === 'user') {
    descSetRef = userDescSetRef.value
    modelId = userModelId.value
  } else if (mainTab.value === 'role') {
    descSetRef = roleDescSetRef.value
    modelId = roleModelId.value
  } else if (mainTab.value === 'dept') {
    descSetRef = deptDescSetRef.value
    modelId = deptModelId.value
  }

  if (!descSetRef || !modelId) {
    ElMessage.warning('请先选择设置项')
    return
  }

  // 获取保存数据
  const saveData = descSetRef?.getSaveData?.()
  if (!saveData) {
    ElMessage.warning('没有可保存的数据')
    return
  }

  // 构建保存参数
  const params: any = {
    accessToken: store.userInfo?.accessToken,
    basic_field_display: saveData.basic_field_display || [],
    custom_field_display: saveData.custom_field_display || []
  }

  if (saveData.id !== undefined) {
    params.id = saveData.id
  } else {
    params.id = null
  }

  const res = await userDetailDisplaySave(params) as any
  if (res.code === 200) {
    ElMessage.success('保存成功')
  }
}

// 保存方案
const handleSaveScheme = async() => {
  if (!formRef.value) return

  await formRef.value.validate()

  if (isEditMode.value) {
    // 编辑模式，调用 edit 接口
    const editParams = {
      accessToken: store.userInfo?.accessToken,
      id: editSchemeData.value?.id || '',
      module_id: editSchemeData.value?.module_id || editSchemeData.value?.id || '',
      module_name: formData.value.name,
      oort_remark: formData.value.oort_remark,
      entity_id: editSchemeData.value?.entity_id || '',
      entity_type: editSchemeData.value?.entity_type || 10,
      basic_id: editSchemeData.value?.basic_id || null,
      model_icon: editSchemeData.value?.model_icon || '',
      oort_status: editSchemeData.value?.oort_status || 1
    }

    const res = await edit(editParams) as any
    if (res.code === 200) {
      ElMessage.success('方案编辑成功')
      otherPlanDia.value = false
      // 重新加载方案列表
      await chooseScheme()
    }
  } else {
    // 新增模式，调用 save 接口
    let newScheme = {
      accessToken: store.userInfo?.accessToken,
      save_type: 1,
      entity_id: '',
      entity_type: 0,
      module_id: '111111111',
      module_name: formData.value.name,
      oort_remark: formData.value.oort_remark,
      basic_field: basicList.value,
      custom_field: customFieldList.value || []
    }

    if (curNum.value === 10) {
      newScheme.entity_id = 'oortoort-aabb-ccdd-eeff-eb29bb427381'
      newScheme.entity_type = 10
    }

    const res = await save(newScheme) as any
    if (res.code === 200) {
      ElMessage.success('保存成功')
      otherPlanDia.value = false
    }
  }
}

// 选择方案
const chooseScheme = async() => {
  let baseParams = {
    accessToken: store.userInfo?.accessToken,
    entity_id: '',
    entity_type: 0
  }
  if (curNum.value === 10) {
    baseParams.entity_id = 'oortoort-aabb-ccdd-eeff-eb29bb427381'
    baseParams.entity_type = 10
  }

  // 我的方案
  const myParams = {
    ...baseParams,
    page: myPage.value,
    pagesize: myPageSize.value
  }
  const myRes = await list(myParams) as any
  if (myRes.code === 200) {
    mySchemeList.value = myRes.data.list || []
    myTotal.value = myRes.data.counts || 0
    myPage.value = myRes.data.page || myPage.value
    myPageSize.value = myRes.data.pagesize || myPageSize.value
    // 设置默认选中的方案（优先从我的方案中选择）
    const defaultScheme = mySchemeList.value.find(s => s.is_default === 1)
    if (defaultScheme) {
      selectedScheme.value = defaultScheme.id
    } else if (mySchemeList.value.length > 0 && !selectedScheme.value) {
      selectedScheme.value = mySchemeList.value[0].id
    }
  }

  // 公有方案（get_all = 1）
  const publicParams = {
    ...baseParams,
    get_all: 1,
    page: publicPage.value,
    pagesize: publicPageSize.value
  }
  const publicRes = await list(publicParams) as any
  if (publicRes.code === 200) {
    publicSchemeList.value = publicRes.data.list || []
    publicTotal.value = publicRes.data.counts || 0
    publicPage.value = publicRes.data.page || publicPage.value
    publicPageSize.value = publicRes.data.pagesize || publicPageSize.value
    // 如果我的方案中没有默认方案，且公有方案中有，则选中公有方案中的默认方案
    if (!selectedScheme.value && publicSchemeList.value.length > 0) {
      const defaultPublicScheme = publicSchemeList.value.find(s => s.is_default === 1)
      if (defaultPublicScheme) {
        selectedScheme.value = defaultPublicScheme.id
      } else {
        selectedScheme.value = publicSchemeList.value[0].id
      }
    }
  }

  schemeList.value = [...mySchemeList.value, ...publicSchemeList.value]

  dialogVisible.value = true
}

// 我的方案分页
const handleMySizeChange = async(val: number) => {
  myPageSize.value = val
  myPage.value = 1
  await chooseScheme()
}

const handleMyCurrentChange = async(val: number) => {
  myPage.value = val
  await chooseScheme()
}

// 公有方案分页
const handlePublicSizeChange = async(val: number) => {
  publicPageSize.value = val
  publicPage.value = 1
  await chooseScheme()
}

const handlePublicCurrentChange = async(val: number) => {
  publicPage.value = val
  await chooseScheme()
}

// 部门设置专用的另存为方法
const deptSaveAs = () => {
  if (deptDiaRef.value && deptDiaRef.value.otherBt) {
    deptDiaRef.value.otherBt()
  }
}

// 部门设置专用的选择方案方法
const deptChooseScheme = () => {
  if (deptDiaRef.value && deptDiaRef.value.selectBt) {
    deptDiaRef.value.selectBt()
  }
}

// 角色设置专用的另存为方法
const roleSaveAs = () => {
  if (roleDiaRef.value && roleDiaRef.value.otherBt) {
    roleDiaRef.value.otherBt()
  }
}

// 角色设置专用的选择方案方法
const roleChooseScheme = () => {
  if (roleDiaRef.value && roleDiaRef.value.selectBt) {
    roleDiaRef.value.selectBt()
  }
}

// 用户设置专用的另存为方法
const userSaveAs = () => {
  if (userDiaRef.value && userDiaRef.value.otherBt) {
    userDiaRef.value.otherBt()
  }
}

// 用户设置专用的选择方案方法
const userChooseScheme = () => {
  if (userDiaRef.value && userDiaRef.value.selectBt) {
    userDiaRef.value.selectBt()
  }
}

// 确定方案
const confirmScheme = async() => {
  const selected = schemeList.value.find(s => s.id === selectedScheme.value)
  if (!selected) {
    ElMessage.warning('请选择一个方案')
    return
  }
  const params = {
    accessToken: store.userInfo?.accessToken,
    entity_id: 'oortoort-aabb-ccdd-eeff-eb29bb427381',
    entity_type: 10,
    module_id: selected.id
  }
  const res = await select(params) as any
  if (res.code === 200) {
    ElMessage.success('选择方案成功')
    await refreshDefaultInfo()
    dialogVisible.value = false
  }
}

// 方案选择
function selectScheme(id) {
  selectedScheme.value = id
}

// 编辑方案
const editScheme = async(item: any) => {
  const accessToken = store.userInfo?.accessToken
  const entityType = item?.entity_type
  const entityId = item?.entity_id

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
    editBasicList.value = res.data.basic_field || res.data.basic
    editCustomFieldList.value = res.data.custom_field
  }
  editPlanVisible.value = true
}

// 查看方案
const viewScheme = (item: any) => {
  viewSchemeItem.value = item
  viewPlanVisible.value = true
}

// 删除方案
const deleteScheme = async(item: any) => {
  if (item.is_default === 1) {
    ElMessage.error('默认方案不能删除')
    return
  }
  const scheme = schemeList.value.find(s => s.id === item.id)
  if (!scheme) return

  await ElMessageBox.confirm(
    `确定要删除 "${scheme.module_name}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )

  // 用户确认删除，调用deleteBoard接口
  const deleteParams = {
    accessToken: store.userInfo?.accessToken,
    id: scheme.id
  }
  const res = await deleteBoard(deleteParams) as any
  if (res.code === 200) {
    ElMessage.success('删除成功')
    // 重新获取最新的方案列表
    await chooseScheme()
    // 如果删除的是当前选中的方案，需要重新选择
    if (selectedScheme.value === item.id) {
      const firstScheme = mySchemeList.value.length > 0 ? mySchemeList.value[0] : (publicSchemeList.value.length > 0 ? publicSchemeList.value[0] : null)
      if (firstScheme) {
        selectedScheme.value = firstScheme.id
      }
    }
  }
}

const curNum = ref(0)
let basicList = ref()
let customFieldList = ref()
// 编辑方案相关数据
let editDataRes = ref()
let editBasicList = ref()
let editCustomFieldList = ref()

// 处理编辑方案中子组件开关状态变化
const handleEditUpdateBasicList = (fieldKey: string, isShow: boolean) => {
  if (editBasicList.value && Array.isArray(editBasicList.value)) {
    const item = editBasicList.value.find(item => item.field_key === fieldKey)
    if (item) {
      item.is_show = isShow ? 1 : 0
    }
  }
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
    editPlanVisible.value = false
    // 刷新方案列表
    if (dialogVisible.value) {
      chooseScheme()
    }
  }
}

// 刷新默认设置数据
const refreshDefaultInfo = async() => {
  if (mainTab.value === 'default' && subTab.value === 'info') {
    const params = {
      accessToken: store.userInfo?.accessToken,
      entity_id: 'oortoort-aabb-ccdd-eeff-eb29bb427381',
      entity_type: 10
    }
    const res = await defaultInfo(params) as any
    if (res.code === 200) {
      dataRes.value = res.data
      basicList.value = res.data.basic_field
      customFieldList.value = res.data.custom_field
    }
  }
}

// 处理子组件开关状态变化
const handleUpdateBasicList = (fieldKey: string, isShow: boolean) => {
  if (basicList.value && Array.isArray(basicList.value)) {
    const item = basicList.value.find(item => item.field_key === fieldKey)
    if (item) {
      item.is_show = isShow ? 1 : 0
    }
  }
}

// 处理扩展字段更新
const handleUpdateCustomFields = (customFields: any[]) => {
  customFieldList.value = customFields
}

// 处理编辑方案中扩展字段更新
const handleEditUpdateCustomFields = (customFields: any[]) => {
  editCustomFieldList.value = customFields
}

// 根据主标签返回对应的预览名称
const previewName = computed(() => {
  if (mainTab.value === 'dept') {
    return currentDeptName.value
  } else if (mainTab.value === 'role') {
    return currentRoleName.value
  } else if (mainTab.value === 'user') {
    return currentUserName.value
  }
  return 'xx部门/xx分组'
})

watch(
  [mainTab, subTab], // 两个值一起监听
  async([newMain, newSub]) => {
    if (newMain === 'default' && newSub === 'info') {
      curNum.value = 10
      const params = {
        accessToken: store.userInfo?.accessToken,
        entity_id: 'oortoort-aabb-ccdd-eeff-eb29bb427381',
        entity_type: 10
      }

      const res = await defaultInfo(params) as any
      if (res.code === 200) {
        dataRes.value = res.data
        basicList.value = res.data.basic_field
        customFieldList.value = res.data.custom_field
        defaultModelId.value = res.data.id || ''
      }
    }
    // 当切换到默认设置的通讯录描述时，更新 modelId
    if (newMain === 'default' && newSub === 'desc') {
      if (dataRes.value && dataRes.value.id) {
        defaultModelId.value = dataRes.value.id
      }
    }
    // 当切换到部门设置的通讯录描述时，更新部门名称和 modelId
    if (newMain === 'dept' && newSub === 'desc') {
      if (deptDiaRef.value && deptDiaRef.value.pidObj) {
        const pidObj = deptDiaRef.value.pidObj
        if (pidObj.oort_dcode) {
          currentDeptName.value = pidObj.oort_dname || 'xx部门/xx分组'
        } else {
          currentDeptName.value = 'xx部门/xx分组'
        }
      }
      if (deptDiaRef.value && deptDiaRef.value.modelId) {
        deptModelId.value = deptDiaRef.value.modelId
      }
    }
    // 当切换到角色设置的通讯录描述时，更新角色名称和 modelId
    if (newMain === 'role' && newSub === 'desc') {
      if (roleDiaRef.value && roleDiaRef.value.currentRoleObj) {
        const roleObj = roleDiaRef.value.currentRoleObj
        currentRoleName.value = roleObj.name || 'xx角色'
      }
      if (roleDiaRef.value && roleDiaRef.value.modelId) {
        roleModelId.value = roleDiaRef.value.modelId
      }
    }
    // 当切换到用户设置的通讯录描述时，更新用户名称和 modelId
    if (newMain === 'user' && newSub === 'desc') {
      if (userDiaRef.value && userDiaRef.value.currentUserObj) {
        const userObj = userDiaRef.value.currentUserObj
        currentUserName.value = userObj.oort_name || 'xx用户'
      }
      if (userDiaRef.value && userDiaRef.value.modelId) {
        userModelId.value = userDiaRef.value.modelId
      }
    }
  },
  { immediate: true } // 首次渲染也执行
)

// 监听 deptDiaRef 的变化，实时更新部门名称
watch(
  () => deptDiaRef.value?.pidObj,
  (pidObj) => {
    if (pidObj) {
      if (pidObj.oort_dcode) {
        currentDeptName.value = pidObj.oort_dname || 'xx部门/xx分组'
      } else {
        currentDeptName.value = 'xx部门/xx分组'
      }
    }
  },
  { deep: true }
)

// 监听 roleDiaRef 的变化，实时更新角色名称
watch(
  () => roleDiaRef.value?.currentRoleObj,
  (roleObj) => {
    if (roleObj && roleObj.name) {
      currentRoleName.value = roleObj.name
    }
  },
  { deep: true }
)

// 监听 userDiaRef 的变化，实时更新用户名称
watch(
  () => userDiaRef.value?.currentUserObj,
  (userObj) => {
    if (userObj && userObj.oort_name) {
      currentUserName.value = userObj.oort_name
    }
  },
  { deep: true }
)

// 监听各组件 modelId 的变化，实时更新
watch(
  () => deptDiaRef.value?.modelId,
  (modelId) => {
    if (modelId) {
      deptModelId.value = modelId
    }
  }
)

watch(
  () => roleDiaRef.value?.modelId,
  (modelId) => {
    if (modelId) {
      roleModelId.value = modelId
    }
  }
)

watch(
  () => userDiaRef.value?.modelId,
  (modelId) => {
    if (modelId) {
      userModelId.value = modelId
    }
  }
)

</script>

<style scoped lang="scss">
.setting-page {
  padding: 20px;
  width: 100%;
  border-radius: var(--common-border-radius) var(--common-border-radius) 0 0;
  flex: 1;
  background: #fff;
  .setting-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
    padding: 20px 0;
    margin: -20px -20px 0 -20px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .save{
      position: absolute;
      right: 20px;
      top: 20px;
      .bt{
        width: 194px;
        height: 34px;
        border-radius: 4px;
      }
    }
    .main-tabs {
      width: 100%;
      :deep(.el-tabs__nav) {
        font-size: 18px;
        line-height: 28px;
        font-weight: 400;
      }
      :deep(.el-tabs__active-bar){
        width: 120px;
      }
      :deep(.el-tabs__item){
        width: 120px;
        padding: 0;
        font-size: 18px;
        letter-spacing: 0;
        line-height: 28px;
        font-weight: 400;
      }
      :deep(.el-tabs__item.is-active) {
        color: var(--el-color-primary);
      }
      :deep(.sub-tabs .el-tabs__nav-wrap::after) {
        display: none;
      }
    }
  }
}

.sub-line {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
  padding-bottom: 20px;
}

:deep(.sub-tabs .el-tabs__active-bar){
  width: 36px !important;
  left: 18% !important;
}

// 按钮样式保持
.sub-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  .lcw {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    span {
      font-size: 18px;
      color: var(--el-color-primary);
      line-height: 28px;
    }
  }
}

.scheme-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.scheme-section {
  .scheme-section-title {
    font-size: 18px;
    color: var(--el-color-primary);
    letter-spacing: 0;
    font-weight: 400;
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;

    &::before {
      content: '';
      width: 3px;
      height: 18px;
      background-color: var(--el-color-primary);
    }

    span {
      color: #33333360;
      font-size: 14px;
    }
  }
}

.scheme-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  .scheme-card {
    background: #FAFAFA;
    border-radius: 12px;
    box-shadow: none;
    width: 306px;
    min-height: 116px;
    padding: 16px 24px 16px 24px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: border-color 0.2s;

    &.active {
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-hb);
    }

    .scheme-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .scheme-title-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .scheme-title {
      font-size: 20px;
      color: #222;
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .scheme-badge {
      padding: 2px 8px;
      border-radius: 4px;
      background-color: #52c41a;
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      line-height: 18px;
      white-space: nowrap;
    }

    .scheme-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .scheme-desc {
      font-size: 14px;
      color: #888;
      margin-bottom: 16px;
    }

    .scheme-stats {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      margin-top: 8px;
    }

    .stat {
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 6px;
      img{
        width: 14px;
      }
      span{
        font-size: 14px;
        color: #888;
      }
    }
  }
}

.scheme-pagination {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.justifyAlign {
  display: inline-flex;
  justify-content: center;
}

.dialog-footer-btns {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.setting-body{
  padding-top: 24px;
}

:deep(.el-form-item__content) {
  flex: none !important;
  width: 480px !important;
}

.dsconfig-alert {
  width: 42%;
  height: 36px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  :deep(.el-alert__description){
    display: flex;
    align-items: center;
    gap: 8px;
    span{
      color: #FF800B;
      font-size: 14px;
      line-height: 19.6px;
    }
    img{
      width: 13.33px;
      height: 13.33px;
    }
  }
  :deep(.el-alert__close-btn){
    width: 12px;
    height: 12px;
    color: #FF800B;
  }
}
</style>
