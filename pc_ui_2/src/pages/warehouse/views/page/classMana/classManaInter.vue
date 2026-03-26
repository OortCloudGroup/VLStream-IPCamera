<template>
  <div class="cmInterPage">
    <div class="cm_in_newTitle">
      默认界面
    </div>
    <div class="cm_in_newBox flexRowAC">
      <div v-for="(item,i) in cmListSet" :key="i" class="cm_in_new cm flexRowAC">
        <div class="cm_box flexRowAC">
          {{ item.name }}
          <el-dropdown @command="(val)=>{handleCommand(val,item)}">
            <div class="cm_box_img_out">
              <img class="cm_box_img" src="@/assets/img/warehouse/cm_more.png" alt="" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="1">
                  设计
                </el-dropdown-item>
                <el-dropdown-item :command="2">
                  导出
                </el-dropdown-item>
                <el-dropdown-item :command="3">
                  取消默认
                </el-dropdown-item>
                <el-dropdown-item :command="4">
                  属性
                </el-dropdown-item>
                <el-dropdown-item :command="5">
                  <span style="color: red;">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div v-if="item['type']===1">
          浏览界面
        </div>
        <div v-if="item['type']===2">
          搜索界面
        </div>
        <div v-if="item['type']===3">
          录入界面
        </div>
        <div v-if="item['type']===4">
          详情界面
        </div>
        <div v-if="item['type']===5">
          统计界面
        </div>
        <div class="cm_box_time flexRowAC">
          <div>{{ item['created_username'] }}</div>
          <div class="cm_box_time_t">
            {{ item['created_at'] }}
          </div>
        </div>
      </div>
    </div>
    <div class="cm_in_newTitle">
      全部界面
    </div>
    <div class="cm_in_newBox flexRowAC">
      <div class="cm_in_new flexRowAC" @click="cminnewClick">
        <img class="cm_in_img" src="@/assets/img/warehouse/cm_edit.png" alt="" />
        新建界面
      </div>
      <!--界面-->
      <div v-for="(item,i) in classifyArr" :key="i" class="cm_in_new cm flexRowAC">
        <div class="cm_box flexRowAC">
          {{ item.name }}
          <el-dropdown @command="(val)=>{handleCommand(val,item)}">
            <div class="cm_box_img_out">
              <img class="cm_box_img" src="@/assets/img/warehouse/cm_more.png" alt="" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="1">
                  设计
                </el-dropdown-item>
                <el-dropdown-item :command="2">
                  导出
                </el-dropdown-item>
                <el-dropdown-item v-if="item['status']===1" :command="3">
                  取消默认页面
                </el-dropdown-item>
                <el-dropdown-item v-else :command="3">
                  设置默认页面
                </el-dropdown-item>
                <el-dropdown-item :command="4">
                  属性
                </el-dropdown-item>
                <el-dropdown-item :command="5">
                  <div style="color: red;">
                    删除
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div v-if="item['type']===1">
          浏览界面
        </div>
        <div v-if="item['type']===2">
          搜索界面
        </div>
        <div v-if="item['type']===3">
          录入界面
        </div>
        <div v-if="item['type']===4">
          详情界面
        </div>
        <div v-if="item['type']===5">
          统计界面
        </div>
        <div class="cm_box_time flexRowAC">
          <div>{{ item['created_username'] }}</div>
          <div class="cm_box_time_t">
            {{ item['created_at'] }}
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="cminVisi"
      :title="idInfo?'编辑界面':'录入界面'"
      width="30%"
      :close-on-click-modal="false"
    >
      <class-mana-inter-new v-if="props.cid" :id="idInfo" :cid="props.cid" @close="cminVisi=false" @handle="handleFn" />
    </el-dialog>

    <el-dialog
      v-model="showBrowerInterVis"
      title="浏览界面设计"
      width="75%"
      :close-on-click-modal="false"
    >
      <BrowserInterface v-if="showBrowerInterVis" :interface="interfaceObj" @exit="showBrowerInterVis=false" />
    </el-dialog>

    <el-drawer
      v-model="showTableInterVis"
      size="92%"
      :with-header="false"
    >
      <XTable v-if="showTableInterVis" :interface="interfaceObj" :cid="props.cid" @exit="showTableInterVis=false" />
    </el-drawer>

    <el-drawer
      v-model="showInputInterVis"
      size="92%"
      :with-header="false"
    >
      <XForm v-if="showInputInterVis" :interface="interfaceObj" @exit="showInputInterVis=false" />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ClassManaInterNew from './classManaInterNew.vue'
