<template>
  <div class="import-file-dialog">
    <!-- 主要内容区域 -->
    <div class="dialog-content">
      <!-- 左侧上传区域 -->
      <div class="upload-section">
        <!-- 拖拽上传区域 -->
        <div
          class="upload-area"
          :class="{ 'drag-over': isDragOver }"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <div class="upload-content">
            <el-icon class="upload-icon">
              <Plus />
            </el-icon>
            <p class="upload-text">
              选择/拖动一个音视频文件到这里
            </p>
          </div>
        </div>

        <!-- 隐藏的文件输入 -->
        <input
          ref="fileInputRef"
          type="file"
          accept="audio/*,video/*"
          style="display: none"
          @change="handleFileSelect"
        />

        <!-- 文件列表 -->
        <div v-if="fileList.length > 0" class="file-list">
          <div
            v-for="(file, index) in fileList"
            :key="index"
            class="file-item"
          >
            <div class="file-info">
              <el-icon class="file-icon" :class="getFileIconClass(file.type)">
                <component :is="getFileIcon(file.type)" />
              </el-icon>
              <div class="file-details">
                <div class="file-name">
                  {{ file.name }}
                </div>
                <div class="file-meta">
                  {{ formatDate(file.lastModified) }} {{ formatFileSize(file.size) }}
                </div>
              </div>
            </div>
            <el-icon class="remove-icon" @click="removeFile(index)">
              <Close />
            </el-icon>
          </div>
          <div v-if="messages" class="title">
            识别结果
          </div>
          <div class="messages-content">
            {{ messages }}
          </div>
        </div>
      </div>

      <!-- 右侧配置区域 -->
      <div v-if="false" class="config-section">
        <div class="config-group">
          <h4 class="config-title">
            音频语言
          </h4>
          <div class="language-options">
            <div class="language-row">
              <el-button
                v-for="lang in mainLanguages"
                :key="lang.value"
                :type="selectedLanguage === lang.value ? 'primary' : 'default'"
                class="language-btn"
                @click="selectLanguage(lang.value)"
              >
                {{ lang.label }}
              </el-button>
            </div>
            <div class="language-row">
              <el-button
                v-for="lang in secondaryLanguages"
                :key="lang.value"
                :type="selectedLanguage === lang.value ? 'primary' : 'default'"
                class="language-btn"
                @click="selectLanguage(lang.value)"
              >
                {{ lang.label }}
              </el-button>
              <el-dropdown @command="selectLanguage">
                <el-button class="language-btn">
                  更多 <el-icon><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="lang in moreLanguages"
                      :key="lang.value"
                      :command="lang.value"
                    >
                      {{ lang.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>

        <div class="config-group">
          <h4 class="config-title">
            说话人数量
          </h4>
          <el-dropdown @command="selectSpeakerCount">
            <el-button class="speaker-btn">
              {{ speakerCountText }} <el-icon><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="auto">
                  自动
                </el-dropdown-item>
                <el-dropdown-item
                  v-for="count in speakerCounts"
                  :key="count"
                  :command="count.toString()"
                >
                  {{ count }}人
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="dialog-footer">
      <!-- 上传进度 -->
      <div v-if="isUploading" class="upload-progress">
        <el-progress :percentage="uploadProgress" :show-text="false" />
        <span class="progress-text">正在上传文件... {{ uploadProgress }}%</span>
      </div>
      <div class="button-group">
        <el-button :disabled="isUploading" @click="handleClose">
          取消
        </el-button>
        <el-button
          type="primary"
          :disabled="fileList.length === 0 || isUploading"
          :loading="isUploading"
          @click="handleConfirm"
        >
          {{ isUploading ? '上传中...' : '确认导入' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Close,
  Plus,
  ArrowDown,
  VideoPlay,
  Headset
} from '@element-plus/icons-vue'
import { bigFileUpload } from '@/utils/uploadFileChunk'
import { useUserStore } from '@/store/modules/user'
import { workflowUploadFile } from '@/api/aiApaas'
const store = useUserStore()

// 响应式数据
const isDragOver = ref(false)
const fileList = ref([])
const selectedLanguage = ref('zh-cn')
const selectedSpeakerCount = ref('auto')
const fileInputRef = ref()
const isUploading = ref(false)
const uploadProgress = ref(0)

// 语言选项
const mainLanguages = [
  { label: '中文(普通话)', value: 'zh-cn' },
  { label: '英语', value: 'en' },
  { label: '中英混合', value: 'zh-en' }
]

const secondaryLanguages = [
  { label: '日语', value: 'ja' }
]

const moreLanguages = [

  { label: '德语', value: 'de' },
  { label: '西班牙语', value: 'es' },
  { label: '俄语', value: 'ru' },
  { label: '韩语', value: 'ko' },
  { label: '意大利语', value: 'it' }
]

// 说话人数量选项
const speakerCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 计算属性
const speakerCountText = computed(() => {
  return selectedSpeakerCount.value === 'auto' ? '自动' : `${selectedSpeakerCount.value}人`
})

// 事件定义
const emit = defineEmits(['close', 'confirm'])

// 方法
const handleClose = () => {
  emit('close')
}

const handleConfirm = async() => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择要导入的文件')
    return
  }

  const fileInfo = fileList.value[0]

  try {
    isUploading.value = true
    uploadProgress.value = 0

    // 使用大文件分块上传（替代Base64方式）
    // 优势：
    // 1. 支持断点续传，网络中断后可以继续上传
    // 2. 内存占用更少，不需要将整个文件转为Base64
    // 3. 上传速度更快，支持并发上传多个分块
    // 4. 支持秒传功能，相同MD5的文件可以直接返回结果
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadData = {
        file: fileInfo.file,
        params: {
          accessToken: store.token,
          name: fileInfo.name
        },
        onSuccess: (res) => {
          console.log('文件上传成功:', res)
          resolve(res)
        },
        onError: (err) => {
          console.error('文件上传失败:', err)
          reject(err)
        },
        onProgress: (percentage) => {
          uploadProgress.value = percentage
          console.log('上传进度:', percentage + '%')
        }
      }
      bigFileUpload(uploadData)
    })
    let res = await uploadPromise
    // path 路径最后一个斜杠后面的字符串
    const fileName = res.file.path.split('/').pop()
    addFileToList(res.file.url, res.file.duration, fileName)
    ElMessage.success('文件上传成功')
  } catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('文件上传失败: ' + (error.message || '未知错误'))
  } finally {
    isUploading.value = false
    // 不立即重置进度，让用户看到100%的成功状态
    // 延迟2秒后重置进度
    setTimeout(() => {
      if (!isUploading.value) {
        uploadProgress.value = 0
      }
    }, 2000)
  }
}

