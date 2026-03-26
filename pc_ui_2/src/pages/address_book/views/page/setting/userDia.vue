<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2024-11-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <div class="cmu_Page">
    <div class="tenant_content">
      <!--table-->
      <div class="tableTenBox flexRowAC">
        <!--部门tree-->
        <div v-yResize class="police_aside">
          <div class="treeTitle">
            组织架构
          </div>
          <div class="tree_search_content flexRowAC">
            <el-input
              v-model="searchDeptName"
              suffix-icon="el-icon-search"
              placeholder="搜索"
              debounce="300"
              @change="getSearchDept"
            />
          </div>
          <el-tree
            style="background: #fff;"
            :data="treeData"
            highlight-current
            node-key="id"
            :default-expanded-keys="defaultExpandedKeys"
            :props="defaultProps"
            :load="loadNode"
            :lazy="true"
            @node-click="nodeClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node flexRowAC">
                <!-- 部门节点 -->
                <template v-if="data.type === 'dept'">
                  <oort-img :src="data.oort_dept_photo" style="width: 1rem;height:1rem;margin: 0 0.25rem;border-radius: 50%" default-img="dept" />
                  <el-tooltip :open-delay="500" class="item" effect="light" :content="node.label" placement="top">
                    <div :class="{'delete_text': data.oort_status === 9, 'activeDept': data.id === currentNodeId && data.type === 'dept'}">
                      {{ node.label }}
                    </div>
                  </el-tooltip>
                </template>
                <!-- 用户节点 -->
                <template v-else-if="data.type === 'user'">
                  <oort-img :src="data.oort_photo" style="width: 1rem;height: 1rem;border-radius: 50%" default-img="tx" />
                  <el-tooltip :open-delay="500" class="item" effect="light" :content="node.label" placement="top">
                    <div :class="{'activeUser': data.id === currentNodeId && data.type === 'user'}">
                      {{ node.label }}
                    </div>
                  </el-tooltip>
                </template>
              </div>
            </template>
          </el-tree>
        </div>
        <!--设置区域-->
        <div class="body_box">
          <InfoSetting
            v-if="currentNodeType === 'user'"
            :data="dataRes"
            :basic-list="basicList"
            :custom-field-list="customFieldList"
            :is-user-setting="true"
            :user-id="currentNodeId"
            :dept-id="currentNodeDeptId"
            :user-data="currentUserRawData"
            @update-basic-list="handleUpdateBasicList"
            @update-custom-fields="handleUpdateCustomFields"
          />
          <div v-else class="empty-state">
            <div class="empty-content">
              <oort-svg-icon name="empty" width="80" height="80" />
              <p>请选择用户进行设置</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <other-plan-dia
      v-model:visible="otherPlanVisible"
      :data-res="dataRes"
      :basic-list="basicList"
      :custom-field-list="customFieldList"
    />
    <select-plan-dia
      v-model:visible="selectPlanVisible"
      :data-res="dataRes"
      :basic-list="basicList"
      :custom-field-list="customFieldList"
      @edit-scheme="handleEditScheme"
      @selected="handlePlanSelected"
    />
    <edit-plan-dia
      v-model:visible="editPlanVisible"
      :scheme-item="editSchemeItem"
      @refresh="handleEditRefresh"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getUserInfoByUserId, userSave, deptList, userlist } from '@/api/address_book/index'
import InfoSetting from './InfoSetting.vue'
import { useCounter } from '@/store/counter'
import { ElMessage } from 'element-plus'
import otherPlanDia from '@/pages/address_book/views/page/setting/component/otherPlanDia.vue'
import selectPlanDia from '@/pages/address_book/views/page/setting/component/selectPlanDia.vue'
import editPlanDia from '@/pages/address_book/views/page/setting/component/editPlanDia.vue'

const props = defineProps<{
  active?: boolean
}>()

const store: any = useUserStore()
const storeC: any = useCounter()
const searchDeptName = ref<any>('') // 搜索部门
const treeData = ref<any>([]) // 部门树data
const currentNodeId = ref<any>('') // 当前选中的节点ID
const currentNodeType = ref<any>('') // 当前选中的节点类型（dept/user）
const currentUserObj = ref<any>({}) // 当前选中的用户信息
const currentNodeDeptId = ref<string>('') // 当前用户所在部门ID
const currentUserRawData = ref<any>(null) // 当前用户的数据
// 配置选项
const defaultProps = {
  label: (data: any) => {
    if (data.type === 'dept') {
      return data.oort_dname
    } else if (data.type === 'user') {
      return data.oort_name
    }
    return data.name || data.oort_dname || data.oort_name
  },
  children: 'children',
  isLeaf: (data: any) => {
    // 用户节点是叶子节点，部门节点可能有子节点
    return data.type === 'user' || data.isLeaf === true
  }
}

