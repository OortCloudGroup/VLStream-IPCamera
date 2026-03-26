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
            :load="getDeptTreeUI"
            :data="treeData"
            lazy
            highlight-current
            node-key="oort_dcode"
            :default-expanded-keys="['','99']"
            :props="defaultProps"
            @node-click="deptClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node flexRowAC">
                <img
                  v-if="data.oort_dept_photo"
                  style="width: 1rem;height:1rem;margin: 0 0.25rem;border-radius: 50%"
                  :src="data.oort_dept_photo"
                />
                <img v-else style="width: 1rem;margin: 0 0.25rem" src="@/assets/img/dept_default.png" />
                <el-tooltip :open-delay="500" class="item" effect="light" :content="node.label" placement="top">
                  <div :class="{'delete_text': data.oort_status === 9, 'activeDept': data.oort_dcode === currentDeptCode}">
                    {{ node.label }}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-tree>
        </div>
        <!--table-->
        <div class="body_box">
          <InfoSetting
            v-if="currentDeptCode && dataRes"
            :data="dataRes"
            :basic-list="basicList"
            :custom-field-list="customFieldList"
            @update-basic-list="handleUpdateBasicList"
            @update-custom-fields="handleUpdateCustomFields"
          />
          <div v-else class="empty-state">
            <div class="empty-content">
              <oort-svg-icon name="empty" width="80" height="80" />
              <p>请选择部门进行设置</p>
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
import { ref, nextTick, watch, computed } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { useUserStore } from '@/store/modules/user'
// import { deptList } from '@/api/unifiedUsert/apaasUser'
import { deptGet, deptSave, deptList } from '@/api/address_book/index'
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
const treeData = ref<any>([]) // 部门树date
const currentDeptCode = ref<any>('') // 当前部门code
const dataRes = ref()
let basicList = ref()
let customFieldList = ref()
const pidObj = ref<any>({
  oort_dname: storeC.tenantData?.company_name || '全部',
  oort_dcode: ''
})
// 配置选项
const defaultProps = {
  label: 'oort_dname',
  children: 'children',
  isLeaf: (data) => {
    return (data['hadchild'] === 0)
  }
}
let otherPlanVisible = ref<boolean>(false)
let selectPlanVisible = ref<boolean>(false)
let editPlanVisible = ref<boolean>(false)
let editSchemeItem = ref<any>({})

interface Tree {
  oort_dname: string
  oort_dcode: any
  leaf?: boolean
}

