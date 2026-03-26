<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2025-04-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
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
        谈话内容
      </div>
      <div class="message-list">
        <div
          v-if="!talkDetailData.audioText "
          class="empty-message"
        >
          <el-empty description="暂无谈话内容" />
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
    <div class="dialog-footer">
      <el-button @click="emits('close')">
        取 消
      </el-button>
    </div>

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
<script setup lang="ts">
import { ref } from 'vue'
import { getMemconInfo } from '@/api/mobileeducationplatform/case'
import { ElMessage } from 'element-plus'
import defaultAvatar from '@/assets/img/select_active.png'
import { useRouter } from 'vue-router'
const router = useRouter()
// import policeAvatar from '@/assets/img/select_active.png'

const props:any = defineProps(['id'])
const emits: any = defineEmits(['handle', 'close'])
let talkDetailData = ref('')

// 文件预览相关状态
const filePreviewVisible = ref(false)
const filePreviewTitle = ref('')
const previewType = ref('')
const previewUrl = ref('')
const textLoading = ref(false)

// 敏感词列表
// const sensitiveWords = [
//   '暴动', '越狱', '逃跑', '自杀', '自残', '斗殴', '打架', '闹事', '暴乱'
// ]

if (props.id) {
  let id = props.id
  getMemconInfo(id).then(res => {
    if (res.code === 200) {
      talkDetailData.value = res.data
      // 解析谈话内容
      if (talkDetailData.value.conversation) {
        try {
          // 如果conversation是字符串，尝试解析为JSON
          if (typeof talkDetailData.value.conversation === 'string') {
            talkDetailData.value.conversationList = JSON.parse(talkDetailData.value.conversation)
          } else if (Array.isArray(talkDetailData.value.conversation)) {
            // 如果已经是数组，直接使用
            talkDetailData.value.conversationList = talkDetailData.value.conversation
          } else {
            talkDetailData.value.conversationList = []
          }
        } catch (error) {
          ElMessage.error('解析谈话内容失败!')
          talkDetailData.value.conversationList = []
        }
      } else {
        talkDetailData.value.conversationList = []
      }
    }
  })
}

// function formatMessageTime(time) {
//   if (!time) return ''
//   const date = new Date(time)
//   const year = date.getFullYear()
//   const month = String(date.getMonth() + 1).padStart(2, '0')
//   const day = String(date.getDate()).padStart(2, '0')
//   const hours = String(date.getHours()).padStart(2, '0')
//   const minutes = String(date.getMinutes()).padStart(2, '0')
//   const seconds = String(date.getSeconds()).padStart(2, '0')
//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
// }

// function highlightSensitiveWords(text) {
//   if (!text) return text
//   let highlightedText = text
//   sensitiveWords.forEach(word => {
//     const regex = new RegExp(`(${word})`, 'gi')
//     highlightedText = highlightedText.replace(regex, '<span class="sensitive-word">$1</span>')
//   })
//   return highlightedText
// }

// 处理文件预览
function handleFilePreview(type, path) {
  previewType.value = type
  previewUrl.value = path

  switch (type) {
    case 'audio':
      filePreviewTitle.value = '音频预览'
      break
    case 'video':
      filePreviewTitle.value = '视频预览'
      break
    case 'word':
      filePreviewTitle.value = '文档预览'
      break
  }

  filePreviewVisible.value = true
}

// 谈话文件管理-跳转百度网盘
const talkFilesManaFn = () => {
  router.push('/audioManage')
  // let url = Config.URL.slice(0, -1) +
  //   Config.frontURLStr + Config.gateWay + 'cloud_disk/index.html?&folder=教育谈话&accessToken=' +
  //   store.userInfo.accessToken
  // window.open(url, '_blank')
}

// 处理文件下载
async function handleFileDownload(path, recordNo) {
  try {
    textLoading.value = true
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
    link.download = getWordFileName(recordNo, path)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('文件下载成功!')
  } catch (error) {
    ElMessage.error('文件下载失败!')
  } finally {
    textLoading.value = false
  }
}

function getWordFileName(recordNo, path) {
  if (!path) return ''
  const extension = path.toLowerCase().endsWith('.docx') ? '.docx' : '.doc'
  return `${recordNo}${extension}`
}

function formatDuration(duration) {
  duration = parseInt(duration)
  if (duration === 0) {
    return '0分0秒'
  }
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}分${seconds}秒`
}
</script>
<style lang="scss" scoped>
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

:deep(.sensitive-word) {
  color: #f56c6c;
  font-weight: bold;
  background-color: #fef0f0;
  padding: 0 2px;
  border-radius: 2px;
}

.talkFilesMana {
  justify-content: space-between;
}
</style>
