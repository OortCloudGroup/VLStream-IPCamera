<template>
  <div class="audio-manage-container">
    <!-- 主要内容区域 -->
    <div class="main-wrapper">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <div class="nav-item" :class="{ active: currentTab === 'recent' }" @click="switchTab('recent')">
          <el-icon><house /></el-icon>
          <span>最近文件</span>
        </div>
        <div class="nav-item" :class="{ active: currentTab === 'my' }" @click="switchTab('my')">
          <el-icon><folder /></el-icon>
          <span>我的文件</span>
        </div>
        <div class="nav-item" :class="{ active: currentTab === 'favorite' }" @click="switchTab('favorite')">
          <el-icon><star /></el-icon>
          <span>收藏文件</span>
        </div>
        <div class="nav-item" :class="{ active: currentTab === 'trash' }" @click="switchTab('trash')">
          <el-icon><delete /></el-icon>
          <span>回收站</span>
        </div>
      </div>

      <div class="right_panel">
        <!-- 主内容区 -->
        <div class="main-content">
          <!-- 顶部操作区 -->
          <div class="header-actions">
            <div class="left-actions">
              <el-button type="primary" class="record-btn" @click="recordDialogVisible = true">
                <el-icon><microphone-icon /></el-icon>
                开始录音
              </el-button>
              <el-button class="import-btn" @click="dialogVisible = true">
                <el-icon><upload-icon /></el-icon>
                导入文件
              </el-button>
            </div>
          </div>

          <!-- 文件列表 -->
          <div class="file-list">
            <!-- 列表头部 -->
            <div class="list-header">
              <div class="header-left">
                <el-checkbox v-model="selectAll" @change="handleSelectAll" />
                <span class="file-type">全部文件</span>
              </div>
              <div class="header-right" />
            </div>

            <!-- 文件项列表 -->
            <div v-loading="loading" class="file-items">
              <div
                v-for="file in files"
                :key="file.id"
                class="file-item"
                :class="{ selected: file.selected, editing: file.editing }"
                @click="selectFile(file)"
              >
                <div class="item-left">
                  <el-checkbox v-model="file.selected" @click.stop />
                  <div class="file-info">
                    <div class="title-row">
                      <div v-if="!file.editing" class="file-title">
                        {{ file.name }}
                      </div>
                      <el-input
                        v-else
                        v-model="file.editName"
                        class="edit-input"
                        @blur="saveEdit(file)"
                        @keyup.enter="saveEdit(file)"
                        @click.stop
                      />
                      <el-icon v-if="!file.editing" class="edit-icon" @click.stop="startEdit(file)">
                        <edit />
                      </el-icon>
                    </div>
                    <div class="file-tags">
                      <el-tag v-for="tag in file.tags" :key="tag" size="small" class="tag">
                        {{ tag }}
                      </el-tag>
                    </div>
                    <div class="file-description">
                      {{ file.description }}
                    </div>
                  </div>
                </div>
                <div class="item-right">
                  <span class="operation-time">{{ file.operationTime }}</span>
                  <span class="duration">{{ formatTime(file.duration) }}</span>
                  <div class="actions">
                    <!-- 操作按钮  回收站不显示收藏和下载-->
                    <el-button-group class="action-buttons">
                      <el-button v-if="currentTab !== 'trash' " size="large" @click.stop="toggleFavorite(file)">
                        <el-icon class="file_opr_icon">
                          <star :color="file.isFavorite || currentTab === 'favorite' ? 'green' : 'gray'" />
                        </el-icon>
                      </el-button>
                      <el-button v-if="currentTab !== 'trash'" size="large" @click.stop="downloadFile(file)">
                        <el-icon class="file_opr_icon">
                          <download-icon />
                        </el-icon>
                      </el-button>
                      <!-- 我的收藏里面 不显示删除tab -->
                      <el-button v-if="currentTab !== 'favorite'" size="large" @click.stop="deleteFile(file)">
                        <el-icon class="file_opr_icon">
                          <delete />
                        </el-icon>
                      </el-button>
                    </el-button-group>
                  </div>
                </div>
              </div>
              <!-- 空状态 -->
              <div v-if="!loading && files.length === 0" class="empty-state">
                <el-empty description="暂无文件数据" />
              </div>
            </div>

            <!-- 分页组件 -->
            <div v-if="pagination.total > 0 && currentTab !== 'recent'" class="pagination-wrapper">
              <el-pagination
                v-model:current-page="pagination.current"
                v-model:page-size="pagination.size"
                :page-sizes="[10, 20, 50, 100]"
                :small="false"
                :total="pagination.total"
                background
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </div>
        <!-- 底部播放控制栏 -->
        <div v-if="selectedFiles.length > 0" class="bottom-player">
          <div class="player-info">
            <span>({{ selectedFiles.length }}个文件选中)</span>
          </div>
          <div class="player-actions">
            <el-button size="small" @click="deleteSelected">
              <el-icon><delete /></el-icon>
              删除
            </el-button>
            <el-button size="small" @click="cancelSelection">
              <el-icon><close-icon /></el-icon>
              取消
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="导入文件" width="50%">
      <importFile v-if="dialogVisible" @close="closeDialog" />
    </el-dialog>
    <!-- 开始录音的弹框 -->
    <el-dialog v-model="recordDialogVisible" title="开始录音" width="50%">
      <audioRecord v-if="recordDialogVisible" @close="closeDialog" />
    </el-dialog>
    <!-- 下载的预览 -->
    <el-dialog v-model="downloadDialogVisible" title="下载" width="50%" :before-close="closeDialog">
      <downLoadPreDia v-if="downloadDialogVisible" :file-data="currentFile" @close="closeDialog" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Microphone as MicrophoneIcon,
  Upload as UploadIcon,
  House,
  Folder,
  Star,
  Delete,
  Download as DownloadIcon,
  Close as CloseIcon,
  Edit
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import importFile from './importFile.vue'
import audioRecord from './audioRecord.vue'
import downLoadPreDia from './downLoadPreDia.vue'
// 响应式数据
const selectAll = ref(false)
const files = ref([])
const dialogVisible = ref(false)
const recordDialogVisible = ref(false)
const currentTab = ref('recent')

