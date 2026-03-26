<template>
  <div class="homePage">
    <div class="content">
      <div class="mer_content">
        <div class="depNameBox_out flexRowAC">
          <div class="depNameBox flexRowAC">
            <div class="flexRowAC exportBtnBox">
              <div class="exportBtn newBtn flexRowAC" @click="typeVisi = true">
                <el-icon class="BtnImg">
                  <Plus />
                </el-icon>
                新建
              </div>
              <div
                v-if="multipleSelection?.length!== 0"
                class="exportBtn newBtn BtnD flexRowAC"
                @click="deleteClick('all')"
              >
                <el-icon class="BtnImg">
                  <Delete />
                </el-icon>
                删除
              </div>
            </div>
          </div>
          <!--搜索-->
          <div class="searchHeight_out flexRowAC">
            <search-height-box keyword="qrTypeName" placeholder="类型名称" :data="searchData" @handle="searchResetFn" />
            <export-excel-pdf :item="exportItem" @handle="exportQRcode" />
          </div>
        </div>
        <el-table
          class="new_table"
          header-cell-class-name="header_cell"
          stripe
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :width="clacPXToVW(65)" />
          <el-table-column prop="qrTypeName" label="类型名称" />
          <el-table-column prop="qrTypeId" label="类型ID" />
          <el-table-column prop="applicationId" :width="clacPXToVW(300)" label="应用ID" />
          <el-table-column prop="otherSystemValues" :width="clacPXToVW(180)" label="第三方处理系统值" />
          <el-table-column prop="qrTypeDescription" label="描述" :width="clacPXToVW(200)" />
          <!-- <el-table-column prop="qrCodeCount" label="已生成二维码数量" width="200"/> -->
          <el-table-column prop="createTime" label="创建时间" :width="clacPXToVW(200)" />
          <el-table-column prop="operate" fixed="right" align="right" label="操作">
            <template #default="scope">
              <div class="operateBox flexRowAC">
                <div class="new_table_svg_group" @click="operateClick(scope.row, 2)">
                  <oort-svg-icon width="20" height="20" name="qr_data" class="new_table_svg_group_svg" />
                  <span>数据</span>
                </div>
                <el-tooltip
                  content="编辑"
                  effect="light"
                  placement="top"
                >
                  <div class="new_table_svg_group" @click="operateClick(scope.row)">
                    <oort-svg-icon width="20" height="20" name="table_edit" class="new_table_svg_group_svg" />
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
      v-model="typeVisi"
      :title="itemObj?'编辑类型':'新建类型'"
      width="40%"
      :close-on-click-modal="false"
    >
      <code-type-new v-if="typeVisi" :item-obj="itemObj" @close="typeDiaClose" @handle="handleStatis" />
    </el-dialog>
    <el-dialog
      v-model="statisVisi"
      title="数据统计"
      width="40%"
      :close-on-click-modal="false"
    >
      <code-type-dia-sta v-if="statisVisi" :item-obj="itemObj" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import CodeTypeNew from './codeTypeNew.vue'
import { typeQueryPageList, typeTypeIds } from '@/api/QRcode'
import { ElMessage, ElMessageBox } from 'element-plus'
import CodeTypeDiaSta from './codeTypeDiaSta.vue'
import { request } from '@/utils/service'
import { downloadBlob } from '@/utils/downloadEx'
import { clacPXToVW } from '@/utils/index'
import Config from '@/config/index'

let typeVisi = ref<boolean>(false)
let statisVisi = ref<boolean>(false) // 数据统计
const count = ref<any>(0)
const page_num = ref<Number>(1)
const page_size = ref<Number>(10)
const itemObj = ref<any>(null) // 类型编辑
const multipleSelection = ref<any>([]) // 批量删除
const tableData = ref<any>()
const exportItem = ref<any>({
  isDisabledExcel: false
})
const searchData = ref<any>([]) // 高级搜索框内容
searchData.value = [
  { label: '类型名称', value: 'qrTypeName', type: 'text', default: '' }
]
const form = reactive({
  qrTypeName: '',
  applicationName: ''
})

const exportQRcode = async() => {
  ElMessage.success('正在导出中...')
  // 下载Excel模版
  const downloadUrl = Config.URL + Config.gateWay + 'oortcloud-qrcode/qrCode/type/export'
  let res: any = await request({
    url: downloadUrl + '?pageSize=99&pageNum=1',
    method: 'get',
    responseType: 'blob'
  }, true)
  downloadBlob(res, '二维码类型数据.xlsx')
}

// 分页查询二维码类型
const applistFn = async() => {
  let data = {
    qrTypeName: form.qrTypeName,
    applicationName: form.applicationName,
    pageNum: page_num.value,
    pageSize: page_size.value
  }
  let res: any = await typeQueryPageList(data)
  if (res.code === 200) {
    count.value = res.total
    tableData.value = res.rows
  }
}

// 搜索重置
function searchResetFn(val, reset) {
  if (reset) {
    page_num.value = 1
    form.applicationName = ''
  }
  form.qrTypeName = val.qrTypeName
  applistFn()
}

const typeDiaClose = () => {
  itemObj.value = null
  typeVisi.value = false
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
    let res: any = await typeTypeIds(data)
    if (res.code === 200) {
      // 列表 刷新
      applistFn()
      ElMessage.success(res.msg)
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 数据统计
const operateClick = (row: any, type: number) => {
  itemObj.value = row
  // 编辑
  if (type === 1) {
    typeVisi.value = true
  }
  if (type === 2) {
    statisVisi.value = true
  }
}

// 发布成功
const handleStatis = () => {
  typeVisi.value = false
  applistFn()
}

let handleSizeChange = (val: number) => {
  page_size.value = val
  applistFn()
}

let handleCurrentChange = (val: number) => {
  page_num.value = val
  applistFn()
}
onMounted(() => {
  applistFn()
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

:deep(.tabsBox) {
  border: none;

  .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }

  .el-tabs__header, .el-tabs__nav {
    background: transparent;
    border: none;
  }

  .el-tabs__header .el-tabs__item {
    background: #FFFFFF;
    border: 1px solid rgba(217, 217, 217, 1);
    font-size: 14px;
    color: #BFBFBF;
    margin: 0;
    border-right: 0;
    height: 36px;
    width: 98px;

    &.is-active {
      background-color: var(--el-color-primary);
      font-size: 14px;
      color: #FFFFFF;
    }

    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    &:last-child {
      border-right: 1px solid rgba(217, 217, 217, 1);
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
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
  border: 1px solid var(--el-color-primary);
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

  .riskSucc {
    font-size: 14px;
    color: var(--el-color-primary);

    .riskSuccDot {
      padding: 4px;
      border-radius: 50%;
      background-color: var(--el-color-primary);
      margin-right: 4px;
    }
  }

  .riskFail {
    font-size: 14px;
    color: #FFD023;

    .riskSuccDot {
      padding: 4px;
      border-radius: 50%;
      background-color: #FFD023;
      margin-right: 4px;
    }
  }

  .riskReject {
    font-size: 14px;
    color: #DADADA;

    .riskSuccDot {
      padding: 4px;
      border-radius: 50%;
      background-color: #DADADA;
      margin-right: 4px;
    }
  }

  .paginationBox {
    justify-content: center;
    height: 100px;
  }
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
