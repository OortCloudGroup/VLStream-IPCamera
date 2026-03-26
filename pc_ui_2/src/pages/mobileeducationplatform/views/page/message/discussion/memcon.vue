<template>
  <div class="memcon-container">
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
          </div>
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
          </div>
        </div>

        <!-- 表格区域 -->
        <el-table :data="tableData" style="width: 100%">
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
          <el-table-column label="操作" width="280" align="center">
            <template #default="{ row }">
              <el-button type="primary" plain size="small" @click="handleViewDetails(row)">
                查看详情
              </el-button>
              <el-button
                v-if="row.status === 2"
                type="warning"
                plain
                size="small"
                @click="handleEndTalk(row)"
              >
                结束谈话
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

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="'谈话详情'"
      width="1000px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @closed="handleDialogClosed"
    >
      <div v-if="detailData" class="dialog-content">
        <div class="basic-info">
          <div class="info-header">
            <div class="prisoner-avatar">
              <!-- <el-avatar :size="80" :src="detailData.prisonerImg" /> -->
              <img style="width:100px; border-radius:50% ;" :src="detailData.prisonerImg" />
            </div>
            <div class="prisoner-basic">
              <div class="name-code">
                <span class="name">{{ detailData.prisonerName }}</span>
                <span class="code">编号：{{ detailData.prisonerCode }}</span>
              </div>
              <div class="other-info">
                <span>年龄：{{ detailData.prisonerAge }}岁</span>
                <span>性别：{{ detailData.sex }}</span>
              </div>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">监狱监区监室：</span>
              <span>{{ detailData.prisonAreaSummary }}</span>
            </div>
            <div class="info-item">
              <span class="label">谈话民警：</span>
              <span>{{ detailData.policeName }} ({{ detailData.policeCode }})</span>
            </div>
            <div class="info-item">
              <span class="label">谈话类别：</span>
              <span>{{ detailData.talkTypeName }}</span>
            </div>
            <div class="info-item">
              <span class="label">谈话主题：</span>
              <span>{{ detailData.theme }}</span>
            </div>
          </div>
        </div>
        <div class="talk-effect">
          <div class="section-title">
            谈话内容摘要
          </div>
          <div class="message-list">
            <div v-if="!detailData.audioText" class="empty-message">
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
              v-for="(message, index) in detailData.conversationList"
              v-else
              :key="index"
              class="message-item"
              :class="{ police: message.role === 'police' }"
            >
              <div class="message-avatar">
                <img
                  :src="message.role === 'police' ? policeAvatar : (detailData.prisonerImg || defaultAvatar)"
                  :alt="message.role"
                />
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-name">{{ message.role === 'police' ? '民警' + detailData.policeName :
                    detailData.prisonerName }}</span>
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
            v-if="detailData.audioPath || detailData.videoPath || detailData.textPath"
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
                v-if="detailData.audioPath"
                class="file-item"
                @click="handleFilePreview('audio', detailData.audioPath)"
              >
                <span class="file-icon"><i class="el-icon-headset" /></span>
                <span class="file-name">{{ detailData.recordNo }}.mp3</span>
              </div>
              <div
                v-if="detailData.videoPath"
                class="file-item"
                @click="handleFilePreview('video', detailData.videoPath)"
              >
                <span class="file-icon"><i class="el-icon-video-camera" /></span>
                <span class="file-name">{{ detailData.recordNo }}.mp4</span>
              </div>
              <div
                v-if="detailData.textPath"
                class="file-item"
                @click="handleFileDownload(detailData.textPath, detailData.recordNo)"
              >
                <span class="file-icon"><i class="el-icon-document" /></span>
                <span class="file-name">{{ getWordFileName(detailData.recordNo, detailData.textPath) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="talk-time">
          <div class="section-title">
            谈话时间
          </div>
          <div class="time-picker-container">
            <span>{{ detailData.talkTime }} 至 {{ detailData.talkTimeOver }}</span>
            <span class="label">谈话时长：</span> <span>{{ formatDuration(detailData.duration || 0) }}</span>
          </div>
        </div>

        <div class="talk-effect">
          <div class="section-title">
            谈话效果
          </div>
          <div class="effect-input-container">
            <el-input
              v-model="detailData.talkEffect"
              type="textarea"
              :rows="4"
              placeholder="请输入谈话效果"
              class="effect-content"
            />
            <div class="template-list">
              <div v-for="template in templates" :key="template" class="template-item" @click="inputTemplate(template)">
                {{ template }}
              </div>
            </div>
            <div class="word-count">
              {{ detailData.talkEffect ? detailData.talkEffect.length : 0 }}字
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <el-button
            type="primary"
            :loading="saveLoading"
            @click="isEndTalkMode ? handleEndTalkConfirm() : handleSave()"
          >
            {{ isEndTalkMode ? '结束谈话' : '保 存' }}
          </el-button>
          <el-button @click="dialogVisible = false">
            取 消
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 结束谈话确认对话框 -->
    <el-dialog
      v-model="endTalkConfirmVisible"
      title="确认结束谈话"
      width="35%"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="end-talk-confirm">
        <p>确定要结束本次谈话吗？</p>
        <p class="warning">
          结束后将无法继续修改谈话内容！
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="endTalkLoading"
            @click="handleEndTalkSubmit"
          >
            确认结束
          </el-button>
          <el-button @click="endTalkConfirmVisible = false">
            继续谈话
          </el-button>
        </span>
      </template>
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
import { getCaseTypes, getMemconList, getMemconInfo, updateMemcon, deptList, abnormalConversation } from '@/api/mobileeducationplatform/case'
import defaultAvatar from '@/assets/img/default_pic.png'
const store = useUserStore()
import { ElMessage } from 'element-plus'
// 添加敏感词列表
const sensitiveWords = [
  '暴动', '越狱', '逃跑', '自杀', '自残', '斗殴', '打架', '闹事', '暴乱'
]

export default {
  name: 'Memcon',
  data() {
    return {
      searchText: '',
      deptTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filters: {
        status: '',
        talkType: '',
        prisonerType: '',
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
      prisonerTypes: [],
      dialogVisible: false,
      detailData: null,
      filePreviewVisible: false,
      filePreviewTitle: '',
      previewType: '',
      previewUrl: '',
      textLoading: false,
      saveLoading: false,
      defaultAvatar,
      policeAvatar: defaultAvatar,
      currentPoliceCode: store.userInfo?.oort_polcode || '',
      isEndTalkMode: false,
      endTalkConfirmVisible: false,
      endTalkLoading: false,
      currentEndTalkRow: null
    }
  },
  created() {
    this.initData()
    this.debouncedSearch = debounce(this.fetchDeptList, 500)
    this.fetchTalkTypes()
    this.fetchPrisonerTypes()
    this.setDefaultDateRange()
  },
  methods: {
    // 谈话文件管理-跳转百度网盘
    talkFilesManaFn() {
      this.$router.push('/audioManage')

      // let url = Config.URL.slice(0, -1) +
      //   Config.frontURLStr +
      //   '/oortcloud-policefront/userservice_manage/index.html?accessToken=' +
      //   store.userInfo.accessToken
      // window.open(url, '_blank')
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
    async initData() {
      try {
        await this.fetchDeptList()
        await this.fetchTableData()
      } catch (err) {
        ElMessage.error('初始化数据失败')
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
          this.$message.error('获取组织架构失败')
          this.deptTreeData = []
        }
      } catch (err) {
        ElMessage.error('获取组织架构失败')
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
        children: []
      }))
    },
    handleNodeClick(data) {
      const deptCode = data.id
      this.fetchChildDepartments(deptCode)
      this.currentDeptCode = deptCode
      this.currentDeptName = data.label
      this.fetchTableData(deptCode)
    },
    async fetchChildDepartments(deptCode) {
      try {
        const params = {
          accessToken: store.token || '',
          oort_pdcode: deptCode,
          page: 1,
          pagesize: 10,
          isdel: 1
        }

        const response = await deptList(params)
        if (response && response.code === 200 && response.data) {
          const updateNode = (nodes) => {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id === deptCode) {
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

          updateNode(this.deptTreeData)

          if (this.searchText) {
            this.$nextTick(() => {
              const tree = this.$refs.deptTree
              if (tree) {
                tree.expand(deptCode)
              }
            })
          }
        } else {
          this.$message.error('获取子部门失败')
        }
      } catch (err) {
        ElMessage.error('获取子部门失败')
      }
    },

    async fetchTableData(deptId) {
      try {
        const params = {
          current: this.pagination.currentPage,
          size: this.pagination.pageSize,
          prisonerName: this.filters.prisonerName || '',
          prisonerCode: this.filters.prisonerNo || '',
          policeName: this.filters.policeName || '',
          policeCode: this.filters.policeNo || '',
          prisonerType: this.filters.prisonerType || '',
          talkType: this.filters.talkType || '',
          status: this.filters.status || '',
          departmentCode: deptId || this.currentDeptCode || store.userInfo?.oort_depcode || '',
          department: this.currentDeptName || ''
        }

        if (this.dateRange && this.dateRange.length === 2) {
          const formatDate = (date) => {
            if (!date) return ''
            const d = new Date(date)
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            const hours = String(d.getHours()).padStart(2, '0')
            const minutes = String(d.getMinutes()).padStart(2, '0')
            const seconds = String(d.getSeconds()).padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
          }

          params.talkTime = formatDate(this.dateRange[0])
          params.talkTimeOver = formatDate(this.dateRange[1])
        }

        const response = await getMemconList(params)
        if (response.code === 200) {
          if (response.data && Array.isArray(response.data.records)) {
            this.tableData = response.data.records.map(record => ({
              id: record.id || '',
              recordNo: record.recordNo || '',
              prisonerName: record.prisonerName || '',
              prisonerCode: record.prisonerCode || '',
              prisonerImg: record.prisonerImg || '',
              sex: record.sex || '',
              ethnicity: record.ethnicity || '',
              crime: record.crime || '',
              remainingSentence: record.remainingSentence || '',
              treatmentLevel: record.treatmentLevel || '',
              prisonName: record.prisonName || '',
              prisonArea: record.prisonArea || '',
              cellNumber: record.cellNumber || '',
              policeName: record.policeName || '',
              policeCode: record.policeCode || '',
              talkType: record.talkType || '',
              talkTypeName: record.talkTypeName || '',
              conversation: record.conversation || '',
              theme: record.theme || '',
              place: record.place || '',
              talkTime: record.talkTime || null,
              talkTimeOver: record.talkTimeOver || null,
              duration: record.duration || 0,
              escortPolice: record.escortPolice || '',
              escortPoliceCode: record.escortPoliceCode || '',
              departmentCode: record.departmentCode || '',
              department: record.department || '',
              prisonerType: record.prisonerType || '',
              prisonerTypeName: record.prisonerTypeName || '',
              status: record.status || 0,
              prisonerAge: record.prisonerAge || 0,
              planId: record.planId || null,
              audioPath: record.audioPath || '',
              videoPath: record.videoPath || '',
              textPath: record.textPath || '',
              talkEffect: record.talkEffect || '',
              prisonerSummary: record.prisonerSummary || '',
              talkSummary: record.talkSummary || '',
              statusDescription: record.statusDescription || '',
              formattedTalkTime: record.formattedTalkTime || '',
              formattedTalkTimeOver: record.formattedTalkTimeOver || '',
              prisonAreaSummary: record.prisonAreaSummary || '',
              completedTalks: record.completedTalks || 0
            }))

            this.pagination.total = response.data.total || 0
          } else {
            ElMessage.error('API返回的数据格式不正确')
            this.tableData = []
          }
        } else {
          this.$message.error('获取谈话记录失败')
          this.tableData = []
        }
      } catch (err) {
        ElMessage.error('获取谈话记录失败')
        this.tableData = []
      }
    },
    handleSearch() {
      this.pagination.currentPage = 1
      this.fetchTableData()
    },
    handleReset() {
      this.filters = {
        status: '',
        talkType: '',
        prisonerType: '',
        prisonerName: '',
        prisonerNo: '',
        policeName: '',
        policeNo: ''
      }
      this.dateRange = []
      this.pagination.currentPage = 1
      this.fetchTableData()
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchTableData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchTableData()
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
    getStatusText(status) {
      const texts = {
        1: '待谈话',
        2: '谈话中',
        3: '已逾期',
        4: '已谈话'
      }
      return texts[status] || '未知状态'
    },
    async handleViewDetails(row) {
      try {
        const response = await getMemconInfo(row.id)
        if (response.code === 200) {
          this.detailData = response.data

          // 解析谈话内容
          if (this.detailData.conversation) {
            try {
              // 如果conversation是字符串，尝试解析为JSON
              if (typeof this.detailData.conversation === 'string') {
                this.detailData.conversationList = JSON.parse(this.detailData.conversation)
              } else if (Array.isArray(this.detailData.conversation)) {
                // 如果已经是数组，直接使用
                this.detailData.conversationList = this.detailData.conversation
              } else {
                this.detailData.conversationList = []
              }
            } catch (error) {
              ElMessage.error('解析谈话内容失败')
              this.detailData.conversationList = []
            }
          } else {
            this.detailData.conversationList = []
          }

          this.dialogVisible = true
        } else {
          ElMessage.error('获取详情失败')
        }
      } catch (error) {
        ElMessage.error('获取详情失败')
      }
    },
    handleSearchInput() {
      this.debouncedSearch()
    },
    async fetchTalkTypes() {
      try {
        const res = await getCaseTypes('1000')
        if (res.code === 200) {
          this.talkTypes = res.data
          this.filters.type = ''
        } else {
          ElMessage.error('获取谈话类型失败')
        }
      } catch (error) {
        ElMessage.error('获取谈话类型失败')
      }
    },
    async fetchPrisonerTypes() {
      try {
        const res = await getCaseTypes('3000')
        if (res.code === 200) {
          this.prisonerTypes = res.data
        } else {
          ElMessage.error('获取罪犯类型失败')
        }
      } catch (error) {
        ElMessage.error('获取罪犯类型失败')
      }
    },
    setDefaultDateRange() {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
      this.dateRange = [firstDay, lastDay]
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
          throw new Error('文件下载失败')
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

        ElMessage.success('文件下载成功')
      } catch (error) {
        ElMessage.error('文件下载失败')
      } finally {
        this.textLoading = false
      }
    },
    getWordFileName(recordNo, path) {
      if (!path) return ''
      const extension = path.toLowerCase().endsWith('.docx') ? '.docx' : '.doc'
      return `${recordNo}${extension}`
    },
    handleTalkTimeChange(value) {
      if (value && this.detailData.talkTimeOver) {
        const startTime = new Date(value)
        const endTime = new Date(this.detailData.talkTimeOver)
        if (startTime > endTime) {
          ElMessage.warning('开始时间不能大于结束时间')
          this.detailData.talkTime = ''
          return
        }
      }
      // 这里可以添加更新时间的接口调用
    },
    handleTalkTimeOverChange(value) {
      if (value && this.detailData.talkTime) {
        const startTime = new Date(this.detailData.talkTime)
        const endTime = new Date(value)
        if (endTime < startTime) {
          ElMessage.warning('结束时间不能小于开始时间')
          this.detailData.talkTimeOver = ''
          return
        }
      }
      // 这里可以添加更新时间的接口调用
    },
    async handleSave() {
      // 校验谈话效果字数
      if (!this.detailData.talkEffect || this.detailData.talkEffect.trim().length < 20) {
        ElMessage.warning('谈话效果内容不能少于20字！')
        return
      }

      this.saveLoading = true
      try {
        const params = {
          id: this.detailData.id,
          updateBy: store.userInfo?.oort_name || '',
          talkEffect: this.detailData.talkEffect
        }

        const res = await updateMemcon(params)
        if (res.code === 200) {
          ElMessage.success('保存成功！')
          this.dialogVisible = false
          this.fetchTableData() // 刷新列表
        } else {
          ElMessage.error('保存失败')
        }
      } catch (error) {
        ElMessage.error('保存失败')
      } finally {
        this.saveLoading = false
      }
    },
    // 组件销毁时清理blob URL
    beforeDestroy() {
      if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.previewUrl)
      }
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
      sensitiveWords.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi')
        highlightedText = highlightedText.replace(regex, '<span class="sensitive-word">$1</span>')
      })
      return highlightedText
    },
    async handleEndTalk(row) {
      // 异常谈话结束校验是否有职务谈话人记录，没有则需本人进行结束谈话  store.userInfo.oort_code
      try {
        // 异常结束校验
        const params = {
          conversationID: row.id,
          userName: store.userInfo?.oort_name,
          policeCode: store.userInfo?.oort_code
        }
        const response = await abnormalConversation(params)
        if (response.code === 200) {
          if (!response.data) {
            ElMessage.warning('您不是当前谈话记录的谈话民警、职务谈话民警！请联系对应民警进行结束谈话！')
            return
          } else {
            // 校验通过，弹出罪犯详情页面
            this.isEndTalkMode = true
            this.currentEndTalkRow = row
            this.handleViewDetails(row)
          }
        }
      } catch (error) {
        ElMessage.error('校验失败，请稍后重试')
        return
      }
    },
    handleEndTalkConfirm() {
      this.endTalkConfirmVisible = true
    },
    async handleEndTalkSubmit() {
      // 校验谈话效果字数
      if (!this.detailData.talkEffect || this.detailData.talkEffect.trim().length < 20) {
        ElMessage.warning('谈话效果内容不能少于20字！')
        return
      }

      this.endTalkLoading = true
      try {
        // 结束谈话
        const params = {
          id: this.detailData.id,
          updateBy: store.userInfo?.oort_name || '',
          status: 4,
          talkEffect: this.detailData.talkEffect
        }
        const response = await updateMemcon(params)
        if (response.code === 200) {
          ElMessage.success('谈话已结束')
          this.endTalkConfirmVisible = false
          this.dialogVisible = false
          this.fetchTableData() // 刷新列表
        } else {
          throw new Error(response.msg || '结束谈话失败')
        }
      } catch (error) {
        ElMessage.error(error.message || '结束谈话失败')
      } finally {
        this.endTalkLoading = false
      }
    },
    handleDialogClosed() {
      // 清理对话框状态
      this.isEndTalkMode = false
      this.currentEndTalkRow = null
      this.endTalkConfirmVisible = false
    }
  }
}
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
      flex-direction: row;
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

.talkFilesMana {
  justify-content: space-between;
}
</style>
