<template>
  <div class="visible-dept-dialog">
    <div class="change-dept-container">
      <!-- 左侧部门选择 -->
      <div class="dept-select-panel">
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入部门名"
            clearable
            prefix-icon="Search"
            @input="handleSearch"
          />
        </div>
        <div class="tree-container">
          <el-tree
            ref="treeRef"
            :data="treeData"
            :load="loadDeptTree"
            :props="defaultProps"
            lazy
            show-checkbox
            node-key="oort_dcode"
            :default-expanded-keys="['','99']"
            :check-strictly="true"
            @check="handleCheck"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <oort-img
                  :src="data?.oort_dept_photo"
                  style="width: 1rem;height:1rem;margin: 0 0.25rem;border-radius: 50%"
                  default-img="dept"
                />
                <span>{{ node.label }}</span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧已选部门 -->
      <div class="selected-dept-panel">
        <div class="panel-header">
          <div class="header-title">
            <span>拖曳可调整部门顺序</span>
          </div>
          <el-button text type="primary" @click="handleClear">
            清空
          </el-button>
        </div>
        <div class="selected-list">
          <div
            v-for="(item, index) in selectedDepts"
            :key="item.oort_dcode"
            class="selected-item"
            :class="{ dragging: draggingIndex === index }"
            @dragover="handleDragOver"
            @drop="handleDrop(index)"
          >
            <oort-img
              :src="item?.oort_dept_photo"
              style="width: 1rem;height:1rem;margin: 0 0.25rem;border-radius: 50%"
              default-img="dept"
            />
            <div class="item-content">
              <div class="item-name">
                {{ item.oort_dname }}
              </div>
              <div class="item-path">
                {{ item.path }}
              </div>
            </div>
            <div
              class="drag-handle"
              draggable="true"
              @dragstart="handleDragStart(index)"
              @dragend="handleDragEnd"
            >
              <oort-svg-icon
                color="#666"
                width="20"
                height="20"
                name="container1"
                class="container_svg"
              />
            </div>
            <el-icon class="remove-icon" @click="handleRemove(index)">
              <Close />
            </el-icon>
          </div>
          <div v-if="selectedDepts.length === 0" class="empty-tip">
            暂无已选部门
          </div>
        </div>
      </div>
    </div>
    <div class="subBtnsBox flexRowAC">
      <el-button @click="cancelSelect">
        取消
      </el-button>
      &nbsp;&nbsp;
      <el-button type="primary" @click="confirmSelect">
        确定
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { Close } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { useCounter } from '@/store/counter'
import { deptList } from '@/api/address_book'

const props = defineProps<{
  selectedDeptIds: string[]
  // 来自 visibleScopeDialog / getContactScope 的 *_depts_name 映射数据
  selectedDeptList: any[]
}>()

const emit = defineEmits<{
  confirm: [depts: any[]]
  cancel: []
}>()

const store: any = useUserStore()
const storeC: any = useCounter()
const treeRef = ref()
const searchKeyword = ref('')
const treeData = ref<any[]>([])
// 右侧已选部门列表（包含名称、路径等信息）
const selectedDepts = ref<any[]>([])
const innerSelectedDeptIds = ref<string[]>([])

// 部门信息缓存，用于计算部门路径（与 ChangeDeptDialog 保持一致）
const deptInfoMap = new Map<string, { name: string; parentId: string; code?: string }>()
const deptCodeMap = new Map<string, { name: string; parentId: string; id: string }>()

// 拖拽相关
const draggingIndex = ref<number | null>(null)
const dragIndex = ref<number | null>(null)

const defaultProps = {
  label: 'oort_dname',
  children: 'children',
  isLeaf: (data: any) => {
    return (data['hadchild'] === 0)
  }
}

// 统一的树展开调度（使用函数声明避免初始化顺序问题）
async function scheduleTreeExpand() {
  if (!treeRef.value) return
  await nextTick()
  await ensureSelectedTreeExpanded()
}