// 默认展开的节点 - 只展开根节点
const defaultExpandedKeys = ref<string[]>([])

let otherPlanVisible = ref<boolean>(false)
let selectPlanVisible = ref<boolean>(false)
let editPlanVisible = ref<boolean>(false)
let editSchemeItem = ref<any>({})
let currentUserId = ref<any>(null) // 当前编辑的用户ID
const dataRes = ref()
let basicList = ref()
let customFieldList = ref()

// 节点点击事件（只处理用户点击事件）
const nodeClick = (data: any) => {
  currentNodeId.value = data.id
  currentNodeType.value = data.type
  currentNodeDeptId.value = data.oort_dcode || ''
  if (data.type === 'user') {
    // 用户节点，获取用户设置
    currentUserId.value = data.oort_uuid
    currentUserObj.value = data // 保存当前选中的用户信息
    currentUserRawData.value = data.rawUserData || null // 用户数据
    getDefaultInfo(data.oort_uuid)
  }
}

// 获取设置信息
const getDefaultInfo = async(entityId: string) => {
  if (!entityId) return

  const params = {
    accessToken: store.userInfo?.accessToken,
    oort_uuid: entityId,
    entity_type: 40
  }
  const res = await getUserInfoByUserId(params) as any
  if (res.code === 200) {
    dataRes.value = res.data
    basicList.value = res.data.basic_field
    customFieldList.value = res.data.custom_field
  }
}

// 懒加载节点数据
const loadNode = async(node: any, resolve: Function) => {
  if (node.level === 0) {
    // 第一级加载根部门
    await loadRootDept(resolve)
  } else if (node.data.type === 'dept') {
    // 部门节点展开时，加载子部门和用户
    await loadDeptChildren(node.data, resolve)
  } else {
    // 其他节点（如用户）没有子节点
    resolve([])
  }
}

// 加载根部门
const loadRootDept = async(resolve: Function) => {
  try {
    const params: any = { accessToken: store.userInfo.accessToken }
    const rootRes = await deptList({ ...params, dept_code: '', dept_id: '' })

    if (rootRes.code === 200 && rootRes.data.list?.length) {
      const rootDto = rootRes.data.list[0]

      const rootNode = {
        id: rootDto.oort_dcode,
        dept_id: rootDto.oort_dcode,
        oort_dname: rootDto.oort_dname,
        oort_dept_photo: rootDto.oort_dept_photo,
        type: 'dept',
        oort_status: rootDto.oort_status,
        children: [] as any[],
        // 标记为非叶子节点，以便显示箭头
        isLeaf: false
      }

      // 设置默认展开根节点
      defaultExpandedKeys.value = [rootDto.oort_dcode]

      resolve([rootNode])
    } else {
      // 如果没有数据，创建一个虚拟根节点
      const rootNode = {
        id: 'root',
        dept_id: '',
        oort_dname: storeC.tenantData?.company_name || '所有租户',
        type: 'dept',
        children: [],
        isLeaf: false
      }

      // 设置默认展开根节点
      defaultExpandedKeys.value = ['root']

      resolve([rootNode])
    }
  } catch (error) {
    console.error('加载根部门失败:', error)
    resolve([])
  }
}

// 加载部门子节点（子部门和用户）
const loadDeptChildren = async(deptData: any, resolve: Function) => {
  try {
    const params: any = {
      accessToken: store.userInfo.accessToken,
      pdeptcode: deptData.dept_id || deptData.id
    }

    // 同时加载子部门和用户
    const [subDeptRes, userRes] = await Promise.all([
      deptList(params),
      userlist({ ...params, deptcode: deptData.dept_id || deptData.id })
    ])

    const children: any[] = []

    // 处理子部门
    if (subDeptRes.code === 200 && subDeptRes.data.list?.length) {
      const subDepts = subDeptRes.data.list.map((d: any) => ({
        id: d.oort_dcode,
        dept_id: d.oort_dcode,
        oort_dname: d.oort_dname,
        oort_dept_photo: d.oort_dept_photo,
        type: 'dept',
        oort_status: d.oort_status,
        // 默认设为非叶子节点，实际加载时会判断
        isLeaf: false
      }))
      children.push(...subDepts)
    }

    // 处理用户
    if (userRes.code === 200 && userRes.data.list?.length) {
      const users = userRes.data.list.map((u: any) => ({
        id: u.oort_uuid,
        oort_uuid: u.oort_uuid,
        oort_name: u.oort_name,
        oort_photo: u.oort_photo,
        dept_id: u.oort_depcode,
        oort_dcode: u.oort_depcode,
        type: 'user',
        // 用户节点是叶子节点
        isLeaf: true,
        // 保存用户数据
        rawUserData: u
      }))
      children.push(...users)
    }

    resolve(children)
  } catch (error) {
    console.error('加载部门子节点失败:', error)
    resolve([])
  }
}

