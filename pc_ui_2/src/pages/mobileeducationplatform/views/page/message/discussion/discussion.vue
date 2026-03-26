<template>
  <div class="discussion-container">
    <!-- 统计信息 -->
    <div class="statistics-bar">
      <div class="stat-item">
        <span>主管罪犯:</span>
        <span class="number">{{ stats.totalPrisoners }}</span>人
      </div>
      <div class="stat-item">
        <span>已谈罪犯:</span>
        <span class="number">{{ stats.discussedPrisoners }}</span>人
      </div>
      <div class="stat-item">
        <span>应谈次数:</span>
        <span class="number">{{ stats.requiredTalks }}</span>次
      </div>
      <div class="stat-item">
        <span>待谈次数:</span>
        <span class="number">{{ stats.pendingTalks }}</span>次
      </div>
      <div class="stat-item">
        <span>已谈次数:</span>
        <span class="number">{{ stats.completedTalks }}</span>次
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧组织架构 -->
      <div class="org-tree">
        <div class="search-box">
          <el-input
            v-model="searchText"
            placeholder="搜索"
            prefix-icon="el-icon-search"
            @input="handleSearchInput"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                搜索
              </el-button>
            </template>
          </el-input>
        </div>
        <el-tree
          ref="deptTree"
          :data="deptTreeData"
          :props="defaultProps"
          default-expand-all
          node-key="id"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span v-if="data.deptCount > 0" class="dept-count">({{ data.deptCount }})</span>
            </span>
          </template>
        </el-tree>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-area">
        <div class="filter-bar">
          <div class="filter-item">
            <span class="filter-label">谈话状态：</span>
            <el-select v-model="filters.status" placeholder="谈话状态" style="width: 210px">
              <el-option label="全部" value="" />
              <el-option label="待谈话" :value="1" />
              <el-option label="谈话中" :value="2" />
              <el-option label="已逾期" :value="3" />
              <el-option label="已谈话" :value="4" />
            </el-select>
          </div>
          <div class="filter-item">
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
          </div>
          <div class="filter-item">
            <span class="filter-label">日期范围：</span>
            <el-date-picker
              v-model="dateRange"
              value-format="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            />
          </div>
          <div class="filter-item">
            <span class="filter-label">罪犯姓名：</span>
            <el-input v-model="filters.prisonerName" placeholder="例:李四" style="width: 150px" />
          </div>
          <div class="filter-item">
            <span class="filter-label">罪犯编码：</span>
            <el-input v-model="filters.prisonerNo" placeholder="例:999999" style="width: 150px" />
          </div>
          <div class="search-group">
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
            <el-button type="primary" @click="handleStartTalk(false)">
              开始谈话
            </el-button>
            <el-button type="primary" @click="handleSyncPrisoner">
              同步罪犯信息
            </el-button>
          </div>
        </div>

        <!-- 表格区域 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="prisonerName" label="罪犯姓名" align="center">
            <template #default="{ row }">
              <div class="prisoner-info">
                {{ row.prisonerName }}<br />
                <span class="code">{{ row.prisonerNo }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="requiredTalks" label="应谈次数" align="center" />
          <el-table-column prop="completedTalks" label="已谈次数" align="center" />
          <el-table-column prop="policeName" label="主管民警" align="center">
            <template #default="{ row }">
              <div class="policeName-info">
                {{ row.policeName }}<br />
                <span class="code">{{ row.policeNo }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="prisonerTypeName" label="罪犯类型" align="center" />
          <el-table-column prop="statusDescription" label="状态" align="center">
            <template #default="{ row }">
              <span :class="getStatusClass(row.status)">{{ row.statusDescription }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="280" align="center">
            <template #default="{ row }">
              <el-button
                v-if="[1,4].includes(row.status)"
                type="primary"
                size="small"
                @click="handleStartTalk(row)"
              >
                开始谈话
              </el-button>
              <el-button type="info" size="small" @click="handleViewDetails(row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
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

    <!-- 添加谈话确认对话框 -->
    <el-dialog v-model="dialogVisible" title="确认谈话信息" width="600px" :close-on-click-modal="false">
      <new-start-talk-dia v-if="dialogVisible" :data="currentRow" @startTalk="confirmStartTalk" @cancel="dialogVisible = false" />
    </el-dialog>

    <!-- 谈话会话对话框 -->
    <el-dialog
      v-model="talkSessionDialogVisible"
      title="个别谈话"
      width="80%"
      :close-on-click-modal="false"
      :fullscreen="true"
      :show-close="true"
      append-to-body
      class="talk-session-dialog"
      :before-close="handleCloseDialog"
      destroy-on-close
      :modal-class="'talk-session-modal'"
      :lock-scroll="true"
    >
      <template #header>
        <div class="dialog-title">
          个别谈话
        </div>
      </template>
      <TalkSessionDia v-if="talkSessionDialogVisible" :talk-id="currentTalkId" @close="handleCloseDialog" />
    </el-dialog>

    <!-- 结束谈话确认对话框 -->
    <el-dialog v-model="endTalkDialogVisible" title="确认结束谈话" width="400px">
      <div class="end-talk-content">
        <p>确认要结束本次谈话吗？</p>
        <p class="talk-duration">
          谈话时长：{{ formatTime(talkSessionData.talkDuration) }}
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="endTalkDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEndTalk">确认结束</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog v-model="detailsDialogVisible" title="罪犯谈话记录" width="65%" :close-on-click-modal="false" destroy-on-close>
      <TalkRecordDia v-if="detailsDialogVisible" :current-prisoner-no="currentPrisonerNo" :date-range="dateRange" @viewTalkDetail="viewTalkDetail" />
    </el-dialog>

    <!-- 谈话详情弹窗 -->
    <el-dialog
      v-model="talkDetailDialogVisible"
      title="谈话详情"
      width="65%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <TalkDetailDia v-if="talkDetailDialogVisible" :id="talkID" />
    </el-dialog>

    <!-- 同步罪犯弹窗 -->

    <el-dialog v-model="syncDialogVisible" title="同步罪犯" width="500px" :close-on-click-modal="false" destroy-on-close>
      <el-form ref="syncForm" :model="syncForm" :rules="syncRules" label-width="130px">
        <el-form-item label="监狱名称" prop="prisonAreaCode">
          <el-select v-model="syncForm.prisonAreaCode" placeholder="请选择监狱" style="width: 100%">
            <el-option
              v-for="item in prisonList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="罪犯编码" prop="zfbm">
          <el-input v-model="syncForm.zfbm" placeholder="请输入罪犯编码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmSyncPrisoner">确认同步</el-button>
          <el-button @click="syncDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useUserStore } from '@/store/modules/user'
import { debounce } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { getCaseTypes, getMonthlyTalkPlans, getMonthStatistics, deptList, getPrisonList, syncPrisonerInfo } from '@/api/mobileeducationplatform/case'
import defaultAvatar from '@/assets/img/select_active.png'
import NewStartTalkDia from './newStartTalkDia.vue'
import TalkDetailDia from './talkDetailDia.vue'
import TalkRecordDia from './talkRecordDia.vue'
import TalkSessionDia from './talkSessionDia.vue'
import bus from '@/utils/bus'
const store = useUserStore()

export default {
  name: 'Discussion',
  components: {
    NewStartTalkDia,
    TalkDetailDia,
    TalkRecordDia,
    TalkSessionDia
  },
  data() {
    return {
      currentRow: null,
      searchText: '',
      deptTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      stats: {
        totalPrisoners: 0,
        discussedPrisoners: 0,
        requiredTalks: 0,
        pendingTalks: 0,
        completedTalks: 0
      },
      filters: {
        status: '',
        talkType: '',
        prisonerName: '',
        prisonerNo: '',
        policeName: '',
        policeNo: ''
      },
      dateRange: [],
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      currentDeptCode: '',
      currentDeptName: '',
      debouncedSearch: null,
      talkTypes: [],
      dialogVisible: false,
      talkSessionDialogVisible: false,
      endTalkDialogVisible: false,
      departmentOptions: [],
      talkSessionData: {
        prisonerName: '',
        prisonerCode: '',
        theme: '',
        talkType: '',
        talkId: '',
        talkCount: 0,
        talkDuration: 0,
        isRecording: true,
        messages: [],
        prisonerAvatar: defaultAvatar,
        policeAvatar: defaultAvatar
      },
      currentTalkId: 'd032a5a9419f5800f892d4da287d417b', // 当前谈话ID
      conversation: '', // 添加谈话内容字段
      detailsDialogVisible: false,
      talkRecords: [],
      detailsPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      currentPrisonerNo: '', // 当前查看的罪犯编号
      talkDetailDialogVisible: false, // 谈话详情弹窗
      talkID: null, // 谈话详id
      policeAvatar: defaultAvatar, // 民警头像
      // 陪同民警远程搜索相关
      escortPoliceOptions: [], // 陪同民警选项
      escortPoliceLoading: false, // 陪同民警加载状态
      escortPoliceSelected: [], // 选中的陪同民警编码
      escortPoliceMap: {}, // 陪同民警编码到名称的映射
      // 谈话对象远程搜索相关
      talkTargetOptions: [], // 谈话对象选项
      talkTargetLoading: false, // 谈话对象加载状态
      talkTargetSelected: '', // 选中的谈话对象编码
      talkTargetMap: {}, // 谈话对象编码到名称的映射
      // 谈话民警远程搜索相关
      policeNameOptions: [], // 谈话民警选项
      policeNameLoading: false, // 谈话民警加载状态
      policeNameSelected: '', // 选中的谈话民警编码
      policeNameMap: {}, // 谈话民警编码到名称的映射
      syncDialogVisible: false,
      prisonList: [],
      syncForm: {
        prisonAreaCode: '',
        zfbm: ''
      },
      syncRules: {
        prisonAreaCode: [
          { required: true, message: '请选择监狱', trigger: 'change' }
        ],
        zfbm: [
          { required: true, message: '请输入罪犯编码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initData()
    // 创建一个延迟触发的搜索功能
    this.debouncedSearch = debounce(this.fetchDeptList, 500)
    // 获取谈话类型
    this.fetchTalkTypes()
    // 设置默认日期范围
    this.setDefaultDateRange()
    // 监听-开始谈话
    bus.$on('handleStartTalk', this.func)
  },
  methods: {
    func() {
      this.handleStartTalk()
    },
    async initData() {
      try {
        // 先获取部门数据，包括部门选项
        await this.fetchDepartmentOptions()
        await this.fetchTableData()
        await this.fetchStatistics()
      } catch (err) {
        ElMessage.error('初始化数据失败!')
      }
    },
    async fetchDeptList() {
      try {
        const params = {
          accessToken: store.token || '',
          ...(this.searchText ? {} : { oort_pdcode: store.userInfo?.oort_depcode || '' }),
          keyword: this.searchText || '',
          page: 1,
          pagesize: 10,
          isdel: 1
        }

        const response = await deptList(params)
        if (response && response.code === 200 && response.data) {
          this.deptTreeData = this.formatDeptTree(response.data)
        } else {
          ElMessage.error('获取组织架构失败！')
          this.deptTreeData = []
        }
      } catch (err) {
        this.deptTreeData = []
      }
    },
    formatDeptTree(data) {
      if (!data || !data.list) {
        return []
      }
      return data.list.map(item => ({
        label: item.oort_dname,
        id: item.oort_dcode,
        deptCode: item.oort_dcode,
        deptName: item.oort_dname,
        deptPath: item.oort_dpath,
        deptLevel: item.oort_dlevel,
        deptCount: item.oort_dept_count,
        userCount: item.oort_user_count,
        children: [] // 初始化空的子节点数组
      }))
    },
    handleNodeClick(data) {
      // 获取被点击节点的部门代码
      const deptCode = data.id

      // 获取被点击部门的子部门
      this.fetchChildDepartments(deptCode)

      // 更新当前部门信息，用于其他操作
      this.currentDeptCode = deptCode
      this.currentDeptName = data.label

      // 获取选中部门的表格数据和统计数据
      this.fetchTableData(deptCode)
      this.fetchStatistics()
    },
    async fetchChildDepartments(deptCode) {
      try {
        const params = {
          accessToken: store.token || '',
          oort_pdcode: deptCode, // 使用被点击的部门代码获取其子部门
          // 获取子部门时不包含关键字
          page: 1,
          pagesize: 10,
          isdel: 1
        }

        const response = await deptList(params)
        if (response && response.code === 200 && response.data) {
          // 在树中查找被点击的部门
          const updateNode = (nodes) => {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id === deptCode) {
                // 更新被点击部门的子部门
                nodes[i].children = this.formatDeptTree(response.data)
                return true
              }
              if (nodes[i].children && nodes[i].children.length > 0) {
                if (updateNode(nodes[i].children)) {
                  return true
                }
              }
            }
            return false
          }

          // 更新树数据
          updateNode(this.deptTreeData)

          // 如果是搜索结果，需要确保节点展开
          if (this.searchText) {
            this.$nextTick(() => {
              // 在树中查找节点并展开
              const tree = this.$refs.deptTree
              if (tree) {
                tree.expand(deptCode)
              }
            })
          }
        } else {
          ElMessage.error('获取子部门失败！')
        }
      } catch (err) {
        ElMessage.error('获取子部门失败!')
      }
    },
    async fetchTableData(deptId) {
      try {
        // 准备请求参数
        const params = {
          current: this.pagination.currentPage,
          size: this.pagination.pageSize,
          prisonerName: this.filters.prisonerName || '',
          prisonerNo: this.filters.prisonerNo || '',
          policeName: this.filters.policeName || '',
          policeNo: this.filters.policeNo || '',

          prisonerType: '',
          talkType: this.filters.talkType || '',
          status: this.filters.status || '',
          oortDepcode: deptId || this.currentDeptCode || store.userInfo?.oort_depcode || '',
          oortDepname: this.currentDeptName || ''
        }

        // 处理日期范围
        if (this.dateRange && this.dateRange.length === 2) {
          params.startTime = this.dateRange[0]
          params.endTime = this.dateRange[1]
        }

        // 调用API获取数据
        const response = await getMonthlyTalkPlans(params)
        if (response.code === 200) {
          // 确保数据格式正确
          if (response.data && Array.isArray(response.data.records)) {
            // 更新表格数据
            this.tableData = response.data.records.map(record => ({
              // 基本信息
              id: record.id || '',
              prisonerName: record.prisonerName || '',
              prisonerNo: record.prisonerNo || '',
              prisonerCode: record.prisonerNo || '', // 对应 Memcon 的 prisonerCode
              prisonerType: record.prisonerType || '',
              prisonerTypeName: record.prisonerTypeName || '',
              prisonerAge: record.prisonerAge || '',
              sex: record.sex || '',
              ethnicity: record.ethnicity || '',
              crime: record.crime || '',
              remainingSentence: record.remainingSentence || '',
              treatmentLevel: record.treatmentLevel || '',

              // 监区信息
              prisonName: record.prisonName || '',
              prisonArea: record.prisonArea || '',
              cellNumber: record.cellNumber || '',
              oortDepname: record.oortDepname || this.currentDeptName || '',
              oortDepcode: record.oortDepcode || this.currentDeptCode || '',
              department: record.oortDepname || this.currentDeptName || '', // 对应 Memcon 的 department
              departmentCode: record.oortDepcode || this.currentDeptCode || '', // 对应 Memcon 的 departmentCode

              // 民警信息
              policeName: record.policeName || '',
              policeNo: record.policeNo || '',
              policeCode: record.policeNo || '', // 对应 Memcon 的 policeCode

              // 谈话信息
              talkType: record.talkType || '',
              talkTypeName: record.talkTypeName || '',
              status: record.status || 0,
              statusDescription: record.statusDescription || '',
              requiredTalks: record.requiredTalks || 0,
              completedTalks: record.completedTalks || 0,
              plannedTalks: record.plannedTalks || 0,
              startTime: record.startTime || null,
              endTime: record.endTime || null,
              memconId: record.memconId || null,
              planId: record.id || '' // 保存应谈ID，用于后续创建谈话记录
            }))

            // 更新分页信息
            this.pagination.total = response.data.total || 0

            // 更新统计信息
            if (this.tableData.length > 0) {
              this.updateStats(this.tableData)
            }
          } else {
            ElMessage.error('数据格式不正确!')
            this.tableData = []
          }
        } else {
          ElMessage.error('获取应谈计划失败!')
          this.tableData = []
        }
      } catch (err) {
        ElMessage.error('获取应谈计划失败!')
        this.tableData = []
      }
    },
    updateStats(records) {
      // 计算统计信息

      let requiredTalks = 0
      let pendingTalks = 0
      let completedTalks = 0

      // 使用Set来统计不重复的罪犯数量
      const prisonerSet = new Set()

      records.forEach(record => {
        // 统计罪犯数量
        if (record.prisonerNo) {
          prisonerSet.add(record.prisonerNo)
        }

        // 统计应谈次数和已谈次数
        if (record.requiredTalks) {
          requiredTalks += record.requiredTalks
        }

        if (record.completedTalks) {
          completedTalks += record.completedTalks
        }

        // 统计待谈次数
        if (record.status === 2) {
          pendingTalks++
        }
      })

      // 更新统计信息
      this.stats.totalPrisoners = prisonerSet.size
      this.stats.discussedPrisoners = records.filter(r => r.completedTalks > 0).length
      this.stats.requiredTalks = requiredTalks
      this.stats.pendingTalks = pendingTalks
      this.stats.completedTalks = completedTalks
    },
    handleSearch() {
      // 点击搜索按钮时直接调用fetchTableData和fetchStatistics
      this.pagination.currentPage = 1 // 重置页码
      this.fetchTableData()
      this.fetchStatistics()
    },
    handleReset() {
      this.filters = {
        status: '',
        talkType: '',
        prisonerName: '',
        prisonerNo: '',
        policeName: '',
        policeNo: ''
      }
      this.dateRange = []
      this.pagination.currentPage = 1 // 重置页码
      this.fetchTableData()
      this.fetchStatistics()
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchTableData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchTableData()
    },
    getStatusType(status) {
      const types = {
        1: 'success', // 谈话中
        2: 'warning', // 待谈话
        3: 'danger', // 已逾期
        4: 'info' // 已谈话
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        1: '谈话中',
        2: '待谈话',
        3: '已逾期',
        4: '已谈话'
      }
      return texts[status] || '未知状态'
    },
    confirmStartTalk(data) {
      this.dialogVisible = false
      this.currentTalkId = data
      this.talkSessionDialogVisible = true
    },
    handleStartTalk(row) {
      this.currentRow = row
      this.dialogVisible = true
    },
    async handleViewDetails(row) {
      this.currentPrisonerNo = row.prisonerNo
      this.detailsDialogVisible = true
    },

    viewTalkDetail(row) {
      // 实现查看单条谈话记录详情的逻辑
      this.talkID = row.id
      this.talkDetailDialogVisible = true
    },

    getWordFileName(recordNo, path) {
      if (!path) return ''
      const extension = path.toLowerCase().endsWith('.docx') ? '.docx' : '.doc'
      return `${recordNo}${extension}`
    },
    handleSearchInput() {
      // 使用防抖搜索函数
      this.debouncedSearch()
    },
    async fetchTalkTypes() {
      try {
        const res = await getCaseTypes('1000')
        if (res.code === 200) {
          this.talkTypes = res.data
          // 默认设置为全部，不选择第一个类型
          this.filters.type = ''
        } else {
          ElMessage.error('获取谈话类型失败')
        }
      } catch (error) {
        ElMessage.error('获取谈话类型失败')
      }
    },
    setDefaultDateRange() {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
      // 格式为 YYYY-MM-DD HH:mm:ss
      const format = (date) => {
        const pad = (n) => n < 10 ? '0' + n : n
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
      }
      this.dateRange = [format(firstDay), format(lastDay)]
    },
    getStatusClass(status) {
      const classes = {
        1: 'status-pending', // 待谈话 - 黄色
        2: 'status-ongoing', // 谈话中 - 绿色
        3: 'status-overdue', // 已逾期 - 灰色
        4: 'status-completed' // 已谈话 - 淡蓝色
      }
      return classes[status] || ''
    },

    // 处理对话框关闭
    handleCloseDialog() {
      this.talkSessionDialogVisible = false
      this.currentTalkId = ''
      this.fetchTableData()
    },
    // 格式化时间
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    },
    // 结束谈话
    endTalk() {
      this.endTalkDialogVisible = true
    },
    // 确认结束谈话
    async confirmEndTalk() {
      try {
        // TODO: 调用结束谈话API
        ElMessage.success('谈话已结束')
        this.endTalkDialogVisible = false
        this.talkSessionDialogVisible = false

        // 刷新表格数据
        this.fetchTableData()
      } catch (error) {
        ElMessage.error('结束谈话失败!')
      }
    },
    async fetchDepartmentOptions() {
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
          // 只处理顶级部门
          this.departmentOptions = response.data.list.map(item => ({
            label: item.oort_dname,
            value: item.oort_dcode,
            code: item.oort_dcode,
            name: item.oort_dname,
            children: [], // 初始化为空数组
            leaf: false // 标记为非叶子节点
          }))

          // 同时更新组织架构树数据
          this.deptTreeData = this.formatDeptTree(response.data)
        } else {
          ElMessage.error('获取部门列表失败!')
          this.departmentOptions = []
          this.deptTreeData = []
        }
      } catch (err) {
        ElMessage.error('获取部门列表失败!')
        this.departmentOptions = []
        this.deptTreeData = []
      }
    },
    // 添加加载子节点的方法
    async loadDepartmentNode(node, resolve) {
      if (node.level === 0) {
        // 根节点，返回顶级部门
        return resolve(this.departmentOptions)
      }

      try {
        const params = {
          accessToken: store.token || '',
          oort_pdcode: node.data.code, // 使用父节点的code作为查询参数
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
            children: [], // 初始化为空数组
            leaf: false // 标记为非叶子节点
          }))
          resolve(children)
        } else {
          resolve([])
        }
      } catch (error) {
        ElMessage.error('获取子部门失败!')
        resolve([])
      }
    },
    async fetchStatistics() {
      try {
        const params = {
          oortDepcode: store.userInfo?.oort_depcode || '',
          policeNo: store.userInfo?.oort_code || ''
        }

        const response = await getMonthStatistics(params)
        if (response.code === 200 && response.data) {
          this.stats = {
            totalPrisoners: response.data.value1 || 0,
            discussedPrisoners: response.data.value2 || 0,
            requiredTalks: response.data.value3 || 0,
            pendingTalks: response.data.value4 || 0,
            completedTalks: response.data.value5 || 0
          }
        } else {
          ElMessage.error('获取统计数据失败!')
        }
      } catch (err) {
        ElMessage.error('获取统计数据失败!')
      }
    },

    // 远程搜索谈话民警

    // 打开同步罪犯弹窗
    async handleSyncPrisoner() {
      this.syncDialogVisible = true
      this.syncForm = {
        prisonAreaCode: '',
        zfbm: ''
      }
      await this.fetchPrisonList()
    },

    // 获取监狱列表
    async fetchPrisonList() {
      try {
        const response = await getPrisonList('990087654')// 990087654
        if (response && response.code === 200) {
          this.prisonList = response.data.map(item => ({
            name: item.name,
            code: item.code,
            pid: item.pid
          }))
        } else {
          ElMessage.error('获取监狱列表失败')
        }
      } catch (error) {
        ElMessage.error('获取监狱列表失败')
      }
    },

    // 确认同步罪犯
    async confirmSyncPrisoner() {
      this.$refs.syncForm.validate(async(valid) => {
        if (valid) {
          try {
            const response = await syncPrisonerInfo(this.syncForm)
            if (response && response.code === 200) {
              ElMessage.success('同步罪犯成功')
              this.syncDialogVisible = false
              // 刷新表格数据
              this.fetchTableData()
            } else {
              ElMessage.error(response.msg || '同步罪犯失败')
            }
          } catch (error) {
            ElMessage.error('同步罪犯失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.discussion-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .statistics-bar {
    background-color: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-around;

    .stat-item {
      text-align: center;

      .number {
        color: #409EFF;
        font-size: 20px;
        font-weight: bold;
        margin: 0 5px;
      }
    }
  }

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

  .name-number-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .name {
      font-weight: 500;
      color: #409EFF;
    }

    .number {
      font-size: 12px;
      color: #909399;
    }
  }

  .code {
    color: #1890ff;
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
}

.dialog-content {
  padding: 20px;

  .el-form-item {
    margin-bottom: 20px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.talk-session-dialog {
  :deep(.el-dialog) {
    margin: 0 !important;
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-dialog__header {
      padding: 0;
      margin: 0;
      height: 55px;
      line-height: 55px;
      background-color: #409EFF;
      border-bottom: 1px solid #eee;

      .dialog-title {
        color: #fff;
        font-size: 18px;
        background-color: #409EFF;
        font-weight: normal;
        margin: 0;
        padding: 0 20px;
      }

      .el-dialog__headerbtn {
        top: 15px;

        .el-dialog__close {
          color: #fff;
          font-size: 20px;

          &:hover {
            color: #fff;
            opacity: 0.8;
          }
        }
      }
    }

    .el-dialog__body {
      flex: 1;
      padding: 0;
      overflow: hidden;
      height: calc(100vh - 55px);
      position: relative;
    }
  }
}

.end-talk-content {
  text-align: center;
  padding: 20px 0;

  .talk-duration {
    margin-top: 10px;
    color: #666;
  }
}

// 添加全局样式隔离
:global(.talk-session-modal) {
  background-color: rgba(0, 0, 0, 0.7);
}

.details-dialog-content {
  padding: 20px;

  .prisoner-info,
  .police-info {
    text-align: center;

    .code {
      color: #1890ff;
      font-size: 12px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
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

.message-text {
  :deep(.sensitive-word) {
    color: #f56c6c;
    font-weight: bold;
    background-color: #fef0f0;
    padding: 0 2px;
    border-radius: 2px;
  }
}

.code-text {
  color: #909399;
  margin-left: 5px;
  font-size: 12px;
}
</style>