import { saveFile } from '@/api/mobileeducationplatform/case'
const addFileToList = async(filePath, duration, fileName) => {
  const params = {
    accessToken: store.token,
    title: fileName,
    duration: duration + '',
    filePath: filePath,
    recognizedContent: messages.value,
    fileStatus: 'NORMAL'
  }
  const res = await saveFile(params)
  if (res.code === 200) {
    emit('close')
    ElMessage.success('录音成功')
  } else {
    ElMessage.error('录音失败')
  }
}

const startRecognition = async() => {
  await startWorkflow()
  // 将分片上传识别
  /* 真正的上传函数，使用 FormData（file 字段） */
  const fd = new FormData()
  fd.append('accessToken', store.token)
  fd.append('file', fileList.value[0].file)
  fd.append('id', workflowId.value)
  fd.append('tag', 'talkAudio')
  workflowUploadFile(fd)
}

import Config from '@/config'
const workflowId = ref('')
const messages = ref('')
const startWorkflow = async() => {
  return new Promise((resolve) => {
    const params = new URLSearchParams({ accessToken: store.token, ...Config.headers })
    const es = new EventSource(Config.URL + Config.gateWay + 'oortcloud-ai/workflows/v1/workflowStart?' + params)
    // 2. 监听通用事件
    es.onopen = () => console.log('Connection opened')
    es.onerror = (e) => console.error('Error:', e)

    // 3. 监听特定事件（对应服务端的 event:xxx）
    es.addEventListener('update', () => {
    })

    // 根据返回的 数据 进行 解析
    let allText = {}
    // 4. 监听未命名事件（服务端未指定event时触发）
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (!data.event) {
          workflowId.value = data.work_id
          resolve(data)
        }
        if (data.event === 'workflow_finished') {
          console.log('workflow_finished', data)
          // 判断上传的第几个文件 如果不存在， 就创建一个并赋值work_tag_indexs 大小的数据
          if (!allText[data.work_index]) {
            allText[data.work_index] = new Array(data.work_tag_indexs).fill('')
          }
          if (data && data.data && data.data.outputs && data.data.outputs.text) {
            allText[data.work_index][data.work_tag_index] = data.data.outputs.text
          }
          // 遍历allText对象 ，按key 排序 将所有数据拼接成一个字符串
          let allTextString = ''
          Object.keys(allText).sort().forEach(key => {
            allTextString += allText[key].join('')
          })
          messages.value = allTextString
          console.log('allText------------', allText)
        }
      } catch (error) {
        console.warn('warn:', error)
      }
    }

    // 5. 关闭连接（需要时）
    // es.close();

  // if (res.code === 200) {
  //   workflowId.value = res.data.id
  //   workflowTag.value = res.data.tag
  // } else {
  //   throw new Error(`上传失败：${res.message}`)
  // }
  })
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event) => {
  const target = event.target
  const files = target.files
  if (files) {
    addFiles(Array.from(files))
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer?.files
  if (files) {
    if (files.length > 1) {
      ElMessage.warning('一次只能上传一个文件，已选取第一个文件')
    }
    addFiles(Array.from(files))
  }
}

const addFiles = (files) => {
  // 限制只能上传一个文件
  if (files.length === 0) return

  // 只取第一个文件
  const file = files[0]

  // 验证文件类型
  const isValid = file.type.startsWith('audio/') || file.type.startsWith('video/')
  if (!isValid) {
    ElMessage.warning(`文件 ${file.name} 不是有效的音视频文件`)
    return
  }

  // 如果已有文件，则替换；否则添加
  const newFile = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    file
  }
  fileList.value = [newFile]
  // 清空文件输入框，以便下次可以选择相同文件
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  messages.value = ''
  startRecognition()
}

