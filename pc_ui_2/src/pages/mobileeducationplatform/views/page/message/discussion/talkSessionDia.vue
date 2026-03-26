<template>
  <div class="talk-session-container">
    <!-- 左侧谈话信息 -->
    <div v-if="talkData" class="talk-info">
      <div class="section-title">
        谈话信息
      </div>
      <div class="prisoner-info">
        <div class="basic-info">
          <div class="avatar">
            <img :src="talkData.prisonerImg || defaultAvatar" alt="prisoner avatar" />
          </div>
          <div class="info-text">
            <h3>{{ talkData.prisonerName }}</h3>
            <div class="talk-count">
              已谈话次数：{{ talkData.completedTalks || 0 }}
            </div>
            <div class="code">
              编号：{{ talkData.prisonerCode }}
            </div>
          </div>
        </div>

        <div class="info-group">
          <div class="group-title">
            基本信息
          </div>
          <div class="info-section">
            <div class="info-item">
              <span class="value">
                <span class="label">性别：</span>
                {{ talkData.sex }}&nbsp;
                <span class="label">年龄：</span>
                <span class="value">{{ talkData.prisonerAge }}岁</span>
              </span>
            </div>

            <div class="info-item">
              <span class="label">罪犯类型：</span>
              <span class="value" :class="{ danger: talkData.prisonerTypeName?.includes('重点') }">
                {{ talkData.prisonerTypeName }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">罪名：</span>
              <span class="value">{{ talkData.crime }}</span>
            </div>
            <div class="info-item">
              <span class="label">剩余刑期：</span>
              <span class="value">{{ talkData.remainingSentence }}</span>
            </div>
            <div class="info-item">
              <span class="label">所属监狱：</span>
              <span class="value">{{ talkData.prisonName + '&nbsp;' + talkData.prisonArea + '&nbsp;' +
                talkData.cellNumber
              }}</span>
            </div>
          </div>
        </div>

        <div class="info-group">
          <div class="group-title">
            谈话信息
          </div>
          <div class="info-section">
            <div class="info-item">
              <span class="label">开始时间：</span>
              <span class="value">{{ talkData.talkTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">谈话类别：</span>
              <span class="value">{{ talkData.talkTypeName }}</span>
            </div>
            <div class="info-item">
              <span class="label">谈话地点：</span>
              <span class="value">{{ talkData.place }}</span>
            </div>
          </div>
        </div>

        <!-- 摄像头区域 -->
        <div class="info-group">
          <div class="group-title">
            视频录制
          </div>
          <div class="camera-section">
            <div v-if="availableCameras.length > 1" class="camera-selector">
              <el-select v-model="selectedCamera" placeholder="选择摄像头" size="small">
                <el-option
                  v-for="camera in availableCameras"
                  :key="camera.deviceId"
                  :label="camera.label || `摄像头 ${camera.deviceId.substring(0, 8)}`"
                  :value="camera.deviceId"
                />
              </el-select>
            </div>
            <video
              ref="videoPreview"
              autoplay
              muted
              playsinline
              class="video-preview"
              @error="handleVideoError"
              @loadeddata="handleVideoLoaded"
            />
            <div class="camera-controls">
              <div v-if="isVideoRecording" class="video-recording-info">
                <i class="el-icon-video-camera" />
                <span>录制中: {{ formatTime(videoRecordingTime) }}</span>
              </div>
              <!-- <el-button
                v-if="!isVideoRecording"
                type="primary"
                @click="startRecording"
              >
                开始录制
              </el-button>
              <el-button
                v-if="isVideoRecording"
                type="danger"
                @click="stopRecording"
              >
                停止录制
              </el-button> -->
            </div>
            <div v-if="isVideoLoading" class="video-loading">
              <el-loading :text="'视频加载中...'" />
            </div>
            <div v-if="videoError" class="video-error">
              <el-alert :title="videoError" type="error" :closable="false" show-icon />
            </div>
            <!-- 隐藏录制的视频预览 -->
            <!-- <video
              v-if="recordedUrl"
              :src="recordedUrl"
              controls
              class="recorded-video"
              @error="handleRecordedVideoError"
              @loadeddata="handleRecordedVideoLoaded"
            /> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 中间谈话内容区域 -->
    <div class="talk-content">
      <div class="section-title">
        谈话内容
      </div>
      <div v-if="messages" ref="messageList" class="message-list">
        <div class="message-item">
          <div class="message-avatar">
            <img :src="defaultAvatar" />
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-name" />
              <span class="message-time" />
            </div>
            <div class="message-text">
              {{ messages }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="message-list">
        <el-empty description="暂无谈话内容" />
      </div>
      <div class="recorder-container">
        <div class="recorder-header">
          <div class="recorder-status">
            <div class="status-indicator" :class="{ 'recording': isRecording }">
              <div class="status-dot" />
              <span class="status-text">{{ statusLabel }}</span>
            </div>
            <div class="recorder-info">
              <div class="info-item">
                <i class="el-icon-time" />
                <span>{{ formatTime(elapsed) }}</span>
              </div>
              <div class="info-item">
                <!-- <i class="el-icon-upload" />
                <span>{{ segmentsUploaded }} 分片</span> -->
              </div>
            </div>
          </div>
        </div>

        <div class="waveform-container">
          <div ref="waveform" class="waveform" />
          <div v-if="!isRecording && !hasRecorded" class="waveform-placeholder">
            <i class="el-icon-microphone" />
            <p>点击开始谈话按钮开始录音</p>
          </div>
        </div>

        <div class="recorder-controls">
          <el-button
            v-if="!isRecording"
            type="primary"
            size="large"
            :disabled="isRecording"
            class="control-btn start-btn"
            @click="start"
          >
            {{ isRecording ? '录制中...' : '开始谈话' }}
          </el-button>

          <el-button
            v-else
            type="danger"
            size="large"
            :disabled="!isRecording"
            class="control-btn stop-btn"
            @click="stop"
          >
            结束谈话
          </el-button>
          <div class="video-checkbox">
            <el-checkbox v-model="videoRecordChecked" :disabled="isRecording" label="同时录制视频" />
          </div>
        </div>

        <div v-if="errorMsg" class="error-message">
          <el-alert :title="errorMsg" type="error" :closable="false" show-icon />
        </div>
      </div>
    </div>

    <!-- 右侧谈话模版区域 -->
    <div class="template-area">
      <div class="section-title">
        谈话模版
      </div>
      <div class="search-box">
        <el-input v-model="searchTemplate" placeholder="搜索模版" prefix-icon="el-icon-search" />
        <el-button type="primary" @click="addTemplate">
          添加
        </el-button>
      </div>

      <div v-loading="loadingTemplates" class="template-list">
        <div v-if="filteredTemplates.length === 0" class="empty-templates">
          <el-empty description="暂无模版" />
        </div>
        <div v-else class="template-items">
          <div
            v-for="template in filteredTemplates"
            :key="template.id"
            class="template-item"
            @click="viewTemplateDetail(template.id)"
          >
            <div class="template-title">
              {{ template.templateName }}
            </div>
            <div class="template-brief">
              {{ template.templateContent?.substring(0, 10) + '...' }}
            </div>
            <div class="template-meta">
              <span class="template-time">{{ template.createTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模版详情对话框 -->
    <el-dialog
      v-model="templateDialogVisible"
      :title="isEditingTemplate ? '编辑模版' : '模版详情'"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="template-detail">
        <div class="template-header">
          <div v-if="isEditingTemplate" class="template-name-edit">
            <el-input v-model="editingTemplateName" placeholder="请输入模版名称" />
          </div>
          <div v-else class="template-info">
            <div class="template-meta">
              <span class="template-time">模版名称：{{ templateName }}</span>
            </div>
          </div>
        </div>

        <div class="template-content">
          <template v-if="isEditingTemplate">
            <el-input v-model="editingTemplateContent" type="textarea" :rows="10" placeholder="请输入模版内容" />
          </template>
          <pre v-else>{{ templateContent }}</pre>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">

          <template v-if="!isEditingTemplate">
            <el-button type="primary" @click="startEditTemplate">编辑模版</el-button>
            <el-button type="success" @click="applyTemplate">应用模版</el-button>
          </template>
          <template v-else>
            <el-button type="primary" @click="saveTemplate">保存</el-button>
            <!-- <el-button @click="cancelEditTemplate">取消</el-button> -->
          </template>
          <el-button @click="closeTemplateDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 结束谈话确认对话框 -->
    <el-dialog
      v-model="endTalkDialogVisible"

      title="确认结束本次谈话"
      width="45%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div
        v-loading="loading"
        :element-loading-text="loadingText"
        class="end-talk-content"
      >
        <div class="talk-info-summary">
          <p class="talk-duration">
            谈话时长：{{ formatTime(elapsed) }}
          </p>
        </div>
        <div class="talk-effect-input">
          <div class="effect-label required">
            谈话效果备注
          </div>
          <el-input
            v-model="talkEffect"
            type="textarea"
            :rows="4"
            placeholder="请输入谈话效果/备注（最少20字）"
            :maxlength="500"
            show-word-limit
          />
          <!-- 提供模板，点击就输入到 talkEffect 中 -->
          <div class="template-list">
            <div v-for="template in templates" :key="template" class="template-item" @click="inputTemplate(template)">
              {{ template }}
            </div>
          </div>
          <div v-if="showEffectError" class="error-tip">
            请输入至少20字的谈话效果备注
          </div>
        </div>
      </div>
      <template v-if="!loading" #footer>
        <span class="dialog-footer">
          <el-button type="primary" :disabled="!isEffectValid" @click="confirmEndTalk">确认结束</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted, computed, watch } from 'vue'
import { workflowUploadFile } from '@/api/aiApaas'
import { getMemconInfo, pageTalkTemplates, endMemcon } from '@/api/mobileeducationplatform/case'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { ElMessageBox } from 'element-plus'
const store = useUserStore()

const searchTemplate = ref('')
const templateDialogVisible = ref(false)
const isEditingTemplate = ref(false)
const editingTemplateName = ref('')
const editingTemplateContent = ref('')
const templateName = ref('')
const templateContent = ref('')
const isVideoLoading = ref(false)
const videoError = ref(null)
const selectedCamera = ref('')
const videoRecordChecked = ref(false)

// 保存视频的 bigBlob
const bigVideoBlob = ref(null)

// 监听选中的摄像头变化
watch(() => selectedCamera.value, async(newCameraId) => {
  switchCamera(newCameraId)
})

const switchCamera = async(newCameraId) => {
  if (!newCameraId) return
  try {
    isVideoLoading.value = true
    videoError.value = null
    // 关闭当前流
    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach(track => track.stop())
      mediaStream.value = null
    }
    // 获取新摄像头的视频流
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: newCameraId },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    })
    mediaStream.value = stream
    // 更新视频预览
    if (videoPreview.value) {
      videoPreview.value.srcObject = stream
    }
    ElMessage.success('摄像头切换成功')
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      videoError.value = '请允许访问摄像头'
    } else if (error.name === 'NotFoundError') {
      videoError.value = '未找到可用的摄像头设备'
    } else if (error.name === 'NotReadableError') {
      videoError.value = '摄像头被占用，请关闭其他应用'
    } else {
      videoError.value = '切换摄像头失败'
    }
    ElMessage.error(videoError.value)
  } finally {
    isVideoLoading.value = false
  }
}