// 回显：根据传入的 ID 勾选树节点
watch(
  () => props.selectedDeptIds,
  (val) => {
    innerSelectedDeptIds.value = Array.isArray(val) ? [...val] : []
    nextTick(() => {
      if (treeRef.value) {
        treeRef.value.setCheckedKeys(innerSelectedDeptIds.value)
      }
    })
  },
  { immediate: true }
)

// 回显：根据 getContactScope 返回的 *_depts_name 数据初始化右侧已选部门
watch(
  () => props.selectedDeptList,
  async(val) => {
    const list = Array.isArray(val) ? val : []
    selectedDepts.value = list.map((item: any) => ({
      oort_dcode: item.oort_dcode || item.id,
      oort_dname: item.oort_dname || item.name,
      oort_dept_photo: item.oort_dept_photo || '',
      dept_code: item.dept_code,
      dept_code_path: item.dept_code_path,
      pdeptcode: item.pdeptcode,
      // 使用和 ChangeDeptDialog 相同的路径计算逻辑
      path: getDeptPath(item)
    }))
    innerSelectedDeptIds.value = selectedDepts.value.map((d) => d.oort_dcode)
    await scheduleTreeExpand()
  },
  { immediate: true }
)

onMounted(() => {
  initData()
})

// 根节点（使用函数声明，避免初始化顺序问题）
function getRootNode() {
  return {
    oort_dname: storeC.tenantData?.company_name || '全部',
    oort_dcode: '',
    pdeptcode: '',
    is_subdept: true,
    disabled: true // 禁用根节点选择
  }
}

const initData = async() => {
  searchKeyword.value = ''
  treeData.value = []

  const root = getRootNode()
  // 记录根节点信息，供路径计算使用
  recordDeptInfo(root)
  treeData.value = [root]
  expandRootNode()

  await nextTick()
  if (treeRef.value && innerSelectedDeptIds.value.length) {
    treeRef.value.setCheckedKeys(innerSelectedDeptIds.value)
    await scheduleTreeExpand()
  }
}

const expandRootNode = () => {
  nextTick(() => {
    const rootNode = treeRef.value?.store?.root?.childNodes?.[0]
    if (rootNode && !rootNode.expanded) {
      rootNode.expanded = true
      rootNode.loadData?.()
    }
  })
}

// 加载部门树子节点
const loadDeptTree = (node: Node, resolve: (data: any[]) => void) => {
  const params: any = {
    accessToken: store.userInfo.accessToken,
    page: 1,
    pagesize: 99,
    isdel: 1
  }

  if (node.level === 0) {
    const root = getRootNode()
    recordDeptInfo(root)
    return resolve([root])
  }

  params.pdeptcode = node.data.oort_dcode
  if (searchKeyword.value) {
    params.keyword = searchKeyword.value
  }

  deptList(params).then((res: any) => {
    if (res.code === 200) {
      const list = res.data.list || []
      // 缓存部门信息（包含 code、parentId），供路径计算使用
      list.forEach(recordDeptInfo)
      resolve(list)
    } else {
      resolve([])
    }
  })
}

// 搜索
const handleSearch = async() => {
  if (!searchKeyword.value) {
    treeData.value = [getRootNode()]
    expandRootNode()
    await nextTick()
    if (treeRef.value) {
      treeRef.value.setCheckedKeys(innerSelectedDeptIds.value)
      await scheduleTreeExpand()
    }
    return
  }

  const params: any = {
    accessToken: store.userInfo.accessToken,
    page: 1,
    pagesize: 99,
    isdel: 1,
    keyword: searchKeyword.value
  }
  const res: any = await deptList(params)
  const list = res?.code === 200 ? res.data?.list || [] : []
  list.forEach(recordDeptInfo)
  treeData.value = list
  expandRootNode()
  await nextTick()
  if (treeRef.value) {
    treeRef.value.setCheckedKeys(innerSelectedDeptIds.value)
    await scheduleTreeExpand()
  }
}

