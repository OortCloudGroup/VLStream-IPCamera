<template>
  <div class="create_png">
    <div class="create_topbut">
      <el-button type="primary" :icon="Plus" class="custom-button" @click="AddButton">
        添加背景
      </el-button>
    </div>

    <div class="create_png_header">
      <div class="bj_big_box">
        <div
          v-for="(item, index) in boxList"
          :key="item.name || index"
          class="bj_box"
          :class="{ 'hover-green-border': hoverIndex === index }"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = -1"
        >
          <div class="bj_box_top">
            <div>{{ item.name }}</div>
            <div v-if="hoverIndex === index" class="bj_box_smallicon">
              <img style="margin-right: 16%;" clss="img" src="@/assets/img/table_manage/editor.png" alt="背景图片1" />
              <img class="img" src="@/assets/img/table_manage/trash-can.png" alt="背景图片1" />
            </div>
          </div>
          <div class="bj_box_but">
            <img class="img" src="@/assets/img/table_manage/admin_bg.png" alt="背景图片1" />
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="AddBaseMap"
      title="添加底图"
      width="680px"
      style="    height: 693px;
  border-radius: 24px;"
    >
      <div class="upload-area">
        <el-upload
          class="upload-demo"
          action="#"
          :show-file-list="false"
          :before-upload="beforeUpload"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
        >
          <el-card class="box-card" :class="{ 'active': isHovered }">
            <div class="image-upload">
              <el-icon>
                <Picture />
              </el-icon>
              <p class="upload-text">
                选择需要上传的底图
              </p>
              <p class="upload-tip">
                或将其拖放到此处
              </p>
              <p class="upload-advice">
                建议上传尺寸为800*480 px大小的png、jpg图片，图片大小不超过3MB
              </p>
            </div>
          </el-card>
        </el-upload>
      </div>
      <div class="input-area">
        <div
          style="font-family: MicrosoftYaHei;
font-size: 16px;
color: #121828;
font-weight: 400;margin-bottom: 20px;"
        >
          底图名称
        </div>
        <el-input v-model="imageName" placeholder="输入名称" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="AddBaseMap = false">
            取消
          </el-button>
          <el-button type="primary" @click="confrimAddDevice">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { Picture, Plus } from '@element-plus/icons-vue'

const AddBaseMap = ref(false)
const AddButton = () => {
  AddBaseMap.value = true
}
const imageName = ref('')
const beforeUpload = () => {
  return false
}

// 模拟数据
const boxList = ref([
  {
    name: '背景1'
  },
  { name: '背景1' },
  { name: '背景1' },
  { name: '背景1' },
  { name: '背景1' },
  { name: '背景1' }
])
const hoverIndex = ref(-1)

const isHovered = ref(false)
</script>

<style lang="scss">
.custom-button {
  padding: 16px;
  height: 56px;
  border-radius: 12px;
  margin-left: 20px;

}

.create_png {
  width: 100%;
  height: calc(100vh - 80px);
  color: var(--es-color);
  background-color: #FAFAFA 100%;
  min-width: 1118px;
  position: relative;

  .create_topbut {
      position: absolute;
      top: 0px;
  }
}

.create_png_header {
  position: absolute;
  top: 4vw;
  width: 100%;

}

.bj_big_box {
  display: flex;
  flex-wrap: wrap;

  .bj_box {
      width: 23%;
      background-color: #fff;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
      margin: 0 0 20px 20px;
      border-radius: 10px;
      padding: 20px;
      border: 1px solid transparent;

      .bj_box_but {
          width: 14vw;
          height: 8vw;
          margin-top: 20px;

          img {
              width: 100%;
              height: 100%;
              border-radius: 3px;
          }
      }

      .bj_box_top {
          display: flex;
          justify-content: space-between;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #111827;
          line-height: 24px;
          font-weight: 400;
      }

      .bj_box_smallicon {
          display: flex;

          height: 24px;

          img {
              width: 100%;
              height: 100%;

          }
      }

  }

  .hover-green-border {
      border-color: var(--el-color-primary);
      ;
  }
}

//
.upload-container {
  width: 400px;
  padding: 20px;
  margin: 0 auto;
}

.custom-dialog {
  position: relative;
}

.custom-dialog .el-dialog__body {
  // 去除弹窗内容区域的内边距
  padding: 0 !important;
  box-sizing: border-box;
}

.upload-area {
  width: 100% !important;
  box-sizing: border-box !important;
  margin-top: 30px;
}

.el-upload {
  width: 100% !important;
}

.upload-demo {
  width: 100% !important;
  box-sizing: border-box !important;
}

.box-card {
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: transparent;
  padding: 40px 0;
  text-align: center;
  width: 100%;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.box-card.active {
  border-color: #c2e7b0;
  background-color: #f2f9ed;
}

.image-upload {
  margin-bottom: 10px;
}

.upload-text {
  color: #409eff;
  margin-bottom: 5px;
}

.upload-tip {
  color: #606266;
  margin-bottom: 5px;
}

.upload-advice {
  color: #909399;
  font-size: 12px;
}

.input-area {
  margin-top: 20px;
}

.button-area {
  text-align: right;
}

.dialog-footer {
  position: absolute;
  right: 20px;
  bottom: 20px;
  padding: 0;
  border-top: none;
}
</style>
