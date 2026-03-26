<template>
  <!-- 中间录音内容区域 -->
  <div v-loading="loading" class="talk-content" element-loading-text="网络请求中...">
    <div v-if="messages" class="message-list">
      <div class="message-item">
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
      <el-empty description="暂无录音内容" />
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
          <p>点击开始录音按钮开始录音</p>
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
          {{ isRecording ? '录制中...' : '开始录音' }}
        </el-button>
        <el-button
          v-else
          type="danger"
          size="large"
          :disabled="!isRecording"
          class="control-btn stop-btn"
          @click="stop"
        >
          结束录音
        </el-button>
      </div>
      <div v-if="errorMsg" class="error-message">
        <el-alert :title="errorMsg" type="error" :closable="false" show-icon />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { workflowUploadFile } from '@/api/aiApaas'
import { useUserStore } from '@/store/modules/user'
import Config from '@/config'
import { bigFileUpload } from '@/utils/uploadFileChunk'

const store = useUserStore()

// 录音相关状态
const isRecording = ref(false)
const hasRecording = ref(false)
const elapsed = ref(0)
const statusLabel = ref('空闲')
const errorMsg = ref(null)
const segmentsUploaded = ref(0)
const messages = ref('')
const hasRecorded = ref(false)

// 录音相关变量
let mediaRecorder = null
let stream = null
let continuousChunks = []
let elapsedTimer = null
const workflowId = ref('')
const waveform = ref(null)

// 时间格式化
const formatTime = (sec) => {
  if (!sec) return '0:00'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// 录音功能
function chooseMime() {
  const candidates = [
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
  return ''
}

const bigAudioBlob = ref(null)

/* 开始录音 */
async function start() {
  messages.value = ''
  if (isRecording.value) return
  errorMsg.value = null
  try {
    // 检查浏览器是否支持 getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('当前浏览器未授权录音权限，或者不支持录音功能')
    }
    // 主动请求用户录音权限
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mime = chooseMime()
    mediaRecorder = mime ? new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 128000 })
      : new MediaRecorder(stream, { audioBitsPerSecond: 128000 })

    continuousChunks = []
    segmentsUploaded.value = 0
    elapsed.value = 0
    hasRecording.value = true

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

    // start with timeslice -> browsers will emit dataavailable every 3000 ms
    mediaRecorder.start(2000)
  } catch (err) {
    handleError(err)
  }
}

/* 停止录制（由用户点击） */
async function stop() {
  if (!isRecording.value || !mediaRecorder) return
  statusLabel.value = '停止中'
  try {
    mediaRecorder.stop()
  } catch (e) {
    // 某些极端情况下 stop 可能抛错
    handleError(e)
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
  // 如果是第一段，直接使用（包含完整文件头）
  if (index === 0) return webmChunk
  const mime = chooseMime() || (continuousChunks[0] && continuousChunks[0].type) || 'audio/webm'

  // 合并前面的片段
  const mergedChunks = continuousChunks.slice(0, index + 1)
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

const startWorkflow = async() => {
  const params = new URLSearchParams({ accessToken: store.token, ...Config.headers })
  const es = new EventSource(Config.URL + Config.gateWay + 'oortcloud-ai/workflows/v1/workflowStart?' + params)
  // 2. 监听通用事件
  es.onopen = function() {
    console.log('Connection opened')
  }
  es.onerror = function(e) {
    console.error('Error:', e)
  }

  // 3. 监听特定事件（对应服务端的 event:xxx）
  es.addEventListener('update', function() {
    // 更新事件处理
  })

  // 4. 监听未命名事件（服务端未指定event时触发）
  es.onmessage = function(e) {
    try {
      const data = JSON.parse(e.data)
      if (!data.event) {
        workflowId.value = data.work_id
      }
      if (data.event === 'workflow_finished') {
        console.log('workflow_finished', data)
        if (data && data.data && data.data.outputs && data.data.outputs.text) {
          messages.value = data.data.outputs.text
        }
      }
    } catch (error) {
      console.warn('warn:', error)
    }
  }
}

/* 真正的上传函数，使用 FormData（file 字段） */
async function uploadBlob(blob) {
  const fd = new FormData()
  fd.append('accessToken', store.token)
  fd.append('file', blob)
  fd.append('id', workflowId.value)
  fd.append('tag', 'talkAudio')
  workflowUploadFile(fd)
}

const loading = ref(false)
/* 停止时的统一处理：合并 chunks 并上传完整录音 */
async function stopRecordingHandler() {
  clearInterval(elapsedTimer)
  isRecording.value = false
  statusLabel.value = '已停止'
  hasRecording.value = true

  // 停掉麦克风流
  try {
    if (stream) stream.getTracks().forEach(t => t.stop())
  } catch (e) {
    console.warn('停止音频流失败:', e)
  }

  // 合并并上传完整文件
  if (!continuousChunks.length) {
    return
  }
  const mime = chooseMime() || (continuousChunks[0] && continuousChunks[0].type) || 'audio/webm'
  bigAudioBlob.value = new Blob(continuousChunks, { type: mime })

  // 调用大文件上传接口

  // 开始上传大文件
  const fileName = `audio_${Date.now()}.wav`
  const data = {
    file: bigAudioBlob.value,
    params: {
      accessToken: store.token,
      name: fileName
    },
    onSuccess: (res) => {
      loading.value = false
      console.log('res, audio--->', res)
      addFileToList(res.file.url, fileName)
    },
    onError: (err) => {
      loading.value = false
      console.log('err, audio--->', err)
    },
    onProgress: (percentage) => {
      console.log('percentage, audio--->', percentage)
    }
  }
  loading.value = true
  bigFileUpload(data)

  ElMessage.success('录音完成')
}

/* 错误统一处理 */
function handleError(err, extraMsg) {
  console.error(err)
  errorMsg.value = (extraMsg ? extraMsg + ': ' : '') + (err && err.message ? err.message : String(err))
  statusLabel.value = '错误'
  isRecording.value = false
}

const emit = defineEmits(['close'])
import { saveFile } from '@/api/mobileeducationplatform/case'
const addFileToList = async(filePath, fileName) => {
  const params = {
    accessToken: store.token,
    title: fileName,
    duration: elapsed.value + '',
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

// 生命周期
onMounted(() => {
  // 初始化
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
})
</script>

<style lang="scss" scoped>
.audio-record-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部标题栏 */
.header {
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-icon {
  color: #67c23a;
  font-size: 20px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.status-badges {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.badge {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 12px;
  background-color: #f0f9ff;
  color: #409eff;
  border: 1px solid #b3d8ff;
}

.badge.security {
  background-color: #f0f9ff;
  color: #67c23a;
  border-color: #b3e19d;
}

/* 中间谈话内容 */
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
    min-height: 400px;

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
        }
      }
    }
  }
}

.recorder-container {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
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

</style>