// 部门树搜索 - 修改为使用懒加载方式
const getSearchDept = async() => {
  if (!searchDeptName.value) {
    // 没有搜索关键词时，重新加载根节点
    treeData.value = []
    await loadRootDept((nodes: any[]) => {
      treeData.value = nodes
    })
    return
  }

  try {
    // 使用deptList接口进行搜索
    const params = {
      accessToken: store.userInfo.accessToken,
      dept_code: '', // 从根部门开始搜索
      dept_id: '', // 部门ID
      is_job: 0, // 返回职位信息
      is_post: 0, // 返回岗位信息
      keyword: searchDeptName.value // 搜索关键词
    }

    const res = await deptList(params) as any
    if (res.code === 200) {
      // 构建搜索结果的树形结构
      const treeStructure = buildSearchTreeStructure(res.data)
      treeData.value = treeStructure
    } else {
      // 搜索无结果
      treeData.value = []
    }
  } catch (error) {
    treeData.value = []
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

// 保存
const onSubmit = async() => {
  if (!dataRes.value) {
    ElMessage.warning('请先选择用户')
    return
  }

  // 先调用getUserInfoByUserId获取默认方案
  const defaultParams = {
    accessToken: store.userInfo?.accessToken,
    oort_uuid: dataRes.value.oort_uuid,
    entity_type: dataRes.value.entity_type
  }
  const defaultRes = await getUserInfoByUserId(defaultParams) as any
  if (defaultRes.code !== 200) {
    ElMessage.error('获取默认方案失败')
    return
  }

  // 使用getUserInfoByUserId的返回值构建保存参数
  const params = {
    accessToken: store.userInfo?.accessToken,
    oort_uuid: defaultRes.data.oort_uuid,
    entity_type: defaultRes.data.entity_type,
    module_id: defaultRes.data.id,
    module_name: defaultRes.data.module_name,
    save_type: 0,
    basic_field: basicList.value,
    custom_field: customFieldList.value
  }
  const res = await userSave(params) as any
  if (res.code === 200) {
    ElMessage.success('保存成功')
    // 保存成功后刷新数据
    if (currentUserId.value) {
      await getDefaultInfo(currentUserId.value)
    }
  }
}

const otherBt = () => {
  if (!currentUserId.value) {
    ElMessage.warning('请选择用户')
    return
  }
  otherPlanVisible.value = true
}

const selectBt = () => {
  if (!currentUserId.value) {
    ElMessage.warning('请选择用户')
    return
  }
  selectPlanVisible.value = true
}

// 处理编辑方案事件
const handleEditScheme = (item: any) => {
  editSchemeItem.value = item
  editPlanVisible.value = true
}

// 处理编辑完成后的刷新
const handleEditRefresh = async() => {
  await getDefaultInfo(currentUserId.value)
}

// 构建搜索树形数据结构（用于搜索）
const buildSearchTreeStructure = (data: any) => {
  const list = data.list || []

  // 如果搜索结果为空，返回空数组
  if (list.length === 0) {
    return []
  }

  // 搜索结果可能包含多个部门，我们需要构建一个虚拟根节点
  const rootDept = {
    id: 'search_root',
    dept_id: '',
    oort_dname: '搜索结果',
    type: 'dept',
    children: [] as any[],
    isLeaf: false
  }

  const processSearchDeptData = (deptList: any[], parentChildren: any[]) => {
    deptList.forEach((deptData: any) => {
      const deptNode = {
        id: deptData.dept_id || deptData.oort_dcode,
        dept_id: deptData.dept_id || deptData.oort_dcode,
        oort_dname: deptData.oort_dname || deptData.oort_dname,
        oort_dept_photo: deptData.oort_dept_photo,
        type: 'dept',
        oort_status: deptData.oort_status,
        pdeptcode: deptData.pdeptcode,
        children: [] as any[],
        isLeaf: false
      }

      parentChildren.push(deptNode)

      const users = deptData.users || []
      users.forEach((user: any) => {
        const userNode = {
          id: user.oort_uuid || user.oort_uuid,
          oort_uuid: user.oort_uuid || user.oort_uuid,
          oort_name: user.oort_name || user.oort_name,
          oort_loginid: user.oort_loginid,
          oort_photo: user.oort_photo,
          dept_id: user.dept_id,
          oort_dcode: user.oort_depcode || user.dept_id, // 用于兼容
          type: 'user',
          isLeaf: true,
          // 保存用户数据
          rawUserData: user
        }
        deptNode.children.push(userNode)
      })

      const sonDept = deptData.son_dept || []
      if (sonDept.length > 0) {
        processSearchDeptData(sonDept, deptNode.children)
      }
    })
  }

  processSearchDeptData(list, rootDept.children)

  // 如果搜索结果只有一个部门，直接返回该部门
  if (rootDept.children.length === 1) {
    return rootDept.children
  }

  return [rootDept]
}

// 选择方案成功后刷新当前用户的默认信息
const handlePlanSelected = async() => {
  if (currentUserId.value) {
    await getDefaultInfo(currentUserId.value)
  }
}

// 获取 model_id
const modelId = computed(() => {
  return dataRes.value?.id || ''
})

// 暴露方法给父组件调用
defineExpose({
  onSubmit,
  otherBt,
  selectBt,
  currentUserObj,
  currentNodeId,
  currentNodeType,
  modelId,
  dataRes,
  basicList,
  customFieldList,
  currentUserId
})

// 根据父组件传入的 active 控制何时初始化（避免未点击标签时就请求接口）
const inited = ref(false)
watch(
  () => props.active,
  async(val) => {
    if (val && !inited.value) {
      inited.value = true
      await loadAllDeptAndUserData()
    }
  },
  { immediate: true }
)

// 当租户数据更新时，如果当前已初始化过，则刷新数据
watch(
  () => storeC.tenantData,
  async(newVal) => {
    if (newVal && newVal.company_name && inited.value) {
      await loadAllDeptAndUserData()
    }
  }
)

</script>
<style lang="scss" scoped>
.cmu_Page {
  height: 100%;
  width: 100%;
  overflow: auto;

  .tenant_content {
    height: 100%;
    width: 100%;
  }

  .tableTenBox {
    background: #fff;
    height: 100%;
    width: 100%;
    flex: 1;
  }
}

// tabs
:deep(.tenanat-tabs) {
  padding: 0 20px;

  .el-tabs__item {
    color: #999;
  }

  .el-tabs__item.is-active {
    color: var(--el-color-primary);
  }
}

:deep(.tableTenBox) {
  align-items: flex-start;

  .header_tenant_cell {
    background: #F8F8F9;
  }
}

// 部门树
.police_aside {
  width: 300px;
  padding-right: 20px;
  flex-shrink: 0;
  height: 100%;

  .tree_search_content {
    justify-content: center;
    padding-bottom: 10px;

    .el-input__inner {
      background: #fff;
      border: none;
    }
  }

  :deep(.el-tree-node__content) {
    --el-tree-node-hover-bg-color: var(--el-menu-hover-bg-color);

    height: 38px;
    font-size: 14px;
    color: #333;
  }
}

:deep(.el-tree) {
  height: calc(100% - 80px);
  overflow: auto;
}

.body_box {
  padding-left: 20px;
  flex: 1;
  height: 100%;
  overflow: auto;
}

.custom-tree-node {
  .activeDept {
    color: var(--el-color-primary);
    font-weight: 500;
  }

  .activeUser {
    color: var(--el-color-primary);
    font-weight: 500;
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .empty-content {
    text-align: center;
    color: #999;

    p {
      margin-top: 16px;
      font-size: 14px;
    }
  }
}

// 部门树标题
.treeTitle {
  color: var(--el-color-primary);
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
}

:deep(.el-tabs__header) {
  padding-top: 20px;

  .el-tabs__nav-wrap::after {
    background: #E7EAEF;
  }

  .el-tabs__item.is-top {
    font-size: 16px;
    font-weight: 700;
  }
}

.paginationBox {
  justify-content: center;
  height: 70px;
}

.statusC{
  padding-top: 20px;
}

// 状态
.staBtns {
  padding: 3px 7px;
  font-size: 14px;
  line-height: 14px;
  border-radius: 4px;
  position: relative;
  padding-left: 12px;

  &::before {
    content: "";
    display: flex;
    position: absolute;
    top: 6px;
    left: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: gray;
  }

  &.WX {
    color: #52C41A;

    &::before {
      background: #52C41A;
    }
  }

  &.LKL {
    color: #FF8823;

    &::before {
      background: #FF8823;
    }
  }

  &.ZFB {
    color: #1A53FF;

    &::before {
      background: #1A53FF;
    }
  }
}

.post_job_span {
  background-color: var(--el-menu-hover-bg-color);
  color: var(--el-color-primary);
  margin: 0 4px 4px 0;
}

// 部门树标题
.treeTitle {
  color: var(--el-color-primary);
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
}
.detailsInfo {
  .detailsImg {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background-color: #f7f7f7;
    margin-right: 24px;
  }
}
.person-name-sex {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}
.person-realname {
  margin-right: 10px;
}
.sex-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
.details_info{
  background: #fff;
  border-radius: 12px;
  margin-top: 24px;
}

.info-icon {
  width: 24px;
  height: 24px;
  margin-right: 7px;
  vertical-align: middle;
}
.auth-section {
  margin-top: 32px;
}
.auth-block {
  margin-bottom: 32px;
}
.auth-block-title {
  color: #333333;
  font-size: 16px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  .paDetail{
    font-size: 11px;
    color: #888;
    padding-left: 22px;
  }
}
.auth-config-header {
  display: flex;
  gap: 6px;
  .auth-config-bt {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 9px 16.5px !important;
    border-radius: 4px !important;
    background: #F1F2F5;
    color: #191919;
    font-size: 14px;
    line-height: 22px;
    margin-right: 8px;
    &.auth-config-bt-active{
      background: var(--el-color-primary);
      color: #FFFFFF;
      .auth-config-bt-active-d{
        display: flex;
        padding: 2px 6px;
        border-radius: 4px;
        background: #00B321;
        margin-left: 10px;
        align-items: center;
        gap: 2px;
        img{
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}

.auth-other-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.auth-other-row {
  display: flex;
  gap: 32px;
}

.auth-other-item{
  display: flex;
  flex-direction: column;
  gap: 4px;
  .auth-other-item_t{
    color: #666666;
    font-size: 14px;
    line-height: 40px;
  }
  .auth-other-item_b {
    display: flex;
    align-items: center;
    border-radius: 8px;
    border: 1px solid #E7EAEF;
    padding: 24px 20px;
    .detailsImg1{
      width: 38.85px;
      height: 40px;
    }
    .safeI{
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 160px;
      margin-left: 20px;
      margin-right: 60px;
      .safeITitle{
        color: #333333;
        font-size: 16px;
        line-height: 24px;
      }
      .detailsI_d{
        color: #999999;
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
}

.auth-other-icon {
  font-size: 32px;
  margin-bottom: 8px;
}
.auth-other-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.common_btn{
  border-radius: 2px;
}

.auth-block-content2{
  display: inline-flex;
  border-radius: 4px;
  background: #F1F2F5;
  padding: 9px 16px;
  gap: 16px;
  span{
    color: #191919;
    font-size: 14px;
    line-height: 22px;
  }
}

.depImg {
  width: 34px;
  height: 34px;
  background-size: cover;
  border-radius: 50%;
}

.cert-status-tag {
  width: 53px;
  height: 22px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  text-align: center;
}

.cert-status-success {
  background: #F6FFED;
  border: 1px solid #B7EB8F;
  color: #52C41A;
}

.cert-status-info {
  background: #F5F7FA;
  border: 1px solid #BFBFBF;
  color: #919191;
}

:deep(.dl_bt){
  margin: 0 2px 0 0;
  height: 22px;
  border-radius: 4px;
  padding: 2px 10px;
  font-size: 12px;
  line-height: 18px;
  background-color: var(--el-menu-hover-bg-color);
  color: var(--el-color-primary);
}

:deep(.auth-config-bt) {
  background: #F1F2F5 !important;
  color: #191919 !important;
  border: none !important;
  box-shadow: none !important;
}
:deep(.auth-config-bt.auth-config-bt-active),
:deep(.auth-config-bt.auth-config-bt-active):hover,
:deep(.auth-config-bt.auth-config-bt-active):focus {
  background: var(--el-color-primary) !important;
  color: #fff !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.el-descriptions__label){
  color: #999999;
  font-size: 14px;
  line-height: 22px;
}
:deep(.el-descriptions__content){
  color: #333333;
  font-size: 14px;
  line-height: 22px;
}
</style>
