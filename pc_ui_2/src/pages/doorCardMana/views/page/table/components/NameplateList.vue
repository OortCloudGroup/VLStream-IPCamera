<template>
  <div class="nameplate-list">
    <div class="nameplate-list—header">
      <span>模板列表</span>
    </div>
    <div class="search_header">
      <el-input
        v-model="searchName"
        :prefix-icon="Search"
        placeholder="请输入模板名称"
        clearable
        @clear="getNameplateList"
        @change="getNameplateList"
      />
    </div>
    <div class="add_temp" @click="addNewPng">
      <oort-svg-icon class="elmenuIconImg" name="shape_combination" fill="node" width="34" height="34" />
      <span>添加空白</span>
    </div>
    <div class="img_list">
      <div
        v-for="(nameplate, index) in props.cardData"
        :key="index + nameplate.id"
        class="img_list_item"
        :class="{ 'img_list_item_active': activeIndex === nameplate.id }"
        @click="activeImage(nameplate, index)"
      >
        <div class="img_header">
          <div class="img_header_left">
            <span>
              {{ nameplate.name }}
            </span>
            <span v-if="nameplate.is_default">
              默认
            </span>
          </div>
          <el-popover placement="bottom" :width="clacPXToVW(140)" trigger="hover" popper-class="popover_tem_panel">
            <template #reference>
              <el-icon><MoreFilled /></el-icon>
            </template>
            <div class="img_opr_list">
              <div class="img_opr_list_item" @click="renameCard(nameplate)">
                <oort-svg-icon name="table_edit" width="20" height="20" />
                <span>重命名</span>
              </div>
              <div class="img_opr_list_item" @click="deleteCard(nameplate)">
                <oort-svg-icon name="table_del" width="20" height="20" />
                <span>删除</span>
              </div>
              <div v-if="!nameplate.is_default" class="img_opr_list_item" @click="setDefault(nameplate)">
                <oort-svg-icon name="table_resetps" width="20" height="20" />
                <span>设为默认页</span>
              </div>
            </div>
          </el-popover>
        </div>
        <div class="img_content">
          <img :src="getImageUrl(nameplate.id)" alt="Nameplate Image" />
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogTableNameVis" title="重命名" :width="clacPXToVW(680)" class="add_pic_dialog">
      <el-form>
        <div class="addkk">
          <div class="addkk_text">
            名称
          </div>
          <el-input v-model="tableName" class="addkk_text_input" autocomplete="off" />
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="dialog-footer-btn" @click="dialogTableNameVis = false">
            取消
          </el-button>
          <el-button class="dialog-footer-btn" type="primary" @click="confrimAddDevice">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-drawer v-model="createPngDrawerVis" title="添加" direction="rtl" size="80%" @close="closeCreatePngDrawer">
      <CreatePng v-if="createPngDrawerVis" />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, watch, onMounted } from 'vue'
import { tableImgDelete, tableImgSetDefault, tableImgEdit } from '@/api/tableService/index_door'
import { useUserStore } from '@/store/modules/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import CreatePng from './createPng.vue'
import Config from '@/config/index'
import { Search } from '@element-plus/icons-vue'
import { clacPXToVW } from '@/utils/index'

const store = useUserStore()

