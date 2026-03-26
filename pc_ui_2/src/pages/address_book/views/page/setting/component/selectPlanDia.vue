<template>
  <div>
    <el-dialog v-model="dialogVisible" top="5vh" title="选择方案" width="55%" :close-on-click-modal="false">
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
                <div class="scheme-title-wrapper">
                  <span class="scheme-title" @click.stop="handleEditScheme(item)">{{ item.module_name }}</span>
                </div>
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
          <el-button @click="handleCancel">
            取消
          </el-button>
          <el-button type="primary" @click="confirmScheme">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 编辑方案弹窗 -->
    <other-plan-dia
      v-model:visible="editPlanVisible"
      :data-res="editSchemeData"
      :basic-list="editBasicList"
      :custom-field-list="editCustomFieldList"
      :is-edit="true"
      @success="handleEditSuccess"
    />
    <!-- 查看方案弹窗 -->
    <view-plan-dia
      v-model:visible="viewPlanVisible"
      :scheme-item="viewSchemeItem"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { list, select, deleteBoard } from '@/api/address_book/index'
import otherPlanDia from './otherPlanDia.vue'
import viewPlanDia from './viewPlanDia.vue'

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
  }
})

const emit = defineEmits(['update:visible', 'edit-scheme', 'selected'])

const store = useUserStore()

// 计算属性来控制弹窗显示
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})
// 方案列表
const schemeList = ref<any[]>([])
// 我的方案列表
const mySchemeList = ref<any[]>([])
// 公有方案列表
const publicSchemeList = ref<any[]>([])
const selectedScheme = ref('')
// 我的方案分页
const myPage = ref(1)
const myPageSize = ref(20)
const myTotal = ref(0)
// 公有方案分页
const publicPage = ref(1)
const publicPageSize = ref(20)
const publicTotal = ref(0)
// 编辑方案相关
const editPlanVisible = ref(false)
const editSchemeData = ref<any>({})
const editBasicList = ref<any[]>([])
const editCustomFieldList = ref<any[]>([])

// 查看方案相关（公有方案查看）
const viewPlanVisible = ref(false)
const viewSchemeItem = ref<any>({})

// 监听弹窗显示状态，自动加载方案列表
watch(() => props.visible, async(newVal) => {
  if (newVal && props.dataRes?.dept_code || props.dataRes?.ruuid || props.dataRes?.oort_uuid) {
    await loadSchemeList()
  }
})

// 加载方案列表
const loadSchemeList = async() => {
  const baseParams = {
    accessToken: store.userInfo?.accessToken,
    entity_id: props.dataRes?.dept_code || props.dataRes?.ruuid || props.dataRes?.oort_uuid || '',
    entity_type: props.dataRes?.entity_type || 20
  }

  // 获取我的方案
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
    const defaultScheme = mySchemeList.value.find((s: any) => s.is_default === 1)
    if (defaultScheme) {
      selectedScheme.value = defaultScheme.id
    } else if (mySchemeList.value.length > 0) {
      selectedScheme.value = mySchemeList.value[0].id
    }
  }

  // 获取公有方案（get_all = 1）
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
      const defaultPublicScheme = publicSchemeList.value.find((s: any) => s.is_default === 1)
      if (defaultPublicScheme) {
        selectedScheme.value = defaultPublicScheme.id
      } else {
        selectedScheme.value = publicSchemeList.value[0].id
      }
    }
  }

  schemeList.value = [...mySchemeList.value, ...publicSchemeList.value]
}

// 我的方案分页
const handleMySizeChange = async(val: number) => {
  myPageSize.value = val
  myPage.value = 1
  await loadSchemeList()
}

const handleMyCurrentChange = async(val: number) => {
  myPage.value = val
  await loadSchemeList()
}

// 公有方案分页
const handlePublicSizeChange = async(val: number) => {
  publicPageSize.value = val
  publicPage.value = 1
  await loadSchemeList()
}

const handlePublicCurrentChange = async(val: number) => {
  publicPage.value = val
  await loadSchemeList()
}

// 方案选择
function selectScheme(id: string) {
  selectedScheme.value = id
}

// 编辑方案（点击编辑图标）
const editScheme = (item: any) => {
  // 触发编辑事件，传递方案数据
  emit('edit-scheme', item)
}

// 查看方案（公有方案查看）
const viewScheme = (item: any) => {
  viewSchemeItem.value = item
  viewPlanVisible.value = true
}

// 点击方案名称或描述打开编辑弹窗
const handleEditScheme = (item: any) => {
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
  editBasicList.value = []
  editCustomFieldList.value = []
  editPlanVisible.value = true
}

// 编辑成功回调
const handleEditSuccess = async() => {
  // 重新加载方案列表
  await loadSchemeList()
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
    await loadSchemeList()
    // 如果删除的是当前选中的方案，需要重新选择
    if (selectedScheme.value === item.id) {
      const firstScheme = mySchemeList.value.length > 0 ? mySchemeList.value[0] : (publicSchemeList.value.length > 0 ? publicSchemeList.value[0] : null)
      if (firstScheme) {
        selectedScheme.value = firstScheme.id
      }
    }
  }
}

// 确定方案
const confirmScheme = async() => {
  if (!selectedScheme.value) {
    ElMessage.warning('请选择一个方案')
    return
  }

  const selected = schemeList.value.find((s: any) => s.id === selectedScheme.value)
  if (!selected) {
    ElMessage.error('选中的方案不存在')
    return
  }
  const params = {
    accessToken: store.userInfo?.accessToken,
    entity_id: props.dataRes?.dept_code || props.dataRes?.ruuid || props.dataRes?.oort_uuid || '',
    entity_type: props.dataRes?.entity_type,
    module_id: selected.id
  }
  const res = await select(params) as any
  if (res.code === 200) {
    ElMessage.success('选择方案成功')
    emit('selected', selected)
    dialogVisible.value = false
  }
}

// 取消操作
const handleCancel = () => {
  selectedScheme.value = ''
  dialogVisible.value = false
}

</script>

<style scoped lang="scss">
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
      background-color: var(--el-color-primary-light-9);
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
      img {
        width: 14px;
      }
      span {
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
  gap: 12px;
  margin-top: 20px;
}
</style>
