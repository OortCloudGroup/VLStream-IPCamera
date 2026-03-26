<template>
  <div v-show="isProgressShow" class="fileUppage flexRowAC">
    <el-progress
      class="fileUpPro"
      :percentage="progressPercentage"
    />
    <div v-if="upSuccess" class="successD flexRowAC">
      <template v-if="props.isRepeat">
        <el-icon class="ic1">
          <WarningFilled />
        </el-icon>
        <span class="successS S1">当前文件已存在</span>
      </template>
      <template v-else>
        <el-icon class="ic">
          <SuccessFilled />
        </el-icon>
        <span class="successS">文件上传成功</span>
      </template>
    </div>
    <div v-else class="successD flexRowAC">
      <el-icon class="ic">
        <Loading />
      </el-icon>
      <span class="successS">{{ localFileLoding ? '文件加载中' : '文件上传中...' }}</span>
    </div>
    <div v-if="props.data" class="filesD flexRowAC">
      <calc-file-type-img class="urlBox" :data="props.data.title" />
      &nbsp;&nbsp;
      {{ props.data.title }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import CalcFileTypeImg from '@/components/calcFileTypeImg.vue'

const props = defineProps(['data', 'isRepeat'])
let upSuccess = ref(false)
let localFileLoding = ref(true)

const isProgressShow = ref(false)// 进度条
const progressPercentage = ref(0)// 进度条数值
const getRandomPercentage = ref(0)// 随机数
let loadingTimmer: any = null
let successTimmer: any = null

// 随机数
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  getRandomPercentage.value = Math.floor(Math.random() * (max - min) + min)
}
const updateProgress = () => {
  if (progressPercentage.value < getRandomPercentage.value) {
    progressPercentage.value += 1
    localFileLoding.value = false
    loadingTimmer = setTimeout(updateProgress)
  } else {
    successTimmer = setTimeout(() => { // 假设2秒后获得接口数据
      progressPercentage.value = 100
      upSuccess.value = true
      // 停止进度条更新
      clearTimeout(loadingTimmer)
      clearTimeout(successTimmer)
    }, 2000)
  }
}

// 开始
const handleStartElecSimulation = () => {
  getRandomInt(50, 91)
  isProgressShow.value = true
  progressPercentage.value = 0// 进度值初始化
  updateProgress()
}

watch(() => props.data, (val) => {
  if (val) handleStartElecSimulation()
}, { immediate: true })
</script>
<style lang="scss" scoped>
.fileUppage {
  width: 100%;
  gap: 20px;
  position: relative;

  .fileUpPro {
    flex: 1;
  }

  .successD {
    justify-content: flex-end;
    width: 120px;
    flex-shrink: 0;
    gap: 4px;
    font-size: 14px;
    color: var(--el-color-primary);

    .ic {
      font-size: 16px;
    }

    .ic1{
      color: rgb(230, 162, 60);
    }
  }

  .S1{
    color: rgb(230, 162, 60);
  }
}

.filesD {
  position: absolute;
  left: 20px;
  top: 0px;
  color: #fff;
  height: 36px;
  font-size: 14px;
  line-height: 12px;

  .urlBox {
    height: 24px;
    width: auto;
    background-size: cover;
  }
}

:deep(.el-progress-bar__outer){
  height: 36px !important;
}

:deep(.el-progress__text){
  font-size: 24px !important;
}
</style>