const switchTab = (tab) => {
  currentTab.value = tab
  initData()
}

const closeDialog = () => {
  dialogVisible.value = false
  recordDialogVisible.value = false
  downloadDialogVisible.value = false
  initData()
}

// 分页相关数据
const pagination = ref({
  current: 1,
  size: 10,
  total: 0,
  pages: 0
})

// 时间格式化
const formatTime = (sec) => {
  if (!sec) return '0:00'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// 加载状态
const loading = ref(false)

const selectedFiles = computed(() => {
  return files.value.filter(file => file.selected)
})

import { useUserStore } from '@/store/modules/user'
import { getFileList, removeFile, myFavoriteList } from '@/api/mobileeducationplatform/case'
const store = useUserStore()
// 初始化数据
const initData = async() => {
  try {
    loading.value = true
    const params = {
      accessToken: store.token,
      current: pagination.value.current,
      size: pagination.value.size
    }

    let res = null
    if (currentTab.value === 'favorite') {
      params.userId = store.userInfo.oort_uuid
      res = await myFavoriteList(params)
    } else {
      if (currentTab.value === 'recent') {
        params.fileStatus = 'NORMAL'
      } else if (currentTab.value === 'my') {
        params.fileStatus = 'NORMAL'
      } else if (currentTab.value === 'trash') {
        params.fileStatus = 'RECYCLE'
      }
      res = await getFileList(params)
    }
    if (res.code === 200) {
      // 更新分页信息
      pagination.value = {
        current: res.data.current,
        size: res.data.size,
        total: res.data.total,
        pages: res.data.pages
      }

      // 转换后台数据为前端显示格式
      files.value = res.data.records.map((record) => {
        return {
          id: record.id.toString(),
          name: record.title || '未命名文件',
          tags: [], // 可以根据需要从其他字段解析标签
          description: record.content || record.recognizedContent || '暂无描述',
          operationTime: record.createTime || formatDateTime(new Date()), // 可以添加创建时间字段
          duration: record.duration || '00:00',
          status: mapFileStatus(record.fileStatus),
          selected: false,
          editing: false,
          isFavorite: record.favorite,
          // 保存后台原始数据
          tenantId: record.tenantId,
          memconId: record.memconId,
          content: record.content,
          word: record.word,
          filePath: record.filePath,
          recognizedContent: record.recognizedContent,
          recognizedFilePath: record.recognizedFilePath,
          fileStatus: record.fileStatus
        }
      })
    } else {
      ElMessage.error(res.msg || '获取文件列表失败')
      files.value = []
    }
  } catch (error) {
    console.error('获取文件列表失败:', error)
    ElMessage.error('获取文件列表失败，请重试')
    files.value = []
  } finally {
    loading.value = false
  }
}

// 格式化日期时间
const formatDateTime = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 映射文件状态
const mapFileStatus = (fileStatus) => {
  switch (fileStatus) {
    case 'SUCCESS':
    case 'COMPLETED':
    case '1':
      return 'success'
    case 'ERROR':
    case 'FAILED':
    case '0':
      return 'error'
    case 'PROCESSING':
    case 'PENDING':
    case '2':
      return 'warning'
    default:
      return ''
  }
}

// 分页改变处理
const handlePageChange = (page) => {
  pagination.value.current = page
  initData()
}

// 每页大小改变处理
const handleSizeChange = (size) => {
  pagination.value.size = size
  pagination.value.current = 1
  initData()
}

// 方法
const handleSelectAll = () => {
  files.value.forEach(file => {
    file.selected = selectAll.value
  })
}

const selectFile = (file) => {
  if (!file.editing) {
    file.selected = !file.selected
  }
}

const startEdit = (file) => {
  file.editing = true
  file.editName = file.name
}

const saveEdit = (file) => {
  if (file.editName && file.editName.trim()) {
    file.name = file.editName.trim()
  }
  file.editing = false
  file.editName = ''
}

import { myFavoriteRemove, myFavoriteSave } from '@/api/mobileeducationplatform/case'
const toggleFavorite = async(file) => {
  file.isFavorite = !file.isFavorite

  const params = {
    accessToken: store.token

  }
  let res = null
  if (file.isFavorite && currentTab.value !== 'favorite') {
    params.userId = store.userInfo.oort_uuid
    params.fileId = file.id
    res = await myFavoriteSave(params)
  } else {
    params.ids = [file.id].join(',')
    res = await myFavoriteRemove(params)
  }

  if (res.code === 200) {
    ElMessage.success((file.isFavorite && currentTab.value !== 'favorite') ? '已添加到收藏' : '已取消收藏')
    initData()
  }
}

const downloadDialogVisible = ref(false)
const currentFile = ref(null)
const downloadFile = (file) => {
  downloadDialogVisible.value = true
  currentFile.value = file
//   window.open(file.filePath, '_blank')
}

const deleteFile = async(file) => {
  // 如果是回收站 就彻底删除 添加参数 isRemove = true ,否则就是 false
  // 提示内容区分
  let message = ''
  if (currentTab.value === 'trash') {
    message = `确定要彻底删除文件"${file.name}"吗？`
  } else {
    message = `确定要删除文件"${file.name}"吗？`
  }
  try {
    await ElMessageBox.confirm(
      message,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 调用后台API删除文件，使用ids参数（逗号分割的字符串）
    const params = {
      accessToken: store.token,
      ids: file.id // 单个文件删除时，ids参数为单个ID
    }
    params.isRemove = currentTab.value === 'trash'

    const res = await removeFile(params)

    if (res.code === 200) {
      ElMessage.success('删除成功')
      // 重新加载数据
      await initData()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文件失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

const deleteSelected = async() => {
  // 如果是回收站 就彻底删除 添加参数 isRemove = true ,否则就是 false
  // 提示内容区分
  let message = ''
  if (currentTab.value === 'trash') {
    message = `确定要彻底删除选中的${selectedFiles.value.length}个文件吗？`
  } else {
    message = `确定要删除选中的${selectedFiles.value.length}个文件吗？`
  }
  try {
    await ElMessageBox.confirm(
      message,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // 批量删除文件，使用一次接口调用
    const selectedIds = selectedFiles.value.map(file => file.id)
    const params = {
      accessToken: store.token,
      ids: selectedIds.join(',') // 将ID数组转为逗号分割的字符串
    }
    params.isRemove = currentTab.value === 'trash'
    const res = await removeFile(params)
    if (res.code === 200) {
      ElMessage.success(`成功删除${selectedFiles.value.length}个文件`)
    } else {
      ElMessage.error(res.msg || '批量删除失败')
    }

    // 重新加载数据
    await initData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败，请重试')
    }
  }
}

const cancelSelection = () => {
  files.value.forEach(file => {
    file.selected = false
  })
  selectAll.value = false
}

// 生命周期
onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">

.right_panel {
    flex: 1;
    height: 100%;
    border-left: 1px solid #e4e7ed;
    padding: 20px;
    box-sizing: border-box;
}

.audio-manage-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;

  .main-wrapper {
    flex: 1;
    display: flex;
    min-height: 0;

    .sidebar {
      width: 200px;
      background-color: #fff;
      border-right: 1px solid #e4e7ed;
      padding: 20px 0;
      flex-shrink: 0;

      .nav-item {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        cursor: pointer;
        color: #606266;
        transition: all 0.3s;

        &:hover {
          background-color: #f5f7fa;
          color: #409eff;
        }

        &.active {
          background-color: #ecf5ff;
          color: #409eff;
          border-right: 2px solid #409eff;
        }

        .el-icon {
          margin-right: 8px;
          font-size: 16px;
        }
      }
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      .header-actions {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        flex-shrink: 0;

        .left-actions {
          display: flex;
          gap: 12px;

          .record-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 20px;
            padding: 8px 16px;
          }

          .import-btn {
            border-radius: 20px;
            padding: 8px 16px;
          }
        }
      }

      .file-list {
        flex: 1;
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 0;

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #e4e7ed;

          .header-left {
            display: flex;
            align-items: center;
            gap: 12px;

            .file-type {
              color: #409eff;
              font-weight: 500;
            }
          }

          .header-right {
            display: flex;
            gap: 80px;

            .col-header {
              color: #909399;
              font-size: 14px;
            }
          }
        }

        .file-items {
            padding: 12px 0;
          flex: 1;
          overflow-y: auto;

          .file-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 16px 20px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: all 0.3s;
            border: 2px solid transparent;
            margin: 2px 8px;
            &:hover {
              background-color: #f8f9fa;
              .edit-icon {
                opacity: 1;
              }
            }

            &.selected {
              background-color: #f0f9ff;
              border: 1px solid var(--el-color-primary);
              border-radius: 12px;
              position: relative;

              &::before {
                content: '';
                position: absolute;
                left: -2px;
                top: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                border-radius: 12px;
                z-index: -1;
              }
            }

            &.editing {
              background-color: #fff9e6;
            }

            .item-left {
              display: flex;
              align-items: flex-start;
              gap: 12px;
              flex: 1;

              .file-info {
                flex: 1;

                .title-row {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: 8px;

                  .file-title {
                    font-size: 16px;
                    font-weight: 500;
                    color: #303133;
                    flex: 1;
                  }

                  .edit-icon {
                    font-size: 14px;
                    color: #409eff;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.3s;

                    &:hover {
                      color: #337ecc;
                    }
                  }
                }

                .edit-input {
                  margin-bottom: 8px;
                }

                .file-tags {
                  display: flex;
                  gap: 6px;
                  margin-bottom: 8px;
                  flex-wrap: wrap;

                  .tag {
                    font-size: 12px;
                  }
                }

                .file-description {
                  color: #909399;
                  font-size: 14px;
                  line-height: 1.5;
                  min-height: 30px;
                  // 最多两行 超出就省略号
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
              }
            }

            .item-right {
              display: flex;
              align-items: center;
              gap: 80px;

              .operation-time,
              .duration {
                color: #909399;
                font-size: 14px;
                min-width: 120px;
              }

              .actions {
                display: flex;
                align-items: center;
                gap: 8px;

                .status-icon {
                  font-size: 16px;

                  &.success {
                    color: #67c23a;
                  }

                  &.error {
                    color: #f56c6c;
                  }

                  &.warning {
                    color: #e6a23c;
                  }
                }

                .action-buttons {
                  .el-button {
                    border: none;
                    background: transparent;
                    color: #909399;
                    padding: 4px;

                    &:hover {
                      color: #409eff;
                      background-color: #ecf5ff;
                    }
                  }
                }
              }
            }
          }

          .empty-state {
            padding: 40px 20px;
            text-align: center;
          }
        }

        .pagination-wrapper {
          padding: 20px;
          border-top: 1px solid #e4e7ed;
          background-color: #fff;
          display: flex;
          justify-content: center;
        }
      }
    }
  }

  .bottom-player {
    height: 60px;
    background-color: #fff;
    border-top: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    flex-shrink: 0;
    margin-top: 20px;

    .player-info {
      color: #909399;
      font-size: 14px;
    }

    .player-actions {
      display: flex;
      gap: 12px;

      .el-button {
        border-radius: 16px;
      }
    }
  }

  .file_opr_icon {
        font-size: 20px;
        margin: 0 4px;
    }

}

</style>