const startRecording = async() => {
  try {
    if (!mediaStream.value) {
      ElMessage.error('请先初始化摄像头')
      return
    }

    // 清空之前的录制数据
    videoChunks.value = []
    recordedUrl.value = ''
    videoRecordingTime.value = 0

    // 创建 MediaRecorder
    const options = {
      mimeType: 'video/webm;codecs=vp8,opus' || 'video/webm' || 'video/mp4'
    }

    videoRecorder.value = new MediaRecorder(mediaStream.value, options)

    // 监听数据可用事件
    videoRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunks.value.push(event.data)
      }
    }

    // 监听录制结束事件
    videoRecorder.value.onstop = () => {
      const blob = new Blob(videoChunks.value, { type: 'video/webm' })
      recordedUrl.value = URL.createObjectURL(blob)
      // 本地保存一份
      // const a = document.createElement('a')
      // a.href = recordedUrl.value
      // a.download = 'recorded_video.mp4'
      // a.click()
      // 停止录制计时器
      if (videoRecordingTimer.value) {
        clearInterval(videoRecordingTimer.value)
        videoRecordingTimer.value = null
      }
    }

    // 开始录制
    videoRecorder.value.start(1000) // 每秒生成一个数据块
    isVideoRecording.value = true

    // 开始录制计时器
    const startTime = Date.now()
    videoRecordingTimer.value = setInterval(() => {
      videoRecordingTime.value = Math.floor((Date.now() - startTime) / 1000)
    }, 1000)
  } catch (error) {
    console.error('开始录制失败:', error)
    ElMessage.error('开始录制失败: ' + error.message)
  }
}