// 复选框变化：根据树选中节点更新右侧列表
const handleCheck = () => {
  if (!treeRef.value) return

  const checkedNodes = treeRef.value.getCheckedNodes(false, true)
  const checkedKeys = treeRef.value.getCheckedKeys(false)

  const existingMap = new Map(selectedDepts.value.map(item => [item.oort_dcode, item]))
  // 记录选中节点信息并确保路径依赖的缓存
  checkedNodes.forEach(recordDeptInfo)
  const newSelected: any[] = checkedNodes.map((node: any) => ({
    oort_dcode: node.oort_dcode,
    oort_dname: node.oort_dname,
    oort_dept_photo: node.oort_dept_photo,
    dept_code: node.dept_code,
    dept_code_path: node.dept_code_path,
    pdeptcode: node.pdeptcode,
    // 使用统一的路径算法
    path: getDeptPath(node)
  }))

  const result: any[] = []

  // 保留仍然勾选的旧项顺序
  selectedDepts.value.forEach(item => {
    if (checkedKeys.includes(item.oort_dcode)) {
      result.push(item)
    }
  })

  // 追加新勾选的项
  newSelected.forEach(item => {
    if (!existingMap.has(item.oort_dcode)) {
      result.push(item)
    }
  })

  selectedDepts.value = result
  innerSelectedDeptIds.value = selectedDepts.value.map(item => item.oort_dcode)
}

// ================== 路径计算逻辑（与 ChangeDeptDialog 保持一致） ==================

// 获取部门路径：顶级公司 + 层级名称（参考 ChangeDeptDialog，增加对 dept_name_path 的兜底）
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

function dedupeSequential(segments: string[]): string[] {
  return segments.filter((name, index) => index === 0 || name !== segments[index - 1])
}

// 展开当前已选部门所在的树路径（模仿 ChangeDeptDialog）
async function ensureSelectedTreeExpanded() {
  for (const dept of selectedDepts.value) {
    await expandDeptPath(dept)
  }
}

async function expandDeptPath(dept: any) {
  if (!dept) return
  const codePath = (dept.dept_code_path || '').split('/').filter(Boolean)
  if (codePath.length) {
    const success = await expandBySegments(codePath, (children, key) =>
      children.find((item: any) => item.dept_code === key)
    )
    if (success) return
  }

  const rootName = getRootNode().oort_dname
  const namePath = (dept.path || dept.dept_name_path || '').split('/').filter(Boolean)
  const nameSegments = [...namePath]
  if (rootName && nameSegments.length && nameSegments[0] === rootName) {
    nameSegments.shift()
  }
  if (dept.oort_dname) {
    const last = nameSegments[nameSegments.length - 1]
    if (last !== dept.oort_dname) {
      nameSegments.push(dept.oort_dname)
    }
  }

  await expandBySegments(nameSegments, (children, key) =>
    children.find((item: any) => item.oort_dname === key)
  )
}

async function expandBySegments(
  segments: string[],
  matcher: (children: any[], key: string) => any
) {
  if (!segments.length) return false
  let parentId = ''
  for (const segment of segments) {
    const child = await ensureChild(parentId, segment, matcher)
    if (!child) return false
    parentId = child.oort_dcode || ''
    await expandNode(parentId)
  }
  if (parentId) {
    treeRef.value?.setCurrentKey(parentId)
  }
  return true
}

async function ensureChild(parentId: string, key: string, matcher: (children: any[], key: string) => any) {
  const children = await loadChildren(parentId)
  return matcher(children, key)
}

async function loadChildren(parentId: string) {
  if (!treeData.value.length) {
    const root = getRootNode()
    treeData.value = [root]
  }
  const parentNodeData = parentId === '' ? treeData.value[0] : findNodeData(treeData.value, parentId)
  if (parentNodeData?.children?.length) {
    return parentNodeData.children
  }

  const params: any = {
    accessToken: store.userInfo.accessToken,
    page: 1,
    pagesize: 99,
    isdel: 1,
    pdeptcode: parentId
  }
  const res: any = await deptList(params)
  const list = res?.code === 200 ? res.data?.list || [] : []
  list.forEach(recordDeptInfo)

  if (parentId === '') {
    if (treeData.value[0]) {
      treeData.value[0].children = list
    }
  } else if (parentNodeData) {
    parentNodeData.children = list
  }

  if (treeRef.value) {
    try {
      const key = parentId ?? ''
      treeRef.value.updateKeyChildren(key, list)
    } catch (error) {
      // ignore
    }
  }

  await nextTick()
  return list
}

