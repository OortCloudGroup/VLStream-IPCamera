<template>
  <div class="case-library">
    <!-- <div class="header">
      <h1>案例库</h1>
    </div> -->

    <div class="search-bar">
      <div class="left">
        <!-- <span>选择日期</span> -->
        <el-date-picker
          v-model="createTime"
          type="date"
          placeholder="选择日期"
        />
        <el-input
          v-model="caseName"
          placeholder="搜索案例名称"
          class="search-input"
        >
          <template #suffix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-input
          v-model="createBy"
          placeholder="搜索作者"
          class="search-input"
        >
          <template #suffix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button type="primary" @click="handleSearch">
          查询
        </el-button>
        <el-button @click="handleReset">
          重置
        </el-button>
      </div>
      <div class="right">
        <el-button type="success" @click="handleAdd">
          + 新建案例
        </el-button>
      </div>
    </div>

    <div class="content">
      <div class="case-types">
        <h3>案例类型</h3>
        <ul>
          <li
            v-for="type in caseTypes"
            :key="type.id"
            :class="{ active: selectedType === type.categoryType }"
            @click="handleTypeSelect(type.categoryType)"
          >
            {{ type.categoryName }}
          </li>
        </ul>
      </div>

      <div class="case-list">
        <el-table v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="caseName" label="案例名称" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="createBy" label="作者" />
          <el-table-column prop="orgName" label="所属组织" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleView(scope.row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 案例详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="案例详情"
      width="800px"
      destroy-on-close
    >
      <div v-loading="detailLoading" class="case-detail">
        <div class="detail-section">
          <h3>案例名称</h3>
          <div class="detail-content">
            {{ caseDetail.caseName }}
          </div>
        </div>

        <div class="detail-section">
          <h3>案例类别</h3>
          <div class="detail-content">
            {{ caseTypes.find(type => type.categoryType === caseDetail.caseType)?.categoryName || '' }}
          </div>
        </div>

        <div class="detail-section">
          <h3>案例描述</h3>
          <div class="detail-content description">
            {{ caseDetail.caseDescription }}
          </div>
        </div>

        <div class="detail-section">
          <h3>关联谈话记录</h3>
          <div class="detail-content">
            <div v-if="caseDetail.talkRecordId" class="talk-record flexRowAC">
              <span
                v-for="(item,i) in caseDetail.talkRecordName.split(',')"
                :key="i"
                class="sp"
                @click="rVisi=true,rVisiId=caseDetail.talkRecordId.split(',')[i]"
              >
                {{ item }}
              </span>
            </div>
            <div v-else>
              暂无关联谈话记录
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3>附件</h3>
          <div class="detail-content">
            <div v-if="caseDetail.attachmentPath" class="attachment">
              <div class="file-info">
                <span class="file-name">{{ getFileName(caseDetail.fileName) }}</span>
              </div>
              <div class="file-actions">
                <el-button type="primary" link @click="handlePreview(caseDetail.attachmentPath)">
                  预览
                </el-button>
                <el-button type="primary" link @click="handleDownload(caseDetail.attachmentPath)">
                  下载
                </el-button>
              </div>
            </div>
            <div v-else>
              暂无附件
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dVisi"
      title="新建案例"
      width="40%"
      :close-on-click-modal="false"
    >
      <case-new v-if="dVisi" :list="caseTypes" @handle="fetchCaseList" @close="dVisi=false" />
    </el-dialog>
    <el-dialog
      v-model="rVisi"
      title="谈话记录详情"
      width="1000px"
      :close-on-click-modal="false"
    >
      <case-record-details v-if="rVisi&&rVisiId" :id="rVisiId" @close="rVisi=false" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { CaseType, CaseItem, CaseRecordDTO } from '@/pages/mobileeducationplatform/types/caseRecord'
import { getCaseList, getCaseById, getCaseTypes } from '@/api/mobileeducationplatform/case'
import { useUserStore } from '@/store/modules/user'
import CaseNew from '@/pages/mobileeducationplatform/views/page/message/caseRecord/caseNew.vue'
import CaseRecordDetails from '@/pages/mobileeducationplatform/views/page/message/caseRecord/caseRecordDetails.vue'
import config from '@/config'

const store = useUserStore()
const createTime = ref<Date | null>(null)
const caseName = ref('')
const createBy = ref('')
const selectedType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
let dVisi = ref(false) // 新建案例
let rVisi = ref(false) // 谈话记录详情
let rVisiId = ref('') // 谈话记录详情 id

const caseTypes = ref<CaseType[]>([])

const fetchCaseTypes = async() => {
  try {
    const res = await getCaseTypes('2000')
    if (res.code === 200) {
      caseTypes.value = res.data
      if (res.data.length > 0) {
        const firstValidType = res.data.find(type => type.categoryType !== null)
        if (firstValidType) {
          selectedType.value = firstValidType.categoryType
          fetchCaseList()
        }
      }
    } else {
      ElMessage.error('获取案例类型失败')
    }
  } catch (error) {
    ElMessage.error('获取案例类型失败')
  }
}

const tableData = ref<CaseItem[]>([])
// 查询案例列表
const fetchCaseList = async() => {
  try {
    loading.value = true
    const params: CaseRecordDTO = {
      orgId: store.userInfo?.oort_depcode || '',
      createTime: createTime.value ? new Date(createTime.value.getTime() - createTime.value.getTimezoneOffset() * 60000).toISOString().replace('T', ' ').substring(0, 19) : null,
      caseType: selectedType.value,
      caseName: caseName.value,
      createBy: createBy.value,
      current: currentPage.value,
      size: pageSize.value
    }
    const res = await getCaseList(params)
    if (res.code === 200) {
      tableData.value = res.data.records
      total.value = res.data.total
    } else {
      ElMessage.error('获取案例列表失败')
    }
  } catch (error) {
    ElMessage.error('获取案例列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchCaseList()
}

const handleReset = () => {
  createTime.value = null
  caseName.value = ''
  createBy.value = ''
  currentPage.value = 1
  fetchCaseList()
}

const handleAdd = () => {
  dVisi.value = true
}

const handleTypeSelect = (typeValue: string) => {
  selectedType.value = typeValue
  currentPage.value = 1
  fetchCaseList()
}

// 案例详情相关
const dialogVisible = ref(false)
const detailLoading = ref(false)
const caseDetail = ref<CaseRecordDTO>({
  id: '',
  caseName: '',
  createTime: new Date(),
  caseType: '',
  caseDescription: '',
  talkRecordId: '',
  talkRecordName: '',
  createBy: '',
  fileName: '',
  attachmentPath: ''
})

const handleView = async(row: CaseItem) => {
  try {
    dialogVisible.value = true
    detailLoading.value = true
    const res = await getCaseById(row.id)
    if (res.code === 200) {
      caseDetail.value = res.data
      selectedType.value = res.data.caseType
    } else {
      ElMessage.error('获取案例详情失败')
    }
  } catch (error) {
    ElMessage.error('获取案例详情失败')
  } finally {
    detailLoading.value = false
  }
}

const getFileName = (url: string) => {
  if (!url) return ''
  const parts = url.split('/')
  return parts[parts.length - 1]
}

// 文件预览
const handlePreview = (filePath: string) => {
  if (filePath) {
    // 使用完整的文件路径进行预览
    let imageSrc
    if (filePath.includes('http')) {
      let arr = filePath.split('/oortwj1/')
      if (arr.length === 2) {
        imageSrc = config.URL + config.gateWay + 'oortwj1/' + arr[1]
      }
    } else {
      imageSrc = filePath
    }
    let W = '?'
    if (filePath.includes('?')) W = '&'
    let appendStr = '&applyid=' + config.headers.applyID + '&appID=' + config.headers.appID + '&secretKey=' + config.headers.secretKey + '&requestType=' + config.headers.requestType

    let openUrl = imageSrc + W + 'accessToken=' + store.userInfo?.accessToken + appendStr + '&requestType=app'

    let previewURL = config.URL + config.gateWay + 'oortcloud-fileview' + '/onlinePreview?url=' + encodeURIComponent(btoa(encodeURI(openUrl))) + '&accessToken=' + store.userInfo?.accessToken + appendStr
    window.open(previewURL, '预览', 'autoHideMenuBar=true,icon=""')
  } else {
    ElMessage.warning('文件路径不存在')
  }
}

const handleDownload = (filePath: string) => {
  if (filePath) {
    const link = document.createElement('a')
    link.href = filePath
    link.download = getFileName(filePath)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    ElMessage.warning('文件路径不存在')
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchCaseList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchCaseList()
}

onMounted(() => {
  fetchCaseTypes()
})
</script>

<style scoped>
.case-library {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 300px;
}

.content {
  display: flex;
  gap: 20px;
}

.case-types {
  width: 200px;
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
}

.case-types ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.case-types li {
  padding: 12px 16px;
  cursor: pointer;
  margin: 4px 0;
  border-radius: 4px;
  color: #606266;
}

.case-types li:hover {
  background: #ecf5ff;
}

.case-types li.active {
  background: #409eff;
  color: white;
}

.case-types h3 {
  font-size: 16px;
  color: #606266;
  margin-bottom: 12px;
}

.case-list {
  flex: 1;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.case-detail {
  padding: 20px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 16px;
  color: #606266;
  margin-bottom: 12px;
}

.detail-content {
  color: #303133;
  line-height: 1.5;
}

.detail-content.description {
  white-space: pre-wrap;
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  min-height: 100px;
}

.talk-record {
  color: #409eff;
  cursor: pointer;
  gap: 8px;

  .sp{

    border-radius: 4px;
    padding: 2px 10px;
    background-color: rgba(64, 158, 255, .1);
  }
}

.attachment {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-info {
  margin-bottom: 8px;
}

.file-name {
  color: #606266;
  word-break: break-all;
}

.file-actions {
  display: flex;
  gap: 16px;
}

.dialog-footer {
  text-align: right;
}

.preview-container {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 500px;
  overflow: auto;
}
</style>