const stopRecording = async() => {
  try {
    if (!videoRecorder.value || videoRecorder.value.state === 'inactive') {
      ElMessage.warning('没有正在进行的录制')
      return
    }

    // 停止录制
    videoRecorder.value.stop()
    isVideoRecording.value = false

    // 等待录制结束事件处理完成
    await new Promise(resolve => {
      const checkStop = () => {
        if (recordedUrl.value) {
          resolve()
        } else {
          setTimeout(checkStop, 100)
        }
      }
      checkStop()
    })

    // 上传录制的视频文件
    if (recordedUrl.value) {
      try {
        // 获取 Blob 数据
        const response = await fetch(recordedUrl.value)
        const blob = await response.blob()
        // 上传接口调用
        bigVideoBlob.value = blob
      } catch (err) {
        console.error('视频上传异常:', err)
        ElMessage.error('视频上传异常: ' + err.message)
      }
    }
  } catch (error) {
    console.error('停止录制失败:', error)
    ElMessage.error('停止录制失败: ' + error.message)
  }
}

const handleVideoError = (e) => {
  videoError.value = e.message
}

const handleVideoLoaded = () => {
  isVideoLoading.value = false
  videoError.value = null
}

const _handleRecordedVideoError = (error) => {
  console.error('录制的视频加载失败:', error)
  ElMessage.error('录制的视频加载失败')
}

const _handleRecordedVideoLoaded = () => {
  console.log('录制的视频加载成功')
}

const props = defineProps({
  uploadUrl: { type: String, default: '/upload' }, // 必填：上传端点
  segmentInterval: { type: Number, default: 3000 }, // 每段时长（ms）
  filenamePrefix: { type: String, default: 'audio' },
  headers: { type: Object, default: () => ({}) }, // 可放 Authorization 等（注意：不要传 Content-Type）
  mimeType: { type: String, default: '' }, // 可强制 mime 类型，如果支持的话
  maxUploadRetries: { type: Number, default: 3 },
  talkId: { type: String, default: '' }
})
const emit = defineEmits(['close'])

/* 状态 */
const isRecording = ref(false)
const statusLabel = ref('空闲')
const errorMsg = ref(null)
const segmentsUploaded = ref(0)
const elapsed = ref(0)

/* 内部引用 */
let mediaRecorder = null
let stream = null
let continuousChunks = []
let elapsedTimer = null

function formatTime(sec) {
  if (!sec) return '0:00'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/* 选择可用 mimeType（优先 props.mimeType） */
function chooseMime() {
  const candidates = [
    props.mimeType,
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg'
  ]
  if (typeof MediaRecorder === 'undefined') return ''
  for (const t of candidates) {
    if (!t) continue
    if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) return t
  }
  return props.mimeType || ''
}

const bigAudioBlob = ref(null)

/* 开始录谈话*/
async function start() {
  messages.value = ''
  // 提示用户是否 开始谈话 并且可选择是否同时录制视频
  const confirm = await ElMessageBox.confirm('确定开始谈话？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  if (confirm) {
    if (videoRecordChecked.value) {
      startRecording()
    }
    if (isRecording.value) return
    errorMsg.value = null
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = chooseMime()
      mediaRecorder = mime ? new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 128000 })
        : new MediaRecorder(stream, { audioBitsPerSecond: 128000 })

      continuousChunks = []
      segmentsUploaded.value = 0
      elapsed.value = 0
      hasRecorded.value = true

      await startWorkflow()
      // 初始化wavesurfer
      await initializeWaveform(stream)

      mediaRecorder.ondataavailable = handleDataAvailable
      mediaRecorder.onerror = e => handleError(e)
      mediaRecorder.onstart = () => {
        isRecording.value = true
        statusLabel.value = '录制中'
        startElapsedTimer()
      }
      mediaRecorder.onstop = async() => {
      // 完整录音上传在 stopRecordingHandler 中处理
        await stopRecordingHandler()
      }

      // start with timeslice -> browsers will emit dataavailable every segmentInterval ms
      mediaRecorder.start(props.segmentInterval)
    } catch (err) {
      handleError(err)
    }
  }
}

