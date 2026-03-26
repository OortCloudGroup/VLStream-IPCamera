<template>
  <div class="homePage">
    <div class="content">
      <div class="mer_content">
        <div class="depNameBox_out flexRowAC">
          <div class="depNameBox flexRowAC">
            <div class="flexRowAC exportBtnBox">
              <div v-if="multipleSelection?.length!== 0" class="exportBtn newBtn BtnD flexRowAC" @click="deleteClick('all')">
                <el-icon class="BtnImg">
                  <Delete />
                </el-icon>删除
              </div>
            </div>
          </div>
          <!--搜索-->
          <div class="searchHeight_out flexRowAC">
            <search-height-box keyword="qrTitle" placeholder="二维码标题" :data="searchData" @handle="searchResetFn" />
            <export-excel-pdf :item="exportItem" @handle="exportQRcode" />
          </div>
        </div>
        <el-table class="new_table" header-cell-class-name="header_cell" stripe :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="二维码">
            <template #default="scope">
              <el-image
                class="codeQRImg"
                :src="qrCodeData(scope.row.qrCodeData)"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[qrCodeData(scope.row.qrCodeData)]"
                :preview-teleported="true"
                :initial-index="4"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="qrTitle" label="标题" />
          <el-table-column prop="qrDescription" label="描述" />
          <el-table-column label="类型">
            <template #default="scope">
              <span v-if="scope.row.qrTypeName" class="riskBtns riskWX ">{{ scope.row.qrTypeName }}</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="allCount" label="码扫描总量" />
          <!-- <el-table-column prop="createBy" label="创建人"/> -->
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column fixed="right" align="right" label="操作">
            <template #default="scope">
              <div class="operateBox flexRowAC">
                <div class="new_table_svg_group" @click="operateClick(scope.row)">
                  <oort-svg-icon width="20" height="20" name="qr_data" class="new_table_svg_group_svg" />
                  <span>数据</span>
                </div>
                <el-tooltip
                  content="下载"
                  effect="light"
                  placement="top"
                >
                  <div class="new_table_svg_group" @click="downQrCode(scope.row)">
                    <oort-svg-icon width="20" height="20" name="download" class="new_table_svg_group_svg" />
                  </div>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  effect="light"
                  placement="top"
                >
                  <div class="new_table_svg_group" @click="deleteClick(scope.row)">
                    <oort-svg-icon width="20" height="20" name="table_del" />
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationBox flexRowAC">
          <el-pagination
            background
            :page-sizes="[10, 20, 50, 100]"
            :page-size="page_size"
            layout="total, prev, pager, next, sizes"
            :total="count"
            class="justifyAlign"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      v-model="statisVisi"
      title="数据统计"
      top="5vh"
      width="46%"
      :close-on-click-modal="false"
    >
      <code-mana-dia v-if="statisVisi" :item-obj="itemObj" :is-tab="true" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { managerQueryPageList, qrCodeManager, typeQueryPageList } from '@/api/QRcode'
import dayjs from 'dayjs'

import { ElMessage, ElMessageBox } from 'element-plus'
import CodeManaDia from './codeManaDia.vue'
import { request } from '@/utils/service'
import { downloadBlob } from '@/utils/downloadEx'
import Config from '@/config/index'

const statisVisi = ref<boolean>(false) // 数据统计
const count = ref<any>(0)
const page_num = ref<Number>(1)
const page_size = ref<Number>(10)
const itemObj = ref<any>() // 编辑
const multipleSelection = ref<any>([]) // 批量删除
const datePickerTime = ref([])
const options = ref([]) // 二维码类型
const tableData = ref<any>()
const exportItem = ref<any>({
  isDisabledExcel: false
})
const searchData = ref<any>([]) // 高级搜索框内容
searchData.value = [
  { label: '二维码标题', value: 'qrTitle', type: 'text', default: undefined },
  {
    label: '二维码类型',
    value: 'qrTypeId',
    type: 'select',
    option: options,
    default: undefined
  },
  { label: '时间', value: 'datePickerTime', type: 'daterange', format: 'YYYY-MM-DD HH:mm:ss', default: [] }
]
const form = reactive({
  qrTitle: '',
  qrTypeId: ''
})

// 分页查询二维码类型
const applistFn = async() => {
  let data = {
    qrTitle: form.qrTitle,
    qrTypeId: form.qrTypeId,
    pageNum: page_num.value,
    pageSize: page_size.value
  }
  if (datePickerTime.value && datePickerTime.value?.length !== 0) {
    data['startTime'] = datePickerTime.value[0]
    data['endTime'] = dayjs(datePickerTime.value[1]).format('YYYY-MM-DD 23:59:59')
  }
  let res: any = await managerQueryPageList(data)
  if (res.code === 200) {
    count.value = res.total
    tableData.value = res.rows
  }
}

const downQrCode = (data) => {
  let url = qrCodeData(data.qrCodeData)
  // 创建一个隐藏的<a>标签
  const link = document.createElement('a')
  link.href = url
  link.download = data.qrTitle + '.png' // 指定下载的文件名
  // 触发点击事件
  link.click()
}

