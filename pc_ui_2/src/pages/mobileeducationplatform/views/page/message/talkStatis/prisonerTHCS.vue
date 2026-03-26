<template>
  <div class="memcon-container">
    <div class="main-content">
      <!-- 右侧内容区 -->
      <div class="content-area">
        <div class="filter-bar">
          <div class="filter-item">
            <span class="filter-label">组织：</span>
            <el-tree-select
              v-model="filters.dept_name"
              style="width: 210px"
              :data="departmentOptions"
              :props="{
                label: 'label',
                value: 'name',
                children: 'children'
              }"
              placeholder="请选择组织"
              check-strictly
              lazy
              :load="loadChildren"
              @node-click="handleNodeClick"
            />
          </div>
          <!-- <div class="filter-item">
              <span class="filter-label">谈话状态：</span>
              <el-select v-model="filters.status" placeholder="谈话状态" style="width: 210px">
                <el-option label="全部" value="" />
                <el-option label="待谈话" :value="1" />
                <el-option label="谈话中" :value="2" />
                <el-option label="已逾期" :value="3" />
                <el-option label="已谈话" :value="4" />
              </el-select>
            </div> -->
          <!-- <div class="filter-item">
              <span class="filter-label">谈话类型：</span>
              <el-select v-model="filters.talkType" placeholder="谈话类型" style="width: 210px">
                <el-option label="全部" value="" />
                <el-option
                  v-for="type in talkTypes"
                  :key="type.categoryType"
                  :label="type.categoryName"
                  :value="type.categoryType"
                />
              </el-select>
            </div> -->
          <!-- <div class="filter-item">
              <span class="filter-label">罪犯类型：</span>
              <el-select v-model="filters.prisonerType" placeholder="罪犯类型" style="width: 210px">
                <el-option label="全部" value="" />
                <el-option
                  v-for="type in prisonerTypes"
                  :key="type.categoryType"
                  :label="type.categoryName"
                  :value="type.categoryType"
                />
              </el-select>
            </div> -->
          <div class="filter-item">
            <span class="filter-label">罪犯姓名：</span>
            <el-input v-model="filters.prisonerName" placeholder="例:李四" style="width: 150px" />
          </div>
          <div class="filter-item">
            <span class="filter-label">日期范围：</span>
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </div>
          <el-button type="primary" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
          <el-button @click="handleExport">
            导出
          </el-button>
          <!-- <div class="search-group">
              <div class="filter-item">
                <span class="filter-label">罪犯姓名：</span>
                <el-input v-model="filters.prisonerName" placeholder="例:李四" style="width: 150px" />
              </div>
              <div class="filter-item">
                <span class="filter-label">主管民警：</span>
                <el-input v-model="filters.policeName" placeholder="例:张三" style="width: 150px" />
              </div>
              <div class="filter-item">
                <span class="filter-label">主管民警编码：</span>
                <el-input v-model="filters.policeNo" placeholder="例:LJ999999" style="width: 150px" />
              </div>
              <el-button type="primary" @click="handleSearch">
                查询
              </el-button>
              <el-button @click="handleReset">
                重置
              </el-button>
              <el-button @click="handleExport">
                导出
              </el-button>
            </div> -->
        </div>

        <!-- 表格区域 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="100" align="center" />
          <!-- <el-table-column prop="departmentName" label="部门名称" align="center" /> -->
          <!-- <el-table-column prop="policeCode" label="民警编码" align="center" /> -->
          <el-table-column prop="prisonerName" label="罪犯名称" align="center" />
          <el-table-column prop="prisonerType" label="罪犯类型" align="center" />
          <!-- <el-table-column prop="talkCategory" label="谈话类型" align="center" /> -->
          <!-- <el-table-column prop="prisonerCount" label="谈话人数" align="center" /> -->
          <el-table-column prop="requiredTalks" label="应谈次数" align="center" />
          <!-- <el-table-column prop="scheduledTalks" label="应谈数量" align="center" /> -->
          <!-- <el-table-column prop="pendingTalks" label="待谈次数" align="center" /> -->
          <el-table-column prop="completedTalks" label="已谈次数" align="center" />
          <!-- <el-table-column prop="talkCount" label="谈话次数" align="center" /> -->
          <!-- <el-table-column prop="totalDuration" label="总时长(分钟)" align="center" /> -->
          <!-- <el-table-column prop="avgDuration" label="平均时长(分钟)" align="center" /> -->
          <!-- <el-table-column prop="conversationCoverage" label="谈话覆盖率" align="center">
              <template #default="{ row }">
                <span>{{ (row.conversationCoverage * 100).toFixed(2) }}%</span>
              </template> -->
          <!-- </el-table-column> -->
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            :current-page="pagination.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { deptList, getPrisonerTalkCountStatisticsByDepartment } from '@/api/mobileeducationplatform/case'
const store = useUserStore()

const filters = reactive({
  oortDepcode: store.userInfo?.oort_depcode || '',
  talkCategory: '',
  prisonerType: '',
  prisonerName: '',
  prisonerNo: '',
  policeName: '',
  policeNo: '',
  dateRange: []
})