/* 计时器 */
function startElapsedTimer() {
  const t0 = Date.now()
  elapsedTimer = setInterval(() => {
    elapsed.value = Math.floor((Date.now() - t0) / 1000)
  }, 500)
}

/* dataavailable 处理：既做分片上传，也保留 chunk 供最终合并 */
function handleDataAvailable(e) {
  if (!e.data || e.data.size === 0) return
  continuousChunks.push(e.data)

  uploadWithRetry(e.data, `segment_${Date.now()}`, true).catch(err => {
    console.error('segment upload fail:', err)
  })
}

async function makeStandaloneSegment(webmChunk, index) {
  // webmChunk// 可下载
  // 如果是第一段，直接使用（包含完整文件头）
  if (index === 0) return webmChunk
  const mime = chooseMime() || (continuousChunks[0] && continuousChunks[0].type) || 'audio/webm'
  // TODO 这里每次都拼接第一段，是有问题的， 暂时没找到办法解决

  // 另外一种 合并请index 个
  const mergedChunks = continuousChunks.slice(0, index)
  const mergedBlob = new Blob(mergedChunks, { type: mime })
  return new Blob([mergedBlob], { type: mime })
}

/* 上传并重试（isSegment: true 表示这是分片） */
async function uploadWithRetry(blob, nameSuffix, isSegment = false) {
  // 创建独立分段（添加文件头使其可独立播放）
  const segmentBlob = await makeStandaloneSegment(blob, segmentsUploaded.value)
  await uploadBlob(segmentBlob, nameSuffix)
  if (isSegment) {
    segmentsUploaded.value++
  }
}

import Config from '@/config'
const workflowId = ref('')
// 根据返回的 数据 进行 解析
let allText = {}
const startWorkflow = async() => {
  const params = new URLSearchParams({ accessToken: store.token, ...Config.headers })
  const es = new EventSource(Config.URL + Config.gateWay + 'oortcloud-ai/workflows/v1/workflowStart?' + params)
  // 2. 监听通用事件
  es.onopen = () => console.log('Connection opened')
  es.onerror = (e) => console.error('Error:', e)

  // 3. 监听特定事件（对应服务端的 event:xxx）
  es.addEventListener('update', () => {
  })

  // 4. 监听未命名事件（服务端未指定event时触发）
  es.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data)
      if (!data.event) {
        console.log('data.work_id', data.work_id)
        workflowId.value = data.work_id
      }
      if (data.event === 'workflow_finished') {
        // console.log('workflow_finished', data)
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
          // 获取最后一个的值， 因为这里上传的都是同一个文件
          allTextString = allText[key].join('')
        })
        messages.value = allTextString
        // console.log('allText------------', allText)
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
}

/* 真正的上传函数，使用 FormData（file 字段） */
async function uploadBlob(blob) {
  if (!workflowId.value) {
    console.error('发生错误workID为空', workflowId.value)
  }
  const fd = new FormData()
  fd.append('accessToken', store.token)
  fd.append('file', blob)
  fd.append('id', workflowId.value)
  fd.append('tag', 'talkAudio')
  workflowUploadFile(fd)
}

/* 停止录制（由用户点击） */
async function stop() {
  // 提示用户是否结束谈话并上传音视频
  const confirm = await ElMessageBox.confirm('确定结束谈话,确定后将上传音视频？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  if (confirm) {
    if (videoRecordChecked.value) {
      stopRecording()
    }
    if (!isRecording.value || !mediaRecorder) return
    statusLabel.value = '停止中'
    try {
      mediaRecorder.stop()
    } catch (e) {
    // 某些极端情况下 stop 可能抛错
      handleError(e)
    }
    endTalkDialogVisible.value = true
  }
}

/* 停止时的统一处理：合并 chunks 并上传完整录音 */
async function stopRecordingHandler() {
  clearInterval(elapsedTimer)
  isRecording.value = false
  statusLabel.value = '已停止'

  // 停掉麦克风流
  try {
    if (stream) stream.getTracks().forEach(t => t.stop())
  } catch (e) {
    console.warn('停止音频流失败:', e)
  }

  // 合并并上传完整文件
  if (!continuousChunks.length) {
    emit('stopped')
    return
  }
  const mime = chooseMime() || (continuousChunks[0] && continuousChunks[0].type) || 'audio/webm'
  bigAudioBlob.value = new Blob(continuousChunks, { type: mime })
}

/* 错误统一处理 */
function handleError(err, extraMsg) {
  console.error(err)
  errorMsg.value = (extraMsg ? extraMsg + ': ' : '') + (err && err.message ? err.message : String(err))
  statusLabel.value = '错误'
  isRecording.value = false
  emit('error', { message: errorMsg.value, raw: err })
}

/* 初始化音频可视化 */
async function initializeWaveform(audioStream) {
  try {
    // 使用原生Web Audio API创建音频可视化
    createSimpleVisualizer(audioStream)
  } catch (error) {
    console.error('Failed to initialize audio visualizer:', error)
  }
}