function findNodeData(nodes: any[], id: string): any | null {
  for (const node of nodes) {
    if ((node.oort_dcode ?? '') === id) {
      return node
    }
    if (node.children?.length) {
      const found = findNodeData(node.children, id)
      if (found) return found
    }
  }
  return null
}

async function expandNode(deptId: string) {
  if (!deptId) return
  await nextTick()
  const node = treeRef.value?.getNode(deptId)
  if (node && !node.expanded) {
    node.expand?.(false, false)
    node.expanded = true
    node.loadData?.()
  } else if (node && node.expanded && !node.childNodes?.length) {
    node.loadData?.()
  }
}

// 拖拽开始
const handleDragStart = (index: number) => {
  dragIndex.value = index
  draggingIndex.value = index
}

// 拖拽结束
const handleDragEnd = () => {
  draggingIndex.value = null
}

// 拖拽覆盖
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

// 拖拽放置
const handleDrop = (dropIndex: number) => {
  if (dragIndex.value === null || dragIndex.value === dropIndex) {
    dragIndex.value = null
    draggingIndex.value = null
    return
  }

  const [moved] = selectedDepts.value.splice(dragIndex.value, 1)
  selectedDepts.value.splice(dropIndex, 0, moved)
  dragIndex.value = null
  draggingIndex.value = null
}

// 移除部门
const handleRemove = (index: number) => {
  const removed = selectedDepts.value[index]
  selectedDepts.value.splice(index, 1)
  innerSelectedDeptIds.value = selectedDepts.value.map(item => item.oort_dcode)
  if (treeRef.value) {
    treeRef.value.setChecked(removed.oort_dcode, false, true)
  }
}

// 清空
const handleClear = () => {
  selectedDepts.value = []
  innerSelectedDeptIds.value = []
  if (treeRef.value) {
    treeRef.value.setCheckedKeys([])
  }
}

// 暴露确认/取消给父级
const confirmSelect = () => {
  emit('confirm', selectedDepts.value)
}

const cancelSelect = () => {
  emit('cancel')
}

defineExpose({
  confirmSelect,
  cancelSelect
})
</script>

<style scoped lang="scss">
.change-dept-container {
  display: flex;
  gap: 20px;
  height: 500px;
}

.dept-select-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e7eaef;
  border-radius: 8px;
  overflow: hidden;

  .search-box {
    padding: 12px;
    border-bottom: 1px solid #e7eaef;
  }

  .tree-container {
    flex: 1;
    overflow-y: auto;
    padding: 8px;

    :deep(.el-tree-node__content) {
      height: 38px;
      font-size: 14px;
    }

    .custom-tree-node {
      display: flex;
      align-items: center;
      flex: 1;
    }
  }
}

.selected-dept-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e7eaef;
  border-radius: 8px;
  overflow: hidden;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #e7eaef;

    .header-title {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: #333;
    }
  }

  .selected-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;

    .selected-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      margin-bottom: 8px;
      background: #f8f8f9;
      border-radius: 4px;
      cursor: default;
      transition: all 0.2s;

      &.dragging {
        opacity: 0.5;
      }

      &:hover {
        background: #f0f0f0;
      }

      .drag-handle {
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;

        .container_svg {
          cursor: move;
        }
      }

      .item-content {
        flex: 1;
        min-width: 0;

        .item-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }

        .item-path {
          font-size: 12px;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .remove-icon {
        cursor: pointer;
        color: #999;
        transition: color 0.2s;

        &:hover {
          color: #f56c6c;
        }
      }
    }

    .empty-tip {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      color: #999;
      font-size: 14px;
    }
  }
}

.subBtnsBox {
  height: 60px;
  width: 98%;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
