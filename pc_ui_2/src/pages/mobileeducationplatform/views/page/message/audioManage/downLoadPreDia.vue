<template>
  <div class="download-content-wrapper">
    <div class="download-content">
      <!-- 左侧预览区域 -->
      <div class="preview-section">
        <div class="preview-content">
          <h3 class="content-title">
            文字内容
          </h3>
          <div class="content-text">
            {{ fileData?.recognizedContent }}
          </div>
        </div>
      </div>
      <!-- 右侧配置区域 -->
      <div class="config-section">
        <!-- 下载格式 -->
        <div class="config-group">
          <h3 class="config-title">
            下载格式
          </h3>
          <div class="format-options">
            <div
              v-for="format in formatOptions"
              :key="format.type"
              class="format-option"
              :class="{ selected: selectedFormat === format.type }"
              @click="selectFormat(format.type)"
            >
              <el-checkbox
                :model-value="selectedFormat === format.type"
                @change="selectFormat(format.type)"
              />
              <div class="format-icon" :class="format.iconClass">
                <i :class="format.icon" />
                <span class="format-text">{{ format.extension }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 下载内容 -->
        <div class="config-group">
          <h3 class="config-title">
            下载内容
          </h3>
          <div class="content-options">
            <el-radio-group v-model="contentType" class="content-radio-group">
              <el-radio value="text" class="content-radio">
                <span class="radio-label">文本</span>
              </el-radio>
              <el-radio value="audio" class="content-radio">
                <span class="radio-label">音频</span>
              </el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 显示信息 -->
        <div class="config-group">
          <h3 class="config-title">
            显示信息
          </h3>
          <div class="display-options">
            <div class="option-item">
              <span class="option-label">无分段文稿</span>
              <el-switch v-model="displayOptions.noSegmentation" />
            </div>
            <div class="option-item">
              <span class="option-label">说话人</span>
              <el-switch v-model="displayOptions.speaker" />
            </div>
            <div class="option-item">
              <span class="option-label">时间码</span>
              <el-switch v-model="displayOptions.timestamp" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="dialog-footer">
      <el-button class="cancel-btn" @click="handleCancel">
        取消
      </el-button>
      <el-button type="primary" class="download-btn" @click="handleDownload">
        下载
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['cancel', 'download'])

const formatOptions = [
  { type: 'txt', extension: 'txt', icon: 'el-icon-document-txt', iconClass: 'txt-icon' },
  { type: 'mp3', extension: 'mp3', icon: 'el-icon-video-play', iconClass: 'mp3-icon' }
]

const handleCancel = () => {
  emit('close')
}

const handleDownload = () => {
  // 选中为文本则 下载txt
  if (contentType.value === 'text') {
    const txtContent = props.fileData.recognizedContent
    const blob = new Blob([txtContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = props.fileData.name + '.txt'
    a.click()
    URL.revokeObjectURL(url)
  } else if (contentType.value === 'audio') {
    window.open(props.fileData.filePath, '_blank')
  }

  emit('download')
}

const selectedFormat = ref('docx')
const contentType = ref('text')
const displayOptions = ref({
  noSegmentation: false,
  speaker: false,
  timestamp: false
})

const selectFormat = (type: string) => {
  selectedFormat.value = type
}

const props = defineProps({
  fileData: {
    type: Object,
    default: () => ({})
  }
})

</script>

<style scoped lang="scss">
.download-content-wrapper {
  background: #fff;
  border-radius: 12px;
}

.download-content {
  display: flex;
  gap: 30px;
  min-height: 400px;
  padding: 20px;
}

.preview-section {
  flex: 1;

  .preview-header {
    margin-bottom: 16px;

    .preview-label {
      font-size: 14px;
      color: #606266;
    }
  }

  .preview-title {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 24px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }

  .preview-content {
    .content-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
    }

    .content-text {
      font-size: 14px;
      line-height: 1.6;
      color: #606266;
      background-color: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      max-height: 280px;
      overflow-y: auto;
    }
  }
}

.config-section {
  width: 300px;
  flex-shrink: 0;
}

.config-group {
  margin-bottom: 32px;

  .config-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 16px;
  }
}

.format-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  .format-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 80px;

    &:hover {
      border-color: #409eff;
    }

    &.selected {
      border-color: #409eff;
      background-color: #ecf5ff;
    }

    .format-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      i {
        font-size: 24px;
      }

      .format-text {
        font-size: 12px;
        font-weight: 500;
      }

      &.docx-icon {
        i {
          color: #2b579a;
        }
        .format-text {
          color: #2b579a;
        }
      }

      &.pdf-icon {
        i {
          color: #d93025;
        }
        .format-text {
          color: #d93025;
        }
      }

      &.txt-icon {
        i {
          color: #7b68ee;
        }
        .format-text {
          color: #7b68ee;
        }
      }
    }
  }
}

.content-options {
  .content-radio-group {
    display: flex;
    gap: 24px;

    .content-radio {
      :deep(.el-radio__label) {
        padding-left: 8px;
        font-size: 14px;
        color: #303133;
      }
    }
  }
}

.display-options {
  .option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;

    &:not(:last-child) {
      border-bottom: 1px solid #f0f0f0;
    }

    .option-label {
      font-size: 14px;
      color: #303133;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 20px 20px;

  .cancel-btn {
    padding: 8px 20px;
    border-radius: 20px;
  }

  .download-btn {
    padding: 8px 20px;
    border-radius: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
  }
}
</style>