// 设置
const getDefaultInfo = async(id) => {
  const params = {
    accessToken: store.userInfo?.accessToken,
    deptcode: id,
    entity_type: 20
  }
  const res = await deptGet(params) as any
  if (res.code === 200) {
    dataRes.value = res.data
    basicList.value = res.data.basic_field
    customFieldList.value = res.data.custom_field
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

// 部门树列表
const getDeptTreeUI = (node: Node, resolve: (data: Tree[]) => void) => {
  let data = {
    accessToken: store.userInfo.accessToken,
    tenant_id: 'oortoort-aabb-ccdd-eeff-eb29bb427381',
    page: 1,
    pagesize: 99
  }
  if (node.level === 0) {
    return resolve([{
      oort_dname: storeC.tenantData?.company_name || '全部',
      oort_dcode: ''
    }])
  } else {
    data['pdeptcode'] = node.data.oort_dcode
  }
  deptList(data).then((res: any) => {
    if (node.level === 0) {
      nextTick(() => {
        let nodeData: any = node.childNodes[0]
        nodeData.expanded = true
        nodeData.loadData()
      })
    }
    if (res.code === 200) {
      resolve(res.data.list)
    }
  })
}

// 部门树选中
const deptClick = (data) => {
  currentDeptCode.value = data.oort_dcode
  pidObj.value = data
  // 只有在选中具体部门时
  if (data.oort_dcode) {
    getDefaultInfo(currentDeptCode.value)
  }
}

// 部门树搜索
const getSearchDept = (dept) => {
  let data = {
    accessToken: store.userInfo.accessToken,
    tenant_id: 'oortoort-aabb-ccdd-eeff-eb29bb427381',
    page: 1,
    pagesize: 99
  }
  if (searchDeptName.value) {
    data['keyword'] = searchDeptName.value
  } else {
    let rootDept = {
      oort_dname: storeC.tenantData?.company_name || '全部',
      oort_dcode: ''
    }
    if (dept && dept.oort_dname) {
      rootDept = dept
    }
    treeData.value = [rootDept]
    // 重置时也不调用deptGet，只更新当前选中的部门
    currentDeptCode.value = rootDept.oort_dcode
    pidObj.value = rootDept
    return
  }
  deptList(data).then((res: any) => {
    if (res.code === 200) {
      treeData.value = res.data.list
    }
  })
}

// 保存
const onSubmit = async() => {
  if (!currentDeptCode.value) {
    ElMessage.warning('请选择部门')
    return
  }
  // 先调用deptGet获取默认方案
  const defaultParams = {
    accessToken: store.userInfo?.accessToken,
    deptcode: dataRes.value.dept_code,
    entity_type: dataRes.value.entity_type
  }
  const defaultRes = await deptGet(defaultParams) as any
  if (defaultRes.code !== 200) {
    ElMessage.error('获取默认方案失败')
    return
  }

  // 使用deptGet的返回值构建保存参数
  const params = {
    accessToken: store.userInfo?.accessToken,
    deptcode: defaultRes.data.dept_code,
    // entity_type: defaultRes.data.entity_type,
    module_id: defaultRes.data.id,
    module_name: defaultRes.data.module_name,
    save_type: 0,
    basic_field: basicList.value,
    custom_field: customFieldList.value
  }
  const res = await deptSave(params) as any
  if (res.code === 200) {
    ElMessage.success('保存成功')
    // 保存成功后刷新数据
    if (currentDeptCode.value) {
      await getDefaultInfo(currentDeptCode.value)
    }
  }
}

const otherBt = () => {
  if (!currentDeptCode.value) {
    ElMessage.warning('请选择部门')
    return
  }
  otherPlanVisible.value = true
}

const selectBt = () => {
  if (!currentDeptCode.value) {
    ElMessage.warning('请选择部门')
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
  await getDefaultInfo(currentDeptCode.value)
}

// 选择方案成功后刷新当前部门的默认信息
const handlePlanSelected = async() => {
  if (currentDeptCode.value) {
    await getDefaultInfo(currentDeptCode.value)
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
  pidObj,
  currentDeptCode,
  modelId,
  dataRes,
  basicList,
  customFieldList
})

// 根据父组件传入的 active 和租户信息控制何时初始化（避免未点击标签时就请求接口）
const inited = ref(false)
watch(
  [() => props.active, () => storeC.tenantData],
  ([active, tenantData]) => {
    if (!active || inited.value || !tenantData || !tenantData.company_name) return
    const rootDept = {
      oort_dname: tenantData.company_name,
      oort_dcode: '',
      children: []
    }
    getSearchDept(rootDept)
    inited.value = true
  },
  { immediate: true, deep: true }
)
</script>
<style lang="scss" scoped>
.cmu_Page {
  width: 100%;
  height: 100%;

  .tenant_content {
    height: 100%;
    width: 100%;
  }

  .tableTenBox {
    width: 100%;
    height: 100%;
    flex: 1;
    background-color: #fff;
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

.body_box{
  padding-left: 20px;
  flex: 1;
  height: 100%;
  overflow: auto;
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

.tableTenIt {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
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

.passAuthBox {
  .pa_out {
    gap: 20px;
    padding-bottom: 40px;
  }

  .paTitle {
    font-size: 16px;
    color: #333;
    padding-bottom: 12px;
  }

  .paItem {
    width: 400px;
  }

  .passAuth {
    justify-content: space-between;
    border: 1px solid rgb(198 203 212 / 100%);
    border-radius: 2px;
    padding: 34px 16px;
  }

  .passAuthAcc {
    gap: 16px;
  }

  .passAuthPhoto {
    padding-top: 4px;
    font-size: 14px;
    color: #999;
  }

  .paImg {
    width: 40px;
    height: 40px;
  }
}

.tcBox {
  padding: 0 20px;

  :deep(.el-tabs__header) {
    padding-top: 0;
  }
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
  margin: 2px;
  background-color: var(--el-menu-hover-bg-color);
  color: var(--el-color-primary);
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

.detailsImg{
  width: 88px;
  height: 88px;
  border-radius: 50%;
  margin-right: 20px;
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

.person-name-sex{
  display: flex;
  flex-direction: column;
  .person-realname{
    color: #111827;
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0.2px;
  }
  .person-code{
    color: #718096;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.2px;
  }
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
</style>
