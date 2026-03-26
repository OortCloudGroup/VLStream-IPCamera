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
        <!--角色tree-->
        <div v-yResize class="police_aside">
          <div class="treeTitle">
            角色列表
          </div>
          <div class="tree_search_content flexRowAC">
            <el-input
              v-model="searchRoleName"
              suffix-icon="el-icon-search"
              placeholder="搜索角色"
              debounce="300"
              @change="getSearchRole"
            />
          </div>
          <el-tree
            style="background: #fff;"
            :data="treeData"
            highlight-current
            node-key="ruuid"
            :props="defaultProps"
            @node-click="roleClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node flexRowAC">
                <img
                  v-if="data.role_photo"
                  style="width: 1rem;height:1rem;margin: 0 0.25rem;border-radius: 50%"
                  :src="data.role_photo"
                  alt=""
                />
                <img v-else style="width: 1rem;margin: 0 0.25rem" src="@/assets/img/dept_default.png" alt="" />
                <el-tooltip :open-delay="500" class="item" effect="light" :content="node.label" placement="top">
                  <div :class="{'activeRole': data.ruuid === currentRoleCode}">
                    {{ node.label }}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-tree>
        </div>
        <!--设置区域-->
        <div class="body_box">
          <InfoSetting
            :data="dataRes"
            :basic-list="basicList"
            :custom-field-list="customFieldList"
            @update-basic-list="handleUpdateBasicList"
            @update-custom-fields="handleUpdateCustomFields"
          />
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
import { roleList } from '@/api/unifiedUsert/apaasAuth'
import { roleGet, roleSave } from '@/api/address_book/index'
import InfoSetting from './InfoSetting.vue'
import { ElMessage } from 'element-plus'
import otherPlanDia from '@/pages/address_book/views/page/setting/component/otherPlanDia.vue'
import selectPlanDia from '@/pages/address_book/views/page/setting/component/selectPlanDia.vue'
import editPlanDia from '@/pages/address_book/views/page/setting/component/editPlanDia.vue'

const props = defineProps<{
  active?: boolean
}>()

const store: any = useUserStore()
const searchRoleName = ref<any>('') // 搜索角色
const treeData = ref<any>([]) // 角色树data
const currentRoleCode = ref<any>('') // 当前角色code
const currentRoleObj = ref<any>({}) // 当前选中的角色信息
let otherPlanVisible = ref<boolean>(false)
let selectPlanVisible = ref<boolean>(false)
let editPlanVisible = ref<boolean>(false)
let editSchemeItem = ref<any>({})
const dataRes = ref()
let basicList = ref()
let customFieldList = ref()

// 配置选项
const defaultProps = {
  label: 'name',
  children: 'children'
}

// 角色树选中
const roleClick = (data: any) => {
  currentRoleCode.value = data.ruuid
  currentRoleObj.value = data // 保存当前选中的角色信息
  getDefaultInfo(data.ruuid)
}

// 角色树搜索
const getSearchRole = async() => {
  const params = {
    accessToken: store.userInfo.accessToken,
    page: 1,
    pagesize: 999
  }

  if (searchRoleName.value) {
    params['keyword'] = searchRoleName.value
  }

  const res: any = await roleList(params)
  if (res.code === 200) {
    treeData.value = res.data.list || []
    // 默认选中第一个角色
    if (treeData.value.length > 0 && !currentRoleCode.value) {
      roleClick(treeData.value[0])
    }
  }
}

// 设置
const getDefaultInfo = async(roleId: string) => {
  if (!roleId) return

  const params = {
    accessToken: store.userInfo?.accessToken,
    ruuid: roleId
    // entity_type: 30
  }
  const res = await roleGet(params) as any
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

// 保存
const onSubmit = async() => {
  // 先调用roleGet获取默认方案
  const defaultParams = {
    accessToken: store.userInfo?.accessToken,
    ruuid: dataRes.value.ruuid,
    entity_type: dataRes.value.entity_type
  }
  const defaultRes = await roleGet(defaultParams) as any
  if (defaultRes.code !== 200) {
    ElMessage.error('获取默认方案失败')
    return
  }

  // 使用roleGet的返回值构建保存参数
  const params = {
    accessToken: store.userInfo?.accessToken,
    ruuid: defaultRes.data.ruuid,
    entity_type: defaultRes.data.entity_type,
    module_id: defaultRes.data.id,
    module_name: defaultRes.data.module_name,
    save_type: 0,
    basic_field: basicList.value,
    custom_field: customFieldList.value
  }
  const res = await roleSave(params) as any
  if (res.code === 200) {
    ElMessage.success('保存成功')
    // 保存成功后刷新数据
    if (currentRoleCode.value) {
      await getDefaultInfo(currentRoleCode.value)
    }
  }
}

const otherBt = () => {
  otherPlanVisible.value = true
}

const selectBt = () => {
  selectPlanVisible.value = true
}

// 处理编辑方案事件
const handleEditScheme = (item: any) => {
  editSchemeItem.value = item
  editPlanVisible.value = true
}

// 处理编辑完成后的刷新
const handleEditRefresh = async() => {
  await getDefaultInfo(currentRoleCode.value)
}

// 选择方案成功后刷新当前角色的默认信息
const handlePlanSelected = async() => {
  if (currentRoleCode.value) {
    await getDefaultInfo(currentRoleCode.value)
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
  currentRoleObj,
  currentRoleCode,
  modelId,
  dataRes,
  basicList,
  customFieldList
})

// 根据父组件传入的 active 控制何时初始化（避免未点击标签时就请求接口）
const inited = ref(false)
watch(
  () => props.active,
  (val) => {
    if (val && !inited.value) {
      inited.value = true
      getSearchRole()
    }
  },
  { immediate: true }
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

// 角色树
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
}

.custom-tree-node {
  .activeRole {
    color: var(--el-color-primary);
    font-weight: 500;
  }
}

// 角色树标题
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

// 部门树标题 -> 角色树标题
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

// 启用禁用
.riskBtns {
  &.gr {
    font-size: 14px;
    color: #52C41A;
    padding-left: 12px;
    position: relative;
  }

  &.gr::before {
    content: "";
    display: flex;
    position: absolute;
    top: 6px;
    left: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #52C41A;
  }

  &.gra {
    font-size: 14px;
    color: #999;
    padding-left: 12px;
    position: relative;
  }

  &.gra::before {
    content: "";
    display: flex;
    position: absolute;
    top: 6px;
    left: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #999;
  }

  &.yel {
    font-size: 14px;
    color: #FF8823;
    padding-left: 12px;
    position: relative;
  }

  &.yel::before {
    content: "";
    display: flex;
    position: absolute;
    top: 6px;
    left: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #FF8823;
  }
}

</style>
