<template>
  <div class="discussion-container">
    <!-- 统计信息 -->
    <div class="statistics-bar">
      <div class="stat-item">
        <span>已谈话民警数:</span>
        <span class="number">{{ stats.yt }}</span>人
      </div>
      <div class="stat-item">
        <span>与罪犯已谈话次数:</span>
        <span class="number">{{ stats.zfyt }}</span>次
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
            <span class="filter-label">日期范围：</span>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            />
          </div>
          <div class="search-group">
            <div class="filter-item">
              <span class="filter-label">民警姓名：</span>
              <el-input v-model="filters.policeName" placeholder="例:张三" style="width: 150px" />
            </div>

            <div class="filter-item">
              <span class="filter-label"> 警号：</span>
              <el-input v-model="filters.policeCode" placeholder="例:L999999" style="width: 150px" />
            </div>
            <el-button type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button @click="handleReset">
              重置
            </el-button>
          </div>
        </div>

        <!-- 表格区域 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="policeName" label="民警姓名" align="center">
            <template #default="{ row }">
              <div class="policeName-info">
                {{ row.policeName }}<br />
                <span class="code">{{ row.policeCode }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="completedTalks" label="与罪犯已谈人数" align="center" />
          <el-table-column prop="requiredTalks" label="已谈次数" align="center" />
          <el-table-column label="操作" width="280" align="center">
            <template #default="{ row }">
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

    <!-- 查看详情对话框 -->
    <el-dialog v-model="detailsDialogVisible" title="谈话记录" width="80%" :close-on-click-modal="false" destroy-on-close>
      <div class="details-dialog-content">
        <el-table :data="talkRecords" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column label="罪犯姓名" align="center">
            <template #default="{ row }">
              <div class="prisoner-info">
                {{ row.prisonerName }}<br />
                <span class="code">{{ row.prisonerCode }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="谈话民警" align="center">
            <template #default="{ row }">
              <div class="police-info">
                {{ row.policeName }}<br />
                <span class="code">{{ row.policeCode }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="talkTypeName" label="谈话类别" align="center" />
          <el-table-column prop="theme" label="谈话主题" align="center" />
          <el-table-column prop="formattedTalkTime" label="谈话时间" align="center">
            <template #default="{ row }">
              {{ row.formattedTalkTime }} 至 {{ row.formattedTalkTimeOver }}
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="谈话时长（分钟）" align="center" />
          <el-table-column prop="prisonerTypeName" label="罪犯类型" align="center" />
          <el-table-column prop="statusDescription" label="状态" align="center">
            <template #default="{ row }">
              <span :class="getStatusClass(row.status)">{{ row.statusDescription }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="viewTalkDetail(row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            :current-page="detailsPagination.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="detailsPagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="detailsPagination.total"
            @size-change="handleDetailsPageSizeChange"
            @current-change="handleDetailsPageChange"
          />
        </div>
      </div>
    </el-dialog>

    <!-- 谈话详情弹窗 -->
    <el-dialog
      v-model="talkDetailDialogVisible"
      title="谈话详情"
      width="1000px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-if="talkDetailData" class="dialog-content">
        <div class="basic-info">
          <div class="info-header">
            <div class="prisoner-avatar">
              <el-avatar :size="80" :src="talkDetailData.prisonerImg || defaultAvatar" />
            </div>
            <div class="prisoner-basic">
              <div class="name-code">
                <span class="name">{{ talkDetailData.prisonerName }}</span>
                <span class="code">编号：{{ talkDetailData.prisonerCode }}</span>
              </div>
              <div class="other-info">
                <span>年龄：{{ talkDetailData.prisonerAge }}岁</span>
                <span>性别：{{ talkDetailData.sex }}</span>
              </div>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">监狱监区监室：</span>
              <span>{{ talkDetailData.prisonAreaSummary }}</span>
            </div>
            <div class="info-item">
              <span class="label">谈话民警：</span>
              <span>{{ talkDetailData.policeName }} ({{ talkDetailData.policeCode }})</span>
            </div>
            <div class="info-item">
              <span class="label">谈话类别：</span>
              <span>{{ talkDetailData.talkTypeName }}</span>
            </div>
            <div class="info-item">
              <span class="label">谈话主题：</span>
              <span>{{ talkDetailData.theme }}</span>
            </div>
          </div>
        </div>
        <div class="talk-effect">
          <div class="section-title">
            谈话内容摘要
          </div>
          <div class="message-list">
            <div
              v-if="!talkDetailData.audioText"
              class="empty-message"
            >
              <el-empty description="暂无谈话内容摘要" />
            </div>
            <div v-else>
              <div class="message-item">
                <div class="message-content">
                  <div class="message-text" v-html="detailData.audioText" />
                </div>
              </div>
            </div>
            <!-- <div
              v-for="(message, index) in talkDetailData.conversationList"
              v-else
              :key="index"
              class="message-item"
              :class="{ police: message.role === 'police' }"
            >
              <div class="message-avatar">
                <img
                  :src="message.role === 'police' ? policeAvatar : (talkDetailData.prisonerImg || defaultAvatar)"
                  :alt="message.role"
                />
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-name">{{ message.role === 'police' ? '民警' + talkDetailData.policeName :
                    talkDetailData.prisonerName }}</span>
                  <span class="message-time">{{ formatMessageTime(message.time) }}</span>
                </div>
                <div class="message-text" :class="{ 'edited': message.hasHistory }">
                  <div v-if="message.history && message.history.length > 0" class="edit-history">
                    <div
                      v-for="(historyItem, historyIndex) in message.history"
                      :key="historyIndex"
                      class="history-item"
                    >
                      <div class="history-time">
                        {{ historyItem.editTime }}
                      </div>
                      <div class="history-content">
                        <span class="deleted-text" v-html="highlightSensitiveWords(historyItem.originalContent)" />
                        <span class="arrow">→</span>
                        <span class="new-text" v-html="highlightSensitiveWords(historyItem.editedContent)" />
                      </div>
                    </div>
                    <div class="current-content">
                      <span class="label">当前内容：</span>
                      <span class="content" v-html="highlightSensitiveWords(message.content)" />
                    </div>
                  </div>
                  <div v-else v-html="highlightSensitiveWords(message.content)" />
                </div>
              </div>
            </div> -->
          </div>
        </div>

        <div class="talk-effect">
          <div
            v-if="talkDetailData.audioPath || talkDetailData.videoPath || talkDetailData.textPath"
            class="talk-files"
          >
            <div class="section-title talkFilesMana  flexRowAC">
              谈话文件
              <el-button @click="talkFilesManaFn">
                谈话文件管理
              </el-button>
            </div>
            <div class="file-list">
              <div
                v-if="talkDetailData.audioPath"
                class="file-item"
                @click="handleFilePreview('audio', talkDetailData.audioPath)"
              >
                <span class="file-icon"><i class="el-icon-headset" /></span>
                <span class="file-name">{{ talkDetailData.recordNo }}.mp3</span>
              </div>
              <div
                v-if="talkDetailData.videoPath"
                class="file-item"
                @click="handleFilePreview('video', talkDetailData.videoPath)"
              >
                <span class="file-icon"><i class="el-icon-video-camera" /></span>
                <span class="file-name">{{ talkDetailData.recordNo }}.mp4</span>
              </div>
              <div
                v-if="talkDetailData.textPath"
                class="file-item"
                @click="handleFileDownload(talkDetailData.textPath, talkDetailData.recordNo)"
              >
                <span class="file-icon"><i class="el-icon-document" /></span>
                <span class="file-name">{{ getWordFileName(talkDetailData.recordNo, talkDetailData.textPath) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="talk-time">
          <div class="section-title">
            谈话时间
          </div>
          <div class="time-picker-container">
            <span>{{ talkDetailData.formattedTalkTime }} 至 {{ talkDetailData.formattedTalkTimeOver }}</span>
            <span class="label">谈话时长：</span> <span>{{ formatDuration(talkDetailData.duration || 0) }}</span>
          </div>
        </div>

        <div class="talk-effect">
          <div class="section-title">
            谈话效果
          </div>
          <div class="effect-content">
            {{ talkDetailData.talkEffect || '暂无谈话效果' }}
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 文件预览弹窗 -->
    <el-dialog
      v-model="filePreviewVisible"
      :title="filePreviewTitle"
      width="800px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <!-- 音频预览 -->
      <audio v-if="previewType === 'audio'" :src="previewUrl" controls style="width: 100%" />

      <!-- 视频预览 -->
      <video v-if="previewType === 'video'" :src="previewUrl" controls style="width: 100%" />

      <!-- 文本预览 -->
      <div v-if="previewType === 'word'" v-loading="textLoading" class="word-preview">
        <iframe :src="previewUrl" width="100%" height="500px" frameborder="0" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { useUserStore } from '@/store/modules/user'
import { debounce } from 'lodash-es'
import { getPoliceConversationList, getPoliceConversationStatistics, getPrisonerNoMemconList, deptList, getMemconInfo, startTalk } from '@/api/mobileeducationplatform/case'
import { ElMessage } from 'element-plus'
import defaultAvatar from '@/assets/img/select_active.png'
import Config from '@/config'

const store = useUserStore()

export default {
  name: 'Discussion',
  data() {
    return {
      searchText: '',
      deptTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      stats: {
        yt: 0,
        zfyt: 0
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
      talkForm: {
        talkType: '',
        theme: '',
        department: '',
        departmentCode: '',
        planId: '',
        escortPolice: '',
        policeName: store.userInfo?.oort_name || '',
        talkTarget: '',
        prisonerInfo: null,
        place: ''
      },
      talkRules: {
        talkType: [{ required: true, message: '请选择谈话类别', trigger: 'change' }],
        theme: [
          { required: true, message: '请输入谈话主题', trigger: 'blur' },
          { max: 50, message: '谈话主题最多50个字符', trigger: 'blur' }
        ],
        department: [{ required: true, message: '请输入部门/监区', trigger: 'blur' }],
        talkTarget: [{ required: true, message: '请输入谈话对象', trigger: 'blur' }]
      },
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
        templates: [],
        prisonerAvatar: defaultAvatar,
        policeAvatar: defaultAvatar
      },
      timer: null,
      currentTalkId: '', // 当前谈话ID
      talkEffect: '', // 添加谈话效果字段
      conversation: '', // 添加谈话内容字段
      detailsDialogVisible: false,
      talkRecords: [],
      detailsPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      currentPoliceCode: '', // 当前查看的民警编号
      talkDetailDialogVisible: false, // 谈话详情弹窗
      talkDetailData: null, // 谈话详情数据
      filePreviewVisible: false, // 文件预览弹窗
      filePreviewTitle: '', // 文件预览标题
      previewType: '', // 预览类型
      previewUrl: '', // 预览URL
      textLoading: false, // 文本加载状态
      policeAvatar: defaultAvatar, // 民警头像
      // 添加敏感词列表
      sensitiveWords: [
        '暴动', '越狱', '逃跑', '自杀', '自残', '斗殴', '打架', '闹事', '暴乱'
      ]
    }
  },
  created() {
    // 创建一个延迟触发的搜索功能
    this.debouncedSearch = debounce(this.fetchDeptList, 500)
    // 设置默认日期范围
    this.setDefaultDateRange()
    // 初始化数据
    this.initData()
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    // 谈话文件管理-跳转百度网盘
    talkFilesManaFn() {
      let url = Config.URL.slice(0, -1) +
        Config.frontURLStr +
        '/oortcloud-policefront/userservice_manage/index.html?accessToken=' +
        store.userInfo.accessToken
      window.open(url, '_blank')
    },
    formatDuration(duration) {
      duration = parseInt(duration)
      if (duration === 0) {
        return '0分0秒'
      }
      const minutes = Math.floor(duration / 60)
      const seconds = duration % 60
      return `${minutes}分${seconds}秒`
    },
    // async initData() {
    //   try {
    //     await this.fetchDeptList()
    //     await this.fetchTableData()
    //   } catch (err) {
    //     ElMessage.error('初始化数据失败')
    //   }
    // },
    async initData() {
      try {
        // 先获取部门列表
        await this.fetchDeptList()
        // 获取部门选项
        await this.fetchDepartmentOptions()
        // 获取表格数据和统计数据
        await this.fetchTableData()
        await this.fetchStatistics()
      } catch (err) {
        ElMessage.error('初始化数据失败:', err)
      }
    },
    async fetchDeptList() {
      try {
        const params = {
          accessToken: store.token || '',
          oort_pdcode: store.userInfo?.oort_depcode || '', // 只获取当前编码下的部门
          keyword: this.searchText || '',
          page: 1,
          pagesize: 10,
          isdel: 1
        }

        const response = await deptList(params)
        if (response && response.code === 200 && response.data) {
          this.deptTreeData = this.formatDeptTree(response.data)
        } else {
          ElMessage.error(response?.msg || '获取组织架构失败')
          this.deptTreeData = []
        }
      } catch (err) {
        ElMessage.error('获取组织架构失败:', err)
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
          ElMessage.error(response?.msg || '获取子部门失败')
        }
      } catch (err) {
        ElMessage.error('获取子部门失败:', err)
      }
    },
    async fetchTableData(deptId) {
      try {
        // 准备请求参数
        const params = {
          current: this.pagination.currentPage,
          size: this.pagination.pageSize,
          policeName: this.filters.policeName || '',
          policeCode: this.filters.policeCode || '',
          departmentCode: deptId || this.currentDeptCode || store.userInfo?.oort_depcode || '',
          oortDepname: this.currentDeptName || ''
        }

        // 处理日期范围
        if (this.dateRange && this.dateRange.length === 2) {
          // 格式化开始时间
          const startDate = new Date(this.dateRange[0])
          const startYear = startDate.getFullYear()
          const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
          const startDay = String(startDate.getDate()).padStart(2, '0')
          const startHours = String(startDate.getHours()).padStart(2, '0')
          const startMinutes = String(startDate.getMinutes()).padStart(2, '0')
          const startSeconds = String(startDate.getSeconds()).padStart(2, '0')
          params.talkTime = `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}:${startSeconds}`

          // 格式化结束时间
          const endDate = new Date(this.dateRange[1])
          const endYear = endDate.getFullYear()
          const endMonth = String(endDate.getMonth() + 1).padStart(2, '0')
          const endDay = String(endDate.getDate()).padStart(2, '0')
          const endHours = String(endDate.getHours()).padStart(2, '0')
          const endMinutes = String(endDate.getMinutes()).padStart(2, '0')
          const endSeconds = String(endDate.getSeconds()).padStart(2, '0')
          params.talkTimeOver = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}:${endSeconds}`
        }

        // 调用API获取数据
        const response = await getPoliceConversationList(params)
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
              // policeNo: record.policeCode || '',
              policeCode: record.policeCode || '', // 对应 Memcon 的 policeCode

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
            ElMessage.error('API返回的数据格式不正确！')
            this.tableData = []
          }
        } else {
          ElMessage.error('获取应谈计划失败！')
          this.tableData = []
        }
      } catch (err) {
        ElMessage.error('获取应谈计划失败！')
        this.tableData = []
      }
    },
    updateStats(records) {
      // 计算统计信息
      // let totalPrisoners = 0
      // let discussedPrisoners = 0
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
    startDiscussion() {
      // TODO: 实现开始谈话逻辑
    },
    handleStartTalk(row) {
      // 保存完整的罪犯信息
      this.talkForm.prisonerInfo = row
      // 预填表单数据
      this.talkForm = {
        ...this.talkForm,
        talkTarget: row.prisonerName, // 罪犯姓名
        prisonerCode: row.prisonerNo, // 罪犯编号
        department: row.oortDepname, // 使用罪犯所属组织名称
        departmentCode: row.oortDepcode, // 使用罪犯所属组织CODE
        policeName: store.userInfo?.oort_name,
        // policeName: row.policeName, // 使用当前登录账号用户为谈话民警   、、、oort_name  store.userInfo?.oort_depcode

        planId: row.id, // 保存应谈ID
        place: '', // 清空谈话地点
        theme: '', // 清空主题
        escortPolice: '', // 清空陪同民警
        talkType: '' // 清空谈话类型
      }
      this.dialogVisible = true
    },
    async handleViewDetails(row) {
      this.detailsDialogVisible = true
      this.currentPoliceCode = row.policeCode
      // 重置分页
      this.detailsPagination.currentPage = 1
      await this.fetchTalkRecords()
    },
    async fetchTalkRecords() {
      try {
        // 将日期格式调整以符合后端要求 (yyyy-MM-dd HH:mm:ss)
        const formatDate = (date) => {
          if (!date) return null
          const d = new Date(date)
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          const hours = String(d.getHours()).padStart(2, '0')
          const minutes = String(d.getMinutes()).padStart(2, '0')
          const seconds = String(d.getSeconds()).padStart(2, '0')
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }

        const params = {
          policeCode: this.currentPoliceCode, // 使用当前查看的民警编号
          departmentCode: this.currentDeptCode || store.userInfo?.oort_depcode || '',
          current: this.detailsPagination.currentPage,
          size: this.detailsPagination.pageSize,
          talkTime: formatDate(this.dateRange?.[0]),
          talkTimeOver: formatDate(this.dateRange?.[1])
        }

        const response = await getPrisonerNoMemconList(params)

        if (response.code === 200) {
          this.talkRecords = response.data.records
          this.detailsPagination.total = response.data.total
        } else {
          ElMessage.error('获取谈话记录失败')
        }
      } catch (error) {
        ElMessage.error('获取谈话记录失败:', error)
      }
    },
    handleDetailsPageSizeChange(val) {
      this.detailsPagination.pageSize = val
      this.fetchTalkRecords()
    },
    handleDetailsPageChange(val) {
      this.detailsPagination.currentPage = val
      this.fetchTalkRecords()
    },
    viewTalkDetail(row) {
      // 实现查看单条谈话记录详情的逻辑
      if (!row || (!row.id && !row.memconId)) {
        ElMessage.error('无效的谈话记录!')
        return
      }
      // 使用 memconId 或 id，优先使用 memconId
      const talkId = row.memconId || row.id
      this.fetchTalkDetail(talkId)
    },
    async fetchTalkDetail(id) {
      try {
        if (!id) {
          ElMessage.error('无效的谈话记录ID!')
          return
        }

        const response = await getMemconInfo(id)
        if (response.code === 200) {
          this.talkDetailData = response.data

          // 解析谈话内容
          if (this.talkDetailData.conversation) {
            try {
              // 如果conversation是字符串，尝试解析为JSON
              if (typeof this.talkDetailData.conversation === 'string') {
                this.talkDetailData.conversationList = JSON.parse(this.talkDetailData.conversation)
              } else if (Array.isArray(this.talkDetailData.conversation)) {
                // 如果已经是数组，直接使用
                this.talkDetailData.conversationList = this.talkDetailData.conversation
              } else {
                this.talkDetailData.conversationList = []
              }
            } catch (error) {
              ElMessage.error('解析谈话内容失败!')
              this.talkDetailData.conversationList = []
            }
          } else {
            this.talkDetailData.conversationList = []
          }

          this.talkDetailDialogVisible = true
        } else {
          ElMessage.error(response.msg || '获取谈话详情失败!')
        }
      } catch (error) {
        ElMessage.error('获取谈话详情失败!')
      }
    },
    async handleFilePreview(type, path) {
      this.previewType = type

      switch (type) {
        case 'audio':
          this.filePreviewTitle = '音频预览'
          this.previewUrl = path
          this.filePreviewVisible = true
          break
        case 'video':
          this.filePreviewTitle = '视频预览'
          this.previewUrl = path
          this.filePreviewVisible = true
          break
      }
    },
    async handleFileDownload(path, recordNo) {
      try {
        this.textLoading = true
        // 下载文件
        const response = await fetch(path)
        if (!response.ok) {
          throw new Error('文件下载失败!')
        }
        // 获取文件blob
        const blob = await response.blob()
        // 创建下载链接
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = this.getWordFileName(recordNo, path)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        ElMessage.success('文件下载成功!')
      } catch (error) {
        ElMessage.error('文件下载失败!')
      } finally {
        this.textLoading = false
      }
    },
    getWordFileName(recordNo, path) {
      if (!path) return ''
      const extension = path.toLowerCase().endsWith('.docx') ? '.docx' : '.doc'
      return `${recordNo}${extension}`
    },
    formatMessageTime(time) {
      if (!time) return ''
      const date = new Date(time)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    highlightSensitiveWords(text) {
      if (!text) return text
      let highlightedText = text
      this.sensitiveWords.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi')
        highlightedText = highlightedText.replace(regex, '<span class="sensitive-word">$1</span>')
      })
      return highlightedText
    },
    handleSearchInput() {
      // 使用防抖搜索函数
      this.debouncedSearch()
    },
    setDefaultDateRange() {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
      this.dateRange = [firstDay, lastDay]
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

    async confirmStartTalk() {
      this.$refs.talkForm.validate(async(valid) => {
        if (valid) {
          try {
            const params = {
              prisonerName: this.talkForm.talkTarget,
              prisonerCode: this.talkForm.prisonerInfo.prisonerNo,
              policeName: this.talkForm.policeName,
              policeCode: store.userInfo?.oort_code,
              talkType: this.talkForm.talkType,
              theme: this.talkForm.theme,
              place: this.talkForm.place,
              escortPolice: this.talkForm.escortPolice,
              department: this.talkForm.department,
              departmentCode: this.talkForm.departmentCode,
              prisonerType: this.talkForm.prisonerInfo.prisonerType,
              createBy: store.userInfo?.oort_name || '',
              planId: this.talkForm.planId
            }

            // 调用开始谈话API
            const response = await startTalk(params)
            // 模拟API响应
            //  const response = { code: 200, data: '01d3402c595787ca5c498aca54243032' }

            if (response.code === 200) {
              ElMessage.success('开始谈话!')
              this.dialogVisible = false

              // 保存谈话ID
              this.currentTalkId = response.data
              // 确保currentTalkId已设置后再打开对话框
              // 使用setTimeout确保currentTalkId已完全设置
              setTimeout(() => {
                // 显示谈话会话对话框
                this.talkSessionDialogVisible = true
                // 开始计时
                this.startTimer()
              }, 0)

              // 刷新表格数据
              this.fetchTableData()
            } else {
              ElMessage.error('开始谈话失败！')
            }
          } catch (error) {
            ElMessage.error('开始谈话失败！')
          }
        }
      })
    },
    // 处理对话框关闭
    handleCloseDialog() {
      this.talkSessionDialogVisible = false

      // 停止计时器
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }

      // 延迟清除talkId，确保子组件有足够时间处理关闭事件
      setTimeout(() => {
        this.currentTalkId = ''
        // 刷新表格数据
        this.fetchTableData()
      }, 100)
    },
    // 开始计时器
    startTimer() {
      this.timer = setInterval(() => {
        this.talkSessionData.talkDuration++
      }, 1000)
    },
    // 格式化时间
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    },
    // 加载谈话模板
    async loadTalkTemplates() {
      try {
        // TODO: 调用API获取谈话模板
        this.talkSessionData.templates = [
          { id: 1, title: '入监教育模板' },
          { id: 2, title: '心理疏导模板' },
          { id: 3, title: '行为矫正模板' },
          { id: 4, title: '家庭关系修复模板' }
        ]
      } catch (error) {
        ElMessage.error('加载谈话模板失败')
      }
    },
    // 使用模板
    useTemplate(_template) {
      // TODO: 实现模板使用逻辑
      ElMessage.info('使用模板功能待实现')
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

        // 清除计时器
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }

        // 刷新表格数据
        this.fetchTableData()
      } catch (error) {
        ElMessage.error('结束谈话失败')
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
          this.departmentOptions = response.data.list.map(item => ({
            label: item.oort_dname,
            value: item.oort_dcode,
            code: item.oort_dcode,
            name: item.oort_dname
          }))
        } else {
          ElMessage.error(response?.msg || '获取部门列表失败')
          this.departmentOptions = []
        }
      } catch (err) {
        ElMessage.error('获取部门列表失败')
        this.departmentOptions = []
      }
    },
    handleDepartmentChange(value) {
      // 递归查找选中的部门
      const findDepartment = (departments, targetName) => {
        for (const dept of departments) {
          if (dept.name === targetName) {
            return dept
          }
          if (dept.children && dept.children.length > 0) {
            const found = findDepartment(dept.children, targetName)
            if (found) return found
          }
        }
        return null
      }

      const selectedDept = findDepartment(this.departmentOptions, value)
      if (selectedDept) {
        this.talkForm.departmentCode = selectedDept.code
      }
    },
    async fetchStatistics() {
      try {
        // Format dates to string
        const formatDate = (date) => {
          if (!date) return ''
          const d = new Date(date)
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          return `${year}-${month}-${day} 00:00:00`
        }

        const formatEndDate = (date) => {
          if (!date) return ''
          const d = new Date(date)
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          return `${year}-${month}-${day} 23:59:59`
        }

        const params = {
          oortDepcode: this.currentDeptCode || store.userInfo?.oort_depcode || '',
          talkTime: this.dateRange?.[0] ? formatDate(this.dateRange[0]) : '',
          talkTimeOver: this.dateRange?.[1] ? formatEndDate(this.dateRange[1]) : ''
        }

        const response = await getPoliceConversationStatistics(params)
        if (response.code === 200 && response.data) {
          this.stats = {
            yt: response.data.value1 || 0,
            zfyt: response.data.value2 || 0
          }
        } else {
          ElMessage.error(response?.msg || '获取统计数据失败')
        }
      } catch (err) {
        ElMessage.error('获取统计数据失败')
      }
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

.talk-session-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;

  .talk-info {
    padding: 16px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .prisoner-info {
      display: flex;
      align-items: center;
      gap: 16px;

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .info-text {
        flex: 1;

        h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .code {
          margin: 4px 0 0;
          font-size: 14px;
          color: #666;
        }
      }

      .talk-count {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .talk-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    .message-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message-item {
      display: flex;
      gap: 12px;
      max-width: 80%;

      &.police {
        align-self: flex-start;
      }

      &.prisoner {
        align-self: flex-end;
        flex-direction: row-reverse;

        .message-content {
          align-items: flex-end;
        }
      }

      .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .message-content {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .message-name {
          font-size: 12px;
          color: #999;
        }

        .message-text {
          padding: 8px 12px;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .message-time {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  .template-area {
    padding: 16px;
    background-color: #fff;
    border-top: 1px solid #eee;

    .template-list {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 8px;

      &::-webkit-scrollbar {
        height: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 2px;
      }
    }

    .template-item {
      padding: 8px 16px;
      background-color: #f5f7fa;
      border-radius: 16px;
      white-space: nowrap;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #e6f1fc;
      }
    }
  }

  .bottom-bar {
    padding: 16px;
    background-color: #fff;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .talk-status {
      display: flex;
      align-items: center;
      gap: 16px;

      .timer {
        font-size: 14px;
        color: #666;
      }

      .recording-status {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #f56c6c;
        font-size: 14px;

        i {
          font-size: 16px;
        }
      }
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
  .policeName-info {
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

// 谈话详情弹窗样式
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

      .label {
        color: #666;
        margin-left: 10px;
      }
    }
  }

  .effect-content {
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
    min-height: 100px;
    line-height: 1.5;
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

.talkFilesMana {
  justify-content: space-between;
}
</style>