const removeFile = (index) => {
  fileList.value.splice(index, 1)
}

const selectLanguage = (language) => {
  selectedLanguage.value = language
}

const selectSpeakerCount = (count) => {
  selectedSpeakerCount.value = count
}

const getFileIcon = (type) => {
  if (type.startsWith('video/')) {
    return VideoPlay
  } else if (type.startsWith('audio/')) {
    return Headset
  }
  return VideoPlay
}

const getFileIconClass = (type) => {
  if (type.startsWith('video/')) {
    return 'video-icon'
  } else if (type.startsWith('audio/')) {
    return 'audio-icon'
  }
  return 'video-icon'
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i]
}
</script>

<style scoped lang="scss">
.import-file-dialog {
  width: 100%;
}

.dialog-content {
  display: flex;
  gap: 24px;
  padding: 24px;
  min-height: 300px;
}

.upload-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;

  &:hover,
  &.drag-over {
    border-color: #409eff;
    background: #f0f9ff;
  }
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  font-size: 32px;
  color: #409eff;
  background: #e6f7ff;
  padding: 16px;
  border-radius: 50%;
}

.upload-text {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.file-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.file-icon {
  font-size: 24px;
  padding: 8px;
  border-radius: 6px;

  &.audio-icon {
    background: #e6f7ff;
    color: #1890ff;
  }

  &.video-icon {
    background: #f6ffed;
    color: #52c41a;
  }
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.file-meta {
  font-size: 12px;
  color: #999;
}

.remove-icon {
  font-size: 16px;
  color: #999;
  cursor: pointer;

  &:hover {
    color: #ff4d4f;
  }
}

.config-section {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.config-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.language-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.language-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.language-btn {
  flex: 1;
  min-width: 80px;
  height: 36px;
}

.speaker-btn {
  width: 120px;
  height: 36px;
}

.dialog-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 12px;

  .el-progress {
    flex: 1;
  }

  .progress-text {
    font-size: 14px;
    color: #666;
    white-space: nowrap;
  }
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.messages-content {
  font-size: 14px;
  color: #666;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.title {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}
</style>