/* 创建简单的音频可视化 */
function createSimpleVisualizer(audioStream) {
  if (!waveform.value) return
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const analyser = audioContext.createAnalyser()
  const source = audioContext.createMediaStreamSource(audioStream)

  source.connect(analyser)
  analyser.fftSize = 256

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const canvas = document.createElement('canvas')
  canvas.width = waveform.value.clientWidth
  canvas.height = 80
  canvas.style.width = '100%'
  canvas.style.height = '80px'
  canvas.style.borderRadius = '4px'
  canvas.style.backgroundColor = '#f5f7fa'

  waveform.value.innerHTML = ''
  waveform.value.appendChild(canvas)

  const ctx = canvas.getContext('2d')

  function draw() {
    requestAnimationFrame(draw)
    if (!isRecording.value) return
    analyser.getByteFrequencyData(dataArray)
    ctx.fillStyle = '#f5f7fa'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const barWidth = (canvas.width / bufferLength) * 1.2
    let barHeight
    let x = 0
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#409EFF')
      gradient.addColorStop(1, '#67C23A')
      ctx.fillStyle = gradient
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
      x += barWidth + 1
    }
  }
  draw()
}

const endTalkDialogVisible = ref(false)
import defaultAvatar from '@/assets/img/default_pic.png'

const availableCameras = ref([])
const videoPreview = ref(null)
const mediaStream = ref(null)
const isVideoRecording = ref(false)

// 视频录制相关
const videoRecorder = ref(null)
const videoChunks = ref([])
const recordedUrl = ref('')
const videoRecordingTime = ref(0)
const videoRecordingTimer = ref(null)

// 录音相关
const waveform = ref(null)
const hasRecorded = ref(false)

const initializeCamera = async() => {
  try {
    // 兼容性处理
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {}
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        const getUserMedia = navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.getUserMedia

        if (!getUserMedia) {
          return Promise.reject(ElMessage.error('此浏览器未实现'))
        }
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject)
        })
      }
    }

    // 检查浏览器权限状态
    const permissionStatus = await navigator.permissions.query({ name: 'camera' })

    if (permissionStatus.state === 'denied') {
      ElMessage.error('摄像头访问被拒绝，请在浏览器设置中允许访问摄像头')
      return
    }

    // 获取并打印所有可用设备信息
    const devices = await navigator.mediaDevices.enumerateDevices()

    // 过滤出视频输入设备
    availableCameras.value = devices.filter(device => device.kind === 'videoinput')

    if (availableCameras.value.length === 0) {
      ElMessage.warning('未检测到可用的摄像头设备')
      return
    }
    // 先获取最新的设备列表
    const cameras = devices.filter(d => d.kind === 'videoinput')
    // 自动选择第一个可用摄像头
    const constraints = {
      video: {
        deviceId: cameras[0].deviceId ? { exact: cameras[0].deviceId } : true
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      // const stream = await navigator.mediaDevices.getUserMedia(basicConstraints);
      // 设置视频源
      if (videoPreview.value) {
        if ('srcObject' in videoPreview.value) {
          videoPreview.value.srcObject = stream
        } else {
          // 兼容旧版浏览器
          videoPreview.value.src = window.URL.createObjectURL(stream)
        }

        // 确保视频加载完成后播放
        videoPreview.value.onloadedmetadata = () => {
          videoPreview.value.play().catch(e => ElMessage.error('视频播放失败', e))
        }
      }

      mediaStream.value = stream
      ElMessage.success('摄像头初始化成功')

      // 获取并打印当前使用的摄像头信息
      const _videoTrack = stream.getVideoTracks()[0]
      // 更新可用摄像头列表
      await updateAvailableCameras()
    } catch (basicError) {
      // 尝试使用更宽松的约束条件
      const fallbackConstraints = {
        video: {
          width: { min: 640, ideal: 1280, max: 1920 }, // 分辨率范围：最小640px，理想1280px(720p)，最大1920px(1080p)
          height: { min: 480, ideal: 720, max: 1080 }, // 分辨率范围：最小480px，理想720px(720p)，最大1080px(1080p)
          frameRate: { min: 15, ideal: 30, max: 60 } // 帧率范围：最小15fps，理想30fps，最大60fps
        },
        audio: true
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints)
        if (videoPreview.value) {
          videoPreview.value.srcObject = stream
          videoPreview.value.onloadedmetadata = () => {
            videoPreview.value.play().catch(e => ElMessage.error('视频播放失败', e))
          }
        }
        mediaStream.value = stream
        ElMessage.success('摄像头初始化成功')
      } catch (fallbackError) {
        throw new Error('无法初始化摄像头，请检查设备连接和权限设置')
      }
    }
  } catch (error) {
    let errorMessage = '摄像头初始化失败'
    if (error.name === 'NotAllowedError') {
      errorMessage = '请允许访问摄像头和麦克风'
    } else if (error.name === 'NotFoundError') {
      errorMessage = '未找到可用的摄像头设备，请检查设备连接'
    } else if (error.name === 'NotReadableError') {
      errorMessage = '摄像头被其他应用程序占用，请关闭其他使用摄像头的应用'
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = '摄像头不满足要求的参数设置'
    } else if (error.name === 'TypeError') {
      errorMessage = '摄像头参数设置错误'
    }
    ElMessage.error(errorMessage)
  }
}

// 更新可用摄像头列表
const updateAvailableCameras = async() => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    availableCameras.value = devices
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `摄像头 ${device.deviceId.substring(0, 8)}`
      }))
  } catch (error) {
    ElMessage.error('更新摄像头列表失败')
  }
}

