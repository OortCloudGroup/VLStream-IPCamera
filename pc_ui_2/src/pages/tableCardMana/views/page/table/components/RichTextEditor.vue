<template>
  <div class="card-editor">
    <div v-if="receivedData?.name" class="card-editor_img">
      <img style="width: 100%; height: 100%;" :src="getImageUrl()" />
    </div>
    <div v-else class="card-editor_img">
      <span>请选择左侧模板预览</span>
    </div>
    <div class="editor-toolbar" />

    <div class="action-buttons">
      <div v-if="receivedData?.name && (tableItem.status === 1 || tableItem.status ===2)" class="can-but" @click="startPic">
        <img src="@/assets/img/table_manage/refresh.png" />刷新
      </div>
      <div class="can-but can-but-w" @click="designerTable">
        <img src="@/assets/img/table_manage/designer.png" />设计
      </div>
      <div class="can-but can-but-w" @click="advanceFunc">
        <img src="@/assets/img/table_manage/settings.png" />高级
      </div>
    </div>
    <el-drawer v-model="createPngDrawerVis" title="设计" direction="rtl" size="80%" @close="getCardList">
      <CreatePng v-if="createPngDrawerVis" :png-data="receivedData" @call-api="getCardList" />
    </el-drawer>
    <el-dialog v-model="dialogBattchVisible" :title="isDefalutBatch?'恢复默认页':'批量刷新'" :width="clacPXToVW(680)">
      <BatchRefresh v-if="dialogBattchVisible" :queue-arr="currentQueueArr" :is-set-default="isDefalutBatch" />
    </el-dialog>

    <el-dialog v-model="dialogAdvanceVisible" top="10vh" title="高级设置" width="80%">
      <AdvanceRefresh v-if="dialogAdvanceVisible" :template-data="receivedData" :tables="tables" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'
import { useUserStore } from '@/store/modules/user'
import CreatePng from './createPng.vue'
import Config from '@/config/index'
import BatchRefresh from './batchRefresh.vue'
import { clacPXToVW } from '@/utils/index'
import { ElMessage } from 'element-plus'
import AdvanceRefresh from './advanceRefresh.vue'

const store = useUserStore()
// const name = ref('李晓平')
const props = defineProps({
  receivedData: {
    type: Object,
    default: null
  },
  tableItem: {
    type: Object,
    default: null
  },
  tables: {
    type: Array,
    default: () => []
  }
})

const dialogAdvanceVisible = ref(false)
const advanceFunc = () => {
  dialogAdvanceVisible.value = true
}

const emit = defineEmits(['getCardList'])
const getCardList = () => {
  emit('getCardList')
}

const getImageUrl = () => {
  const baseUrl = Config.URL + Config.gateWay + 'oortcloud-table/' + 'table/imgShow/'
  const token = store.getStoreToken()
  const id = props.receivedData?.id || ''
  return `${baseUrl}${id}?token=${token}&` + new Date().getTime()
}

const createPngDrawerVis = ref(false)
const designerTable = () => {
  createPngDrawerVis.value = true
}

const startPic = async() => {
  currentQueueArr.value = [
    {
      name: props.tableItem.name,
      path: props.receivedData?.id
    }
  ]
  dialogBattchVisible.value = true
}

const currentQueueArr = ref([])
const dialogBattchVisible = ref(false)
const isDefalutBatch = ref(false)
const startAllPic = async(defaultImage) => {
  isDefalutBatch.value = !!defaultImage
  let tempQueueArr = []
  props?.tables.forEach(element => {
    tempQueueArr.push(
      {
        name: element.name,
        path: defaultImage ? defaultImage[0]?.id : props.receivedData?.id
      }
    )
  })
  if (tempQueueArr.length === 0) {
    ElMessage({
      message: '请勾选需要操作的桌牌',
      type: 'warning'
    })
    return
  }
  currentQueueArr.value = tempQueueArr
  dialogBattchVisible.value = true
}
import { onMounted, onUnmounted } from 'vue'
import bus from '@/utils/bus'
onMounted(() => {
  bus.$on('startAllPic', startAllPic)
})

onUnmounted(() => {
  bus.$off('startAllPic', startAllPic)
})

</script>

<style lang="scss" scoped>
.card-editor {
  width: 100%;
  position: relative;
}

.loading_div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  backdrop-filter: blur(5px); /* 关键属性 - 背景模糊 */
  -webkit-backdrop-filter: blur(10px); /* Safari 支持 */
}

.statuText {
  width: 100;
  text-align: left;
  font-size: 22px;
  color: #000;
}

.card-editor_img {
  width: 100%;
  margin: 0 auto;
  border: 1px solid var(--el-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    color: var(--el-color-primary);
    font-size: 20px;
  }
}

.no_data {
  min-height: 516px;
}

.toolbar {
  display: flex;
  padding: 10px;
  border: 1px solid lavender;
}

.header {
  display: flex;
  align-items: center;
  background-color: #c91d3a;
  color: white;
  padding: 20px;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.company-name {
  font-size: 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: #c91d3a;
  color: white;
}

.name {
  width: 300px;
  height: 80px;
  border: 1px solid white;
  margin-bottom: 20px;
  text-align: center;
  font-size: 50px;
  color: white;
  background: transparent;
  border: 1px solid white;
}

.position {
  font-size: 24px;
}

.editor-toolbar {
  display: flex;
  height: 56px;
  justify-content: space-between;

  .arrow {
    display: flex;
    background-color: #FAFAFA;
    /* text-align: center; */
    align-items: center;
    width: 20%;
    justify-content: space-between;
    padding: 10px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #121828;
    border-radius: 12px;

  }

  .arrowwu {
    display: flex;
    background-color: #FAFAFA;
    /* text-align: center; */
    align-items: center;
    width: 10%;
    justify-content: space-between;
    padding: 10px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #121828;
    border-radius: 12px;
  }

  .arrowwu1 {
    display: flex;
    background-color: #FAFAFA;
    /* text-align: center; */
    align-items: center;
    width: 13%;
    justify-content: space-between;
    padding: 10px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #121828;
    border-radius: 12px;
  }

  .arrowwu2 {
    display: flex;
    background-color: #FAFAFA;
    /* text-align: center; */
    align-items: center;
    width: 7%;
    justify-content: space-between;
    padding: 10px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #121828;
    border-radius: 12px;
  }

  .arrowwu3 {
    display: flex;
    background-color: #FAFAFA;
    /* text-align: center; */
    align-items: center;
    width: 25%;
    justify-content: space-between;
    padding: 10px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #121828;
    border-radius: 12px;
  }

  .arrowwu4 {
    display: flex;
    background-color: #FAFAFA;
    /* text-align: center; */
    align-items: center;
    width: 13%;
    justify-content: space-between;
    padding: 10px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #121828;
    border-radius: 12px;

  }

  .glow {
    color: #00B05A;
    text-shadow: 0 0 5px #00B05A, 0 0 1px #00B05A, 0 0 1px #00B05A;
    margin-right: 10px;

  }
}

.el-select,
.el-button {
  margin-right: 10px;
}

.action-buttons {
  display: flex;
  height: 64px;
  .can-but {
    margin-right: 12px;
    cursor: pointer;
    min-width: 132px;
    height: 48px;
    background: var(--el-color-primary);
    border-radius: 12px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 400;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0 16px;
    border: 1px solid rgba(236,239,242,1);
    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
  }

  .can-but-w {
    background-color: #fff;
    color: #333;
  }

  .can-but:hover  {
    border:1px solid var(--el-color-primary);
  }
}

</style>