const props = defineProps({
  cardData: {
    type: Array,
    default: () => []
  },
  tableItem: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['getCardList', 'open-popup', 'send-data'])
// 图片地址
const getImageUrl = (id) => {
  const baseUrl = Config.URL + Config.gateWay + 'oortcloud-tablet/' + 'tablet/img_show/'
  const token = store.getStoreToken()
  return `${baseUrl}${id}?token=${token}&` + new Date().getTime()
}

// 删除卡片
const deleteCard = async(img) => {
  await ElMessageBox.confirm(
    '确定要删除此卡片吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  const params = {
    accessToken: store.getStoreToken(),
    id: img.id
  }

  const res = await tableImgDelete(params)
  if (res.code === 200) {
    emit('getCardList')
    ElMessage.success('删除成功')
  }
}

const searchName = ref('')
const getNameplateList = () => {
  emit('getCardList', searchName.value)
}
const closeCreatePngDrawer = () => {
  emit('getCardList')
}

const createPngDrawerVis = ref(false)
const addNewPng = () => {
  createPngDrawerVis.value = true
}

// watch(() => props.tableItem, () => {
//   activeImage(props.tableItem.image)
// })

const activeIndex = ref('')
const activeImage = (item) => {
  const data = item
  activeIndex.value = item.id
  emit('send-data', data)
}

watch(() => props.cardData, () => {
  if (props.cardData.length > 0) {
    activeImage(props.cardData[0])
  }
})

const currentTableT = ref(null)
const renameCard = (data) => {
  tableName.value = data.name
  currentTableT.value = data
  dialogTableNameVis.value = true
}
const tableName = ref('')
const dialogTableNameVis = ref(false)
const confrimAddDevice = async() => {
  if (tableName.value === '') {
    ElMessage.warning('请输入名称')
    return
  }
  const params = {
    accessToken: store.getStoreToken(),
    id: currentTableT.value.id,
    name: tableName.value
  }
  let res = await tableImgEdit(params)
  if (res.code === 200) {
    dialogTableNameVis.value = false
    ElMessage.success('操作成功')
    getNameplateList()
  }
}

const setDefault = async(data) => {
  // 删除卡片
  await ElMessageBox.confirm(
    '确定将此模板设置为默认？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  const params = {
    accessToken: store.getStoreToken(),
    id: data.id
  }
  let res = await tableImgSetDefault(params)
  if (res.code === 200) {
    getNameplateList()
  }
}

onMounted(() => {
  if (props.cardData.length > 0) {
    activeImage(props.cardData[0])
  }
})

</script>

<style lang="scss" scoped>
.nameplate-list {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.nameplate-list—header {
  display: flex;
  width: 220px;
  margin: 0 auto;
  height: 40px;
  align-items: center;
  span {
    font-size: 18px;
    color: #121828;
    letter-spacing: 0.23px;
    line-height: 27px;
    font-weight: 400;
  }
}

.search_header {
  display: flex;
  width: 220px;
  margin: 0 auto;
  height: 60px;
  align-items: center;
}

:deep(.el-input__wrapper) {
  background-color: #FAFAFA;
}

.add_temp {
  cursor: pointer;
  display: flex;
  width: 220px;
  height: 172px;
  margin: 0 auto;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: #FAFAFA;
  border-radius: 8px;
  span {
    font-size: 16px;
    color: var(--el-color-primary);
    letter-spacing: 0.2px;
    text-align: center;
    font-weight: 400;
  }
}

.img_list {
  display: flex;
  flex-direction: column;
  overflow: auto
}

.img_list_item {
  cursor: pointer;
  display: flex;
  width: 220px;
  height: 172px;
  margin: 6px auto;
  border: 2px solid #ebebeb;
  border-radius: 6px;
  flex-direction: column;
}

.img_list_item_active {
  border: 2px solid var(--el-color-primary);
}

.img_header {
  display: flex;
  width: 96%;
  height: 32px;

  margin: 0 auto;
  justify-content: space-between;
  border-bottom: 1px solid #ebebeb;
  align-items: center;

  &_left {
    display: flex;
    align-items: center;
    span:nth-of-type(1) {
      max-width:120px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
      color: #111827;
      letter-spacing: 0.3px;
      line-height: 24px;
      font-weight: 400;
    }
    span:nth-of-type(2) {
      margin-left: 6px;
      font-size: 12px;
      background: var(--el-color-primary-hb2);
      border-radius: 4px;
      padding: 2px 6px;
      color: var(--el-color-primary);
    }
  }
}

.img_opr_list {
  display: flex;
  flex-direction: column;
  background-color: #fff;

  &_item:hover {
    background-color:  var(--el-color-primary-hb);
  }
  &_item {
    display: flex;
    height: 32px;
    min-height: 32px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    svg {
      margin-left: 8px;
    }
    span {
      min-width: 100px;
      font-size: 16px;
      margin-left: 8px;
      color: var(--el-color-primary);
      letter-spacing: 0.3px;
      font-weight: 400;
    }
  }
}

.img_content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 85%;
    height: 90%;
  }
}

.add_pic_dialog {
  width: 100%;
  height: 200px;
}

.addkk {
  display: flex;
  flex-direction: column;
}

.addkk_text {
  height: 32px;
  display: flex;
  align-items: center;
}

</style>

<style>

  .popover_tem_panel {
    background-color: #fff!important;
    border-radius: 10px!important;
    padding: 0px!important;
  }

  .popover_tem_panel .el-popper__arrow:before {
    background-color: #fff!important;
  }
</style>