const talkData = ref(null)
const talkCount = ref(0)
const talkDuration = ref(0)
const messages = ref('')
const fetchTalkData = async() => {
  try {
    const response = await getMemconInfo(props.talkId)
    if (response.code === 200) {
      talkData.value = response.data
      const data = response.data
      // 初始化计算字段
      if (data && typeof data.initializeCalculatedFields === 'function') {
        data.initializeCalculatedFields()
      }
      // 更新谈话次数
      talkCount.value = data.talkCount || 0
      // 如果有开始时间，计算已经过去的时间
      if (data.talkTime) {
        const startTime = new Date(data.talkTime).getTime()
        const now = new Date().getTime()
        talkDuration.value = Math.floor((now - startTime) / 1000)
      }
    } else {
      ElMessage.error('获取谈话记录失败')
    }
  } catch (error) {
    console.error(error)
  }
}

const loadingTemplates = ref(false)
const talkTemplates = ref([])
const filteredTemplates = ref([])
// 获取谈话模版
const fetchTalkTemplates = async() => {
  try {
    loadingTemplates.value = true
    const params = {
      policeCode: store.userInfo?.oort_code,
      prisonAreaCode: store.userInfo?.oort_depcode,
      current: 1,
      size: 10
    }
    const response = await pageTalkTemplates(params)
    if (response.code === 200) {
      talkTemplates.value = response.data.records || []
      filteredTemplates.value = talkTemplates.value
    } else {
      ElMessage.error('获取谈话模版失败')
    }
  } catch (error) {
    ElMessage.error('获取谈话模版异常')
  } finally {
    loadingTemplates.value = false
  }
}

onMounted(async() => {
  if (props.talkId) {
    await fetchTalkData()
  }
  // 获取谈话模版
  await fetchTalkTemplates()
  // 初始化摄像头
  await initializeCamera()
})

/* 卸载清理 */
onUnmounted(() => {
  try {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
  } catch (e) {
    console.warn('停止音频录制失败:', e)
  }
  try {
    if (stream) stream.getTracks().forEach(t => t.stop())
  } catch (e) {
    console.warn('停止音频流失败:', e)
  }
  clearInterval(elapsedTimer)

  // 清理视频录制相关资源
  if (videoRecordingTimer.value) {
    clearInterval(videoRecordingTimer.value)
  }
  if (videoRecorder.value && videoRecorder.value.state !== 'inactive') {
    videoRecorder.value.stop()
  }
})

// 模版相关函数
const viewTemplateDetail = async(_templateId) => {
  try {
    // 这里应该调用API获取模版详情
    // const response = await getTemplateDetail(templateId)
    // if (response.code === 200) {
    //   templateName.value = response.data.templateName
    //   templateContent.value = response.data.templateContent
    //   templateDialogVisible.value = true
    // }
    ElMessage.info('模版详情功能待实现')
  } catch (error) {
    ElMessage.error('获取模版详情失败')
  }
}

const applyTemplate = () => {
  if (templateContent.value) {
    messages.value += '\n\n' + templateContent.value
    ElMessage.success('模版已应用')
    closeTemplateDialog()
  }
}

const startEditTemplate = () => {
  editingTemplateName.value = templateName.value
  editingTemplateContent.value = templateContent.value
  isEditingTemplate.value = true
}

const saveTemplate = async() => {
  try {
    // 这里应该调用API保存模版
    // const response = await saveTemplateAPI({
    //   templateName: editingTemplateName.value,
    //   templateContent: editingTemplateContent.value
    // })
    // if (response.code === 200) {
    //   ElMessage.success('模版保存成功')
    //   templateName.value = editingTemplateName.value
    //   templateContent.value = editingTemplateContent.value
    //   isEditingTemplate.value = false
    // }
    ElMessage.info('模版保存功能待实现')
  } catch (error) {
    ElMessage.error('保存模版失败')
  }
}

const closeTemplateDialog = () => {
  templateDialogVisible.value = false
  isEditingTemplate.value = false
  editingTemplateName.value = ''
  editingTemplateContent.value = ''
}

const addTemplate = () => {
  templateName.value = ''
  templateContent.value = ''
  isEditingTemplate.value = true
  templateDialogVisible.value = true
}

// 结束谈话相关
const talkEffect = ref('')
const showEffectError = ref(false)

const isEffectValid = computed(() => {
  return talkEffect.value && talkEffect.value.length >= 20
})

import { bigFileUpload } from '@/utils/uploadFileChunk'
const loading = ref(false)
const loadingText = ref('')

const confirmEndTalk = async() => {
  if (!isEffectValid.value) {
    showEffectError.value = true
    return
  }

  let audioPromise = new Promise((resolve, reject) => {
  // 开始上传大文件
    const data = {
      file: bigAudioBlob.value,
      params: {
        accessToken: store.token,
        name: `audio_${Date.now()}.wav`
      },
      onSuccess: (res) => {
        console.log('res, audio--->', res)
        resolve(res)
      },
      onError: (err) => {
        console.log('err, audio--->', err)
        reject(err)
      },
      onProgress: (percentage) => {
        loadingText.value = '音频文件上传中...' + percentage + '%'
        console.log('percentage, audio--->', percentage)
      }
    }
    bigFileUpload(data)
  })

  let videoPromise = new Promise((resolve, reject) => {
    const data = {
      file: bigVideoBlob.value,
      params: {
        accessToken: store.token,
        name: `video_${Date.now()}.mp4`
      },
      onSuccess: (res) => {
        console.log('res, video--->', res)
        resolve(res)
      },
      onError: (err) => {
        console.log('err, video--->', err)
        reject(err)
      },
      onProgress: (percentage) => {
        console.log('percentage- video,--->', percentage)
        loadingText.value = '视频文件上传中...' + percentage + '%'
      }
    }
    bigFileUpload(data)
  })
  loading.value = true
  loadingText.value = '文件上传中...'
  const promises = [audioPromise]
  // 如果没有勾选视频，则不传视频
  if (videoRecordChecked.value) {
    promises.push(videoPromise)
  }
  Promise.all(promises).then(async([audioRes, videoRes = {}]) => {
    console.log('audioRes, videoRes--->', audioRes, videoRes)
    const params = {
      audioPath: audioRes.file.url,
      videoPath: videoRes?.file?.url || '',
      audioText: messages.value,
      talkEffect: talkEffect.value,
      duration: elapsed.value + '',
      id: props.talkId
    }
    console.log('params--->', params)
    const res = await endMemcon(params)
    if (res.code === 200) {
      ElMessage.success('谈话已结束')
    }
    emit('close')
    endTalkDialogVisible.value = false
  }).catch((err) => {
    console.log('err--->', err)
  }).finally(() => {
    loading.value = false
  })
}