// import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ckmtClassifyInAll, ckmtClassifyInDel, ckmtClassifyInStatus, ckmtFieldlist } from '@/api/warehouse'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useXFormStore } from '@/store/xForm'
import XForm from '../xForm/index.vue'
import XTable from '../XTable/index.vue'
import BrowserInterface from '../xForm/browserInterface.vue'

// const router = useRouter()
const store = useUserStore()
const props = defineProps(['cid'])
const classifyArr = ref<any>([]) // 分类界面列表
let idInfo = ref<any>('') // 分类界面详情id
let cminVisi = ref<any>(false)
let cmListSet = ref<any>([]) // 当前生效列表

// 分类界面列表
const applistFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    cid: props.cid
  }
  ckmtClassifyInAll(data).then((res) => {
    if (res.code === 200) {
      classifyArr.value = res.data || []
      // 获取当前生效的界面信息
      cmListSet.value = classifyArr.value.filter(item => item.status === 1)
    }
  })
}

// 新建界面
const cminnewClick = () => {
  idInfo.value = ''
  cminVisi.value = true
}
const showInputInterVis = ref<Boolean>(false)
const showBrowerInterVis = ref<Boolean>(false)
const showTableInterVis = ref<Boolean>(false)
const interfaceObj = ref<any>(null)
// 界面操作
const handleCommand = (command: string | number | object, item: any) => {
  // 设计
  interfaceObj.value = item
  if (command === 1) {
    // 录入界面 和 搜索页面
    if (item.type === 3 || item.type === 2 || item.type === 4) {
      showInputInterVis.value = true
    }
    // 浏览界面
    if (item.type === 1) {
      showBrowerInterVis.value = true
    }
    // 统计界面
    if (item.type === 5) {
      showTableInterVis.value = true
    }
  }
  if (command === 3) {
    let str = item.status === 1 ? '取消' : '设置'
    ElMessageBox.confirm(str + '默认页面', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      let data = {
        accessToken: store.userInfo.accessToken,
        id: item.id,
        status: item.status === 1 ? 2 : 1
      }
      let res: any = await ckmtClassifyInStatus(data)
      if (res.code === 200) {
        // 列表 刷新
        applistFn()
        ElMessage.success(res.msg)
      } else {
        ElMessage.warning(res.msg)
      }
    })
  }
  if (command === 4) {
    cminVisi.value = true
    idInfo.value = item.id
  }
  if (command === 5) {
    ElMessageBox.confirm('是否确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      let data = {
        accessToken: store.userInfo.accessToken,
        id: item.id
      }
      let res: any = await ckmtClassifyInDel(data)
      if (res.code === 200) {
        // 列表 刷新
        applistFn()
        ElMessage.success(res.msg)
      } else {
        ElMessage.warning(res.msg)
      }
    })
  }
}

// handleFn
const handleFn = async() => {
  cminVisi.value = false
  applistFn()
}

watch(() => props.cid, (val) => {
  if (val) {
    applistFn()
  }
})

const getAllFiledList = async() => {
  const params = {
    accessToken: useUserStore().token,
    status: 1,
    page: 1,
    pageSize: 999
  }
  let res = await ckmtFieldlist(params)
  if (res.code === 200) {
    useXFormStore().SET_CURRENT_TABLE(res.data.list || [])
  }
}

onMounted(() => {
  if (props.cid) {
    applistFn()
    // 获取该分类下的所有主表字段
    getAllFiledList()
  }
})
</script>

<style lang="scss" scoped>
.cmInterPage {
  .el-drawer__body {
    padding: 0!important;
  }
}

.cm_in_newTitle {
  padding-bottom: 12px;
}

.cm_in_newBox {
  gap: 20px;
  padding-bottom: 40px;
  flex-wrap: wrap;
}

.cm_in_new {
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  width: 258px;
  height: 91px;
  background: #F0F2F5;
  border-radius: 8px;

  .cm_in_img {
    width: 30px;
    height: 30px;
  }
}

.cm_in_new.cm {
  padding: 8px 10px;
  align-items: flex-start;

  .cm_box {
    width: 100%;
    justify-content: space-between;
  }

  .cm_box_img {
    width: 20px;
  }

  .cm_box_img_out {
    height: 24px;
  }

  .cm_box_time {
    width: 100%;
    font-size: 12px;
    justify-content: space-between;
  }

  .cm_box_time_t {
    color: #999999;
  }
}
</style>
