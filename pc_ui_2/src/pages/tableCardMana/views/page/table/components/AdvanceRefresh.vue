<!--
 * @Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2025-06-12 14:47:29
 * @Last Modified by:  兰舰
 * @Copyright 奥尔特云(深圳)智慧科技 aPaaS-front-team. All rights reserved.
!-->
<template>
  <div class="advance_div">
    <div class="advance_div_left">
      <div class="advance_div_left_header">
        批量数据设置
      </div>

      <div class="elements">
        <div v-for="(item, index) in elementArr" :key="index" class="elements_item">
          <span v-if="item.text">替换 <span style="color: red">{{ item.text }} </span>内容 （多个用逗号隔开）</span>
          <el-input
            v-if="item.text"
            v-model="tempArr[index]"
            :rows="2"
            type="textarea"
            placeholder="请输入替换内容，如多个请用逗号隔开, 为空则不替换"
          />
        </div>
      </div>
      <div class="opr_buttons">
        <span v-if="showProgress && finishCount !== count">正在生成预览图({{ finishCount }} / {{ count }})</span>
        <span v-if="showProgress && finishCount === count">图片生成完成！共 {{ finishCount }} 张图片</span>
        <el-button type="primary" @click="gengerPic">
          生成批量预览
        </el-button>
        <el-button @click="plRefresh">
          开始批量刷新
        </el-button>
      </div>
    </div>
    <div class="advance_div_right">
      <div class="advance_div_left_header">
        批量图片预览
      </div>
      <div class="preview_temp_preview_big">
        <PreviewPure v-if="previewTempData && previewTempArr.length === 0" :data="previewTempData" />
      </div>

      <!-- <img style="width: 100%; height: 100%;" :src="getImageUrl()" /> -->
      <div class="preview_temp_preview">
        <div v-for="(item,index) in previewTempArr" :key="index" class="preview_temp_preview_item">
          <PreviewPure :data="item" @save-base64="saveBase64" />
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogBattchVisible" title="批量刷新" :width="clacPXToVW(680)">
      <BatchRefresh v-if="dialogBattchVisible" :queue-arr="currentQueueArr" />
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import PreviewPure from '@/components/pngEditor/editor/src/components/common/PreviewPure.vue'
import { ElMessage } from 'element-plus'
import BatchRefresh from './batchRefresh.vue'
import { clacPXToVW } from '@/utils/index'

const props = defineProps({
  templateData: {
    type: Object,
    default: null
  },
  tables: {
    type: Array,
    default: () => []
  }
})

const count = ref(0)
const finishCount = ref(0)
const showProgress = ref(false)

import { rotateMatrixClockwise } from '@/utils/index'
const previewTempArr = ref([])
const gengerPic = () => {
  base64Arr.value = []
  previewTempArr.value = []
  showProgress.value = true

  let indexArr = []
  let existValueArr = []
  tempArr.value.forEach((item, index) => {
    if (item) {
      indexArr.push(index)
      item = item.replace(/，/g, ',')
      existValueArr.push(item.split(','))
    }
  })

  const newTempA = rotateMatrixClockwise(existValueArr)
  // console.log(rotateMatrixClockwise(existValueArr))

  previewTempArr.value = newTempA.map((item) => {
    let temp = JSON.parse(JSON.stringify(previewTempData.value))
    item.forEach((item, index) => {
      temp.elements[indexArr[index]].text = item
    })
    return temp
  })
  count.value = previewTempArr.value.length
}

const base64Arr = ref([])
const saveBase64 = (base64) => {
  base64Arr.value.push(base64)
  finishCount.value = base64Arr.value.length
}

const currentQueueArr = ref([])
const dialogBattchVisible = ref(false)
const plRefresh = async() => {
  if (base64Arr.value.length === 0) {
    ElMessage.error('请先生成预览图')
    return
  }
  if (props.tables.length === 0) {
    ElMessage.error('请先勾选桌牌')
    return
  }
  currentQueueArr.value = []
  // 判断一那个为主
  if (base64Arr.value.length > props.tables.length) {
    props.tables.forEach((item, index) => {
      currentQueueArr.value.push(
        {
          name: item.name,
          base64: base64Arr.value[index]
        }
      )
    })
  } else {
    base64Arr.value.forEach((item, index) => {
      currentQueueArr.value.push(
        {
          name: props.tables[index].name,
          base64: item
        }
      )
    })
  }
  dialogBattchVisible.value = true
}

const elementArr = ref([])
const tempArr = ref([])
const previewTempData = ref(null)
onMounted(() => {
  if (!props.templateData) return
  previewTempData.value = JSON.parse(props.templateData?.template)
  elementArr.value = JSON.parse(props.templateData?.template).elements
  // console.log('elementArr.value', props.templateData, elementArr.value)
  elementArr.value.forEach(() => {
    tempArr.value.push('')
  })
  console.log('tempArr.value', props.tables)
})

</script>

<style lang="scss" scoped>

 .advance_div {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 75vh;
    &_left {
      width: 40%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      &_header {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #f5f5f5;
        color: #333;
      }
    }
    &_right {
        height: 100%;
      width: 60%;
    }
 }

 .elements {
  display: flex;
  width: 100%;
  gap: 10px;
  flex-direction: column;
  height: calc(100% - 40px);
  overflow: auto;
  &_item {
    width: 100%;
    display: flex;
    flex-direction: column;
    span {
      margin: 10px 0;
      font-size: 12px;
      color: #333;
    }
  }
 }

 .opr_buttons {
  width: 100%;
  display: flex;
  align-items: center;
  height: 48px;
  justify-content: flex-end;
 }

 .preview_temp_preview {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
    gap: 12px;
    &_item {
      overflow: hidden;
      border: 1px solid #ccc;
      width: 400px;
      height: 240px;
    }
 }

 .preview_temp_preview_big {
    margin: 20px;
    border: 1px solid #ccc;
 }
</style>