// 码Base64字符串
function qrCodeData(data) {
  // 解码Base64字符串
  let binary = atob(data)
  let array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }
  // 创建Blob对象
  let blob = new Blob([array], { type: 'image/png' })
  // 创建URL
  return URL.createObjectURL(blob)
}

// 搜索重置
function searchResetFn(val, reset) {
  if (reset) {
    page_num.value = 1
  }
  form.qrTitle = val.qrTitle
  form.qrTypeId = val.qrTypeId
  datePickerTime.value = val.datePickerTime
  applistFn()
}

// 批量删除
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

// 删除
const deleteClick = (val) => {
  if (val === 'all' && multipleSelection.value.length === 0) {
    return false
  }
  ElMessageBox.confirm('是否确定删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    let data = val.id
    if (val === 'all') {
      let arr: any = []
      multipleSelection.value.forEach((item: any) => {
        arr.push(item.id)
      })
      data = arr.join(',')
    }
    let res: any = await qrCodeManager(data)
    if (res.code === 200) {
      // 列表 刷新
      applistFn()
      ElMessage.success(res.msg)
    } else {
      ElMessage.warning(res.msg)
    }
  })
}

const exportQRcode = async() => {
  ElMessage.success('正在导出中...')
  // 下载Excel模版
  const downloadUrl = Config.URL + Config.gateWay + 'oortcloud-qrcode/qrCode/type/export'
  // const downloadUrl = 'http://192.168.88.56:8099/' + 'qrCode/operate/export'
  let res = await request({ url: downloadUrl, method: 'get', responseType: 'blob' }, true)
  downloadBlob(res, '二维码.xlsx')
}

// 数据统计
const operateClick = (row: any) => {
  itemObj.value = row
  statisVisi.value = true
}

let handleSizeChange = (val: number) => {
  page_size.value = val
  applistFn()
}
let handleCurrentChange = (val: number) => {
  page_num.value = val
  applistFn()
}

async function getTypeList() {
  let data = {
    pageNum: 1,
    pageSize: 99
  }
  let res: any = await typeQueryPageList(data)
  if (res.code === 200) {
    options.value = res.rows || []
    options.value?.map((item: any) => {
      item.label = item.qrTypeName
      item.value = item.qrTypeId
    })
  }
}

onMounted(() => {
  applistFn()
  getTypeList()
})
</script>
<style lang="scss" scoped>
.mer_content :deep(.header_cell) {
  color: #333;
  background-color: #FAFAFA;
}

.searchImg {
  width: 14px;
  height: 14px;
  background-size: cover;
  margin-right: 8px;
}

.content {
  background: #fff;
  border-radius: 10px;
}

.searchBox {
  gap: 20px;
  padding: 24px 20px;

  flex-wrap: wrap;

  .serchItem {
    width: 240px;
    height: 36px;
    border-radius: 4px;
  }

  .serchItem.siRange {
    width: 350px;
  }

  :deep(.el-button.el-button--primary) {
    background: var(--el-color-primary);
    border: none;
  }
}

.exportBtnBox {
  gap: 12px;
}

.exportBtn {
  cursor: pointer;
  justify-content: center;
  width: 82px;
  height: 32px;
  background: var(--el-color-primary);
  border-radius: 5px;
  border: 1px solid rgba(12, 175, 96, 1);
  font-size: 14px;
  color: #FFFFFF;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.04);

  &.Btn2 {
    background: #FFFFFF;
    color: #333333;
    border: 1px solid rgba(217, 217, 217, 1);
  }

  &.BtnD {
    color: #F62E2E;
    background: #FFFFFF;
    border: 1px solid rgba(255, 183, 183, 1);
  }

  .BtnImg {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    background-size: cover;
  }
}

.mer_content {
  background: #fff;
  padding: 20px;

  .riskBtns {
    padding: 3px 7px;
    font-size: 12px;
    border-radius: 4px;
  }

  .riskWX {
    background: #F6FFED;
    border: 1px solid rgba(183, 235, 143, 1);
    color: #52C41A;
  }

  .riskYH {
    color: #7726D6;
    background: #F9F0FF;
    border: 1px solid rgba(211, 173, 247, 1);
  }

  .riskLKL {
    color: #FA8D00;
    background: #FFF7E6;
    border: 1px solid rgba(255, 213, 145, 1);
  }

  .riskZFB {
    color: #4DBEBD;
    background: #E7FFFF;
    border: 1px solid rgba(139, 232, 231, 1);
  }

  .paginationBox {
    justify-content: center;
    height: 100px;
  }
}

.codeQRImg {
  cursor: pointer;
  width: 48px;
  height: 48px;
  background-color: #ccc;
}

.operateBox {
  gap: 20px;
  justify-content: flex-end;

  .opImg {
    cursor: pointer;
    width: 24px;
    height: 24px;
  }
}
</style>