const templates = ref(['效果挺好的， 态度诚恳， 表现良好，深刻的反思学习了', '谈话过程中，言语平和，情绪稳定，能清楚的认识到自己的错误'])
const inputTemplate = (template) => {
  talkEffect.value = template
}

// 监听谈话效果输入
watch(talkEffect, () => {
  showEffectError.value = false
})

// 监听搜索关键词变化
watch(searchTemplate, () => {
  if (searchTemplate.value) {
    const keyword = searchTemplate.value.toLowerCase()
    const filtered = talkTemplates.value.filter(template =>
      template.templateName.toLowerCase().includes(keyword) ||
      template.templateContent.toLowerCase().includes(keyword)
    )
    filteredTemplates.value = filtered
  } else {
    filteredTemplates.value = talkTemplates.value
  }
})
</script>

<style scoped lang="scss">
.recorder-container {
  /* max-width: 600px; */
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.recorder-header {
  margin-bottom: 20px;
}

.recorder-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;

  &.recording {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    border-color: #ff6b6b;
    color: white;
    animation: pulse 2s infinite;

    .status-dot {
      background: #fff;
      animation: blink 1s infinite;
    }
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #67c23a;
  }

  .status-text {
    font-size: 14px;
    font-weight: 500;
  }
}

.recorder-info {
  display: flex;
  gap: 15px;

  .info-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #606266;

    i {
      font-size: 16px;
      color: #409eff;
    }
  }
}

.waveform-container {
  position: relative;
  margin-bottom: 20px;
  min-height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
}

.waveform {
  width: 100%;
  height: 100px;
  background: transparent;
}

.waveform-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #909399;

  i {
    font-size: 32px;
    margin-bottom: 8px;
    display: block;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

.recorder-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 15px;
  position: relative;
}

.video-checkbox {
  position: absolute;
  left: 0;
  top: 0;
}

.control-btn {
  min-width: 120px;
  height: 44px;
  border-radius: 22px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.start-btn {
    background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #337ecc 0%, #2d6da3 100%);
    }
  }

  &.stop-btn {
    background: linear-gradient(135deg, #f56c6c 0%, #e74c3c 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }
  }
}

.error-message {
  margin-top: 15px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
}