const tableData = ref([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const getList = async() => {
  const params = {
    accessToken: store.token || '',
    oortDepcode: filters.oortDepcode,
    talkCategory: filters.talkCategory,
    prisonerType: filters.prisonerType,
    prisonerName: filters.prisonerName,
    prisonerNo: filters.prisonerNo,
    policeName: filters.policeName,
    policeNo: filters.policeNo,
    size: pagination.pageSize,
    current: pagination.currentPage
  }
  if (filters.dateRange && filters.dateRange.length > 0) {
    params.talkTime = filters.dateRange[0]
    params.talkTimeOver = filters.dateRange[1]
  }
  const res = await getPrisonerTalkCountStatisticsByDepartment(params)
  if (res && res.code === 200 && res.data) {
    tableData.value = res.data.records || []
    pagination.total = res.data.total || 0
  }
}

const departmentOptions = ref<any>([])
// 获取部门选项
async function fetchDepartmentOptions() {
  try {
    const params = {
      accessToken: store.token || '',
      oort_pdcode: store.userInfo?.oort_depcode || '',
      page: 1,
      pagesize: 100,
      isdel: 1
    }

    const response = await deptList(params)
    if (response && response.code === 200 && response.data) {
      departmentOptions.value = response.data.list.map(item => ({
        label: item.oort_dname,
        value: item.oort_dcode,
        code: item.oort_dcode,
        name: item.oort_dname,
        children: [], // Initialize empty children array
        hasChildren: true // Add flag to indicate this node can have children
      }))
    } else {
      ElMessage.error('获取部门列表失败!')
      departmentOptions.value = []
    }
  } catch (err) {
    ElMessage.error('获取部门列表失败!')
    departmentOptions.value = []
  }
}

// 加载子部门
async function loadChildren(node, resolve) {
  if (node.level === 0) {
    // Root level - return initial departments
    resolve(departmentOptions.value)
  } else {
    try {
      const params = {
        accessToken: store.token || '',
        oort_pdcode: node.data.code,
        page: 1,
        pagesize: 100,
        isdel: 1
      }
      const response = await deptList(params)
      if (response && response.code === 200 && response.data) {
        const children = response.data.list.map(item => ({
          label: item.oort_dname,
          value: item.oort_dcode,
          code: item.oort_dcode,
          name: item.oort_dname,
          children: [],
          hasChildren: true
        }))
        resolve(children)
      } else {
        resolve([])
      }
    } catch (err) {
      ElMessage.error('获取子部门列表失败!')
      resolve([])
    }
  }
}

function handleNodeClick(data) {
  filters.oortDepcode = data.code
  filters.dept_name = data.label
}

const handleSearch = () => {
  pagination.currentPage = 1
  getList()
}

const handleReset = () => {
  filters.talkCategory = ''
  filters.oortDepcode = store.userInfo?.oort_depcode || ''
  filters.dateRange = []
  filters.prisonerName = ''
  filters.prisonerNo = ''
  filters.policeName = ''
  filters.policeNo = ''
  filters.prisonerType = ''
  filters.dept_name = ''
  pagination.currentPage = 1
  getList()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  getList()
}

const handleCurrentChange = (current) => {
  pagination.currentPage = current
  getList()
}

import { downloadBlob } from '@/utils/downloadEx'
import { request } from '@/utils/service'
import Config from '@/config/index'

const handleExport = async() => {
  const params = {
    ...filters,
    accessToken: store.token || ''
  }
  if (filters.dateRange && filters.dateRange.length > 0) {
    params.talkTime = filters.dateRange[0]
    params.talkTimeOver = filters.dateRange[1]
  }
  const downloadUrl = Config.URL + Config.gateWay + 'oortcloud-educationtalk' + '/report/exportPrisonerTalkCountStatisticsByDepartment'
  let res = await request({ url: downloadUrl, method: 'post', data: params, responseType: 'blob' }, true)
  ElMessage.success('正在导出中...')
  downloadBlob(res, '罪犯谈话次数.xlsx')
}

onMounted(() => {
  getList()
  fetchDepartmentOptions()
})
</script>

    <style lang="scss" scoped>
    .memcon-container {
      padding: 20px;
      /* height: 100%; */
      display: flex;
      flex-direction: column;

      .main-content {
        display: flex;
        flex: 1;
        gap: 20px;
        min-height: 0;

        .org-tree {
          width: 250px;
          background: #fff;
          border-radius: 4px;
          padding: 15px;
          border: 1px solid #e6e6e6;

          .search-box {
            margin-bottom: 15px;
          }

          .custom-tree-node {
            display: flex;
            align-items: center;

            .dept-count {
              margin-left: 5px;
              color: #909399;
              font-size: 12px;
            }
          }
        }

        .content-area {
          flex: 1;
          background: #fff;
          border-radius: 4px;
          padding: 15px;
          border: 1px solid #e6e6e6;
          overflow: auto;

          .filter-bar {
            margin-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;

            .filter-item {
              display: flex;
              align-items: center;

              .filter-label {
                margin-right: 5px;
                white-space: nowrap;
                font-size: 14px;
              }
            }

            .search-group {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              gap: 10px;
            }
          }
        }
      }

      .prisoner-info,
      .police-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .code {
          font-size: 12px;
          color: #1890ff;
        }
      }

      .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }

      .status-pending {
        color: #E6A23C; // 黄色
      }

      .status-ongoing {
        color: #67C23A; // 绿色
      }

      .status-overdue {
        color: #909399; // 灰色
      }

      .status-completed {
        color: #409EFF; // 淡蓝色
      }

      .dialog-content {
        .basic-info {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 20px;

          .info-header {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;

            .prisoner-basic {
              .name-code {
                margin-bottom: 10px;

                .name {
                  font-size: 18px;
                  font-weight: bold;
                  margin-right: 15px;
                }

                .code {
                  color: #1890ff;
                }
              }

              .other-info {
                color: #666;

                span {
                  margin-right: 15px;
                }
              }
            }
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;

            .info-item {
              .label {
                color: #666;
                margin-right: 8px;
              }

              .el-date-picker {
                width: 180px;
                margin: 0 8px;
              }
            }
          }
        }

        .talk-effect {
          margin-bottom: 20px;

          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            padding-left: 10px;
            border-left: 4px solid #1890ff;
          }

          .message-list {
            max-height: 400px;
            overflow-y: auto;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;

            .empty-message {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 200px;
            }

            .message-item {
              display: flex;
              margin-bottom: 20px;
              align-items: flex-start;

              .message-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                margin-right: 12px;
                flex-shrink: 0;
                background: #f5f7fa;
                overflow: hidden;

                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }

              .message-content {
                max-width: 70%;

                .message-header {
                  display: flex;
                  align-items: center;
                  margin-bottom: 8px;

                  .message-name {
                    font-size: 14px;
                    color: #606266;
                    margin-right: 8px;
                  }

                  .message-time {
                    font-size: 12px;
                    color: #909399;
                  }
                }

                .message-text {
                  background: #f5f7fa;
                  padding: 12px;
                  border-radius: 4px;
                  font-size: 14px;
                  line-height: 1.5;
                  color: #303133;

                  .edit-history {
                    .history-item {
                      margin-bottom: 8px;
                      padding: 8px;
                      background: #f8f9fa;
                      border-radius: 4px;

                      .history-time {
                        font-size: 12px;
                        color: #909399;
                        margin-bottom: 4px;
                      }

                      .history-content {
                        display: flex;
                        align-items: center;
                        gap: 8px;

                        .deleted-text {
                          background-color: #ffeeba;
                          color: #dc3545;
                          text-decoration: line-through;
                          padding: 0 2px;
                        }

                        .arrow {
                          color: #909399;
                        }

                        .new-text {
                          color: #28a745;
                        }
                      }
                    }

                    .current-content {
                      margin-top: 8px;
                      padding-top: 8px;
                      border-top: 1px dashed #dcdfe6;

                      .label {
                        color: #606266;
                        font-weight: 500;
                      }

                      .content {
                        color: #303133;
                      }
                    }
                  }
                }
              }

              &.police {
                flex-direction: row-reverse;

                .message-avatar {
                  margin-right: 0;
                  margin-left: 12px;
                }

                .message-content {
                  text-align: right;

                  .message-text {
                    background: #ecf5ff;
                  }
                }
              }
            }
          }
        }

        .talk-time {
          margin-bottom: 20px;

          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            padding-left: 10px;
            border-left: 4px solid #1890ff;
          }

          .time-picker-container {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 4px;

            .separator {
              color: #666;
            }

            .el-date-picker {
              width: 220px;
            }
          }
        }

        .dialog-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e8e8e8;
        }
      }

      .word-preview {
        width: 100%;
        height: 500px;
        background: #f8f9fa;
        border-radius: 4px;
        overflow: hidden;

        iframe {
          border: none;
        }
      }

      .end-talk-confirm {
        text-align: center;
        padding: 20px 0;

        p {
          margin: 10px 0;
          font-size: 16px;

          &.warning {
            color: #E6A23C;
            font-size: 14px;
          }
        }
      }

      .effect-input-container {
        position: relative;
        margin-bottom: 20px;

        .word-count {
          position: absolute;
          bottom: 5px;
          right: 15px;
          font-size: 12px;
          color: #909399;
          background: transparent;
          pointer-events: none;
        }
      }
    }

    .message-text {
      :deep(.sensitive-word) {
        color: #f56c6c;
        font-weight: bold;
        background-color: #fef0f0;
        padding: 0 2px;
        border-radius: 2px;
      }
    }

    .talk-files {
      .file-list {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 4px;

        .file-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: #ecf5ff;
          }

          .file-icon {
            color: #1890ff;
            font-size: 18px;
          }

          .file-name {
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }
    </style>