.talk-session-container {
  height: calc(100vh - 80px);
  width: 100%;
  display: flex;
  background-color: #f5f7fa;
  position: relative;

  .talk-info {
    width: 450px;
    height: 100%;
    background-color: #fff;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    z-index: 1;

    .section-title {
      padding: 12px 20px;
      margin: 0;
      background-color: #409EFF;
      color: #fff;
      font-size: 16px;
      font-weight: normal;
      flex-shrink: 0;
    }

    .prisoner-info {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      height: auto;
      min-height: 300px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 3px;
      }

      .basic-info {
        text-align: center;
        margin-bottom: 15px;
        padding: 8px;
        border-bottom: 1px solid #eee;

        .avatar {
          width: 60px;
          height: 60px;
          margin: 0 auto 8px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #409EFF;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .info-text {
          h3 {
            margin: 0 0 4px;
            font-size: 16px;
          }

          .talk-count,
          .code {
            font-size: 14px;
            margin-bottom: 4px;
          }
        }
      }

      .info-group {
        margin-bottom: 15px;

        .group-title {
          font-size: 14px;
          padding: 0 8px;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .info-section {
          padding: 8px;

          .info-item {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.5;

            .label {
              min-width: 80px;
              color: #666;
            }

            .value {
              color: #333;

              &.danger {
                color: #f56c6c;
              }
            }
          }
        }

        // 摄像头区域样式
        .camera-section {
          padding: 8px;
          position: relative;

          .video-loading,
          .video-error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
          }

          .video-error {
            width: 90%;
          }

          .camera-selector {
            margin-bottom: 10px;

            .el-select {
              width: 100%;
            }
          }

          .video-preview {
            width: 100%;
            height: 180px;
            background-color: #000;
            border-radius: 4px;
            margin-bottom: 10px;
            object-fit: cover;
          }

          .camera-controls {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 10px;

            .video-recording-info {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 12px;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
              color: white;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 500;
              animation: pulse 2s infinite;

              i {
                font-size: 16px;
              }
            }
          }

          .recorded-video {
            width: 100%;
            max-height: 300px;
            object-fit: contain;
            background: #000;
            margin-top: 10px;
          }
        }
      }
    }
  }

  // 中间谈话内容
  .talk-content {
    flex: 1;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 0;

    .section-title {
      padding: 12px 20px;
      margin: 0;
      background-color: #409EFF;
      color: #fff;
      font-size: 16px;
      font-weight: normal;
      flex-shrink: 0;
    }

    .message-list {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      padding-bottom: 180px;
      background: #fff;
      position: relative;
      height: 400px;

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
          border: 2px solid #e4e7ed;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .message-content {
          max-width: 70%;
          background: #f5f7fa;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

          .message-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            border-bottom: 1px solid #ebeef5;
            padding-bottom: 8px;

            .message-name {
              font-size: 14px;
              color: #606266;
              margin-right: 8px;
              font-weight: 500;
            }

            .message-time {
              font-size: 12px;
              color: #909399;
            }
          }

          .message-text {
            font-size: 14px;
            line-height: 1.6;
            color: #303133;
            word-break: break-word;
            white-space: pre-wrap;
            cursor: pointer;

            &.edited {
              position: relative;
              padding-left: 8px;
              border-left: 3px solid #e6a23c;
            }
          }
        }

        &.police {
          flex-direction: row-reverse;

          .message-avatar {
            margin-right: 0;
            margin-left: 12px;
            border-color: #409EFF;
          }

          .message-content {
            background: #ecf5ff;
            margin-right: 0;

            .message-header {
              .message-name {
                color: #606266;
              }
            }
          }
        }
      }
    }

    .input-area {
      position: fixed;
      bottom: 60px;
      left: 450px;
      right: 300px;
      background: #fff;
      padding: 15px 20px;
      border-top: 1px solid #eee;
      z-index: 10;

      .input-boxes {
        display: flex;
        gap: 15px;
        margin-bottom: 10px;

        .input-box {
          flex: 1;

          .input-label {
            font-size: 14px;
            color: #606266;
            margin-bottom: 8px;
          }

          &.prisoner .input-label {
            color: #409EFF;
          }

          &.police .input-label {
            color: #67C23A;
          }
        }
      }

      .input-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;

        .el-button {
          display: flex;

          align-items: center;
          justify-content: center;
          text-align: center;
        }
      }
    }

    .bottom-bar {
      position: fixed;
      bottom: 0;
      left: 450px;
      right: 300px;
      padding: 15px 20px;
      background: #fff;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      z-index: 10;

      .talk-status {
        display: flex;
        align-items: center;
        gap: 15px;

        .timer {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #666;
          font-size: 14px;
          white-space: nowrap;

          .recording-indicator {
            color: #f56c6c;
            font-weight: bold;
            animation: blink 1s infinite;
          }
        }
      }

      .action-buttons {
        .el-button {
          min-width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
      }
    }
  }

  // 右侧谈话模版
  .template-area {
    width: 300px;
    height: 100%;
    background-color: #fff;
    border-left: 1px solid #eee;
    display: flex;
    flex-direction: column;
    z-index: 1;

    .section-title {
      padding: 12px 20px;
      margin: 0;
      background-color: #409EFF;
      color: #fff;
      font-size: 16px;
      font-weight: normal;
      flex-shrink: 0;
    }

    .search-box {
      padding: 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      gap: 10px;
      flex-shrink: 0;

      .el-input {
        flex: 1;
      }

      .el-button {
        padding: 8px 15px;
      }
    }

    .template-categories {
      flex: 1;
      overflow-y: auto;
      padding: 15px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 3px;
      }

      .category-item {
        padding: 12px 15px;
        margin-bottom: 10px;
        border-radius: 4px;
        background-color: #f5f7fa;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 14px;
        color: #333;

        &:hover {
          background-color: #ecf5ff;
        }

        &.active {
          background-color: #409EFF;
          color: #fff;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .template-list {
      flex: 1;
      overflow-y: auto;
      padding: 15px;

      .empty-templates {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

      .template-items {
        .template-item {
          padding: 12px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background-color: #ecf5ff;
          }

          .template-title {
            font-size: 16px;
            color: #333;
            margin-bottom: 8px;
            font-weight: bold;
          }

          .template-brief {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
          }

          .template-meta {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 8px;

            .template-time {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
}

.end-talk-content {
  padding: 20px;

  .talk-info-summary {
    margin-bottom: 20px;

    .talk-duration {
      font-size: 16px;
      color: #606266;
      margin: 0;
    }
  }

  .talk-effect-input {
    .effect-label {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;

      &.required::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }

    .error-tip {
      color: #f56c6c;
      font-size: 12px;
      margin-top: 4px;
    }
  }
}

// 模版详情对话框样式
.template-detail {
  .template-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;

    .template-name-edit {
      margin-bottom: 10px;
    }

    .template-info {
      h3 {
        margin: 0 0 10px;
        font-size: 18px;
        color: #303133;
      }

      .template-meta {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .template-content {
    background-color: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    max-height: 300px;
    overflow-y: auto;

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.6;
      color: #303133;
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

.edit-history {
  .history-item {
    margin-bottom: 10px;
    padding: 8px;
    background-color: #f8f9fa;
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
        background-color: #fff3cd;
        color: #dc3545;
        text-decoration: line-through;
        padding: 2px 4px;
        border-radius: 2px;
      }

      .arrow {
        color: #909399;
      }

      .new-text {
        color: #28a745;
        padding: 2px 4px;
        border-radius: 2px;
        background-color: #e8f5e9;
      }
    }
  }

  .current-content {
    margin-top: 10px;
    padding: 8px;
    background-color: #e8f5e9;
    border-radius: 4px;

    .label {
      color: #28a745;
      margin-right: 8px;
    }

    .content {
      color: #333;
    }
  }
}

.recording-indicator {
  color: #f56c6c;
  font-weight: bold;
  animation: blink 1s infinite;
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
}

.template-list {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  .template-item {
    padding: 5px 10px;
    border: 1px solid var(--el-color-primary)  ;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: var(--el-color-primary-hb);
      color: #fff;
    }
  }
}

</style>
