<template>
  <div class="graphic_page">
    <div class="searchBox flexRowAC">
      <div class="serchItem">
        <el-input v-model="form.companyName" class="wh-input" placeholder="用户昵称" />
      </div>
      <div class="serchItem">
        <el-input v-model="form.code" class="wh-input" placeholder="来源" />
      </div>
      <div class="serchItem">
        <el-select v-model="form.status" placeholder="答题市场">
          <!--          <el-option label="启用" :value="1" />-->
          <!--          <el-option label="停用" :value="0" />-->
        </el-select>
      </div>
      <div class="serchItem">
        <el-button type="primary" @click="applistFn">
          <img class="searchImg" src="@/assets/img/search.png" alt="" />搜索
        </el-button>
        <el-button @click="resetFn">
          <el-icon class="searchImg">
            <RefreshRight />
          </el-icon>
          重置
        </el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" class="tenanat-tabs1">
      <el-tab-pane label="全部（18）" name="d1" />
      <el-tab-pane label="有效（16）" name="d2" />
      <el-tab-pane label="无效（2）" name="d3" />
    </el-tabs>
    <div class="mer_content">
      <div class="modeBoxOut flexRowAC">
        <el-table
          class="modeTable"
          :show-overflow-tooltip="true"
          header-cell-class-name="header_cell"
          stripe
          :data="tableData"
        >
          <el-table-column prop="date" label="序号" width="65">
            <template #default="scope">
              {{ scope.$index + (page_num - 1) * page_size + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="用户名" />
          <el-table-column prop="code" label="开始答题时间" />
          <el-table-column prop="contactPhone" label="结束答题时间" />
          <el-table-column prop="contactPhone" label="答题时长（秒）" />
          <el-table-column prop="contactPhone" label="IP" />
          <el-table-column label="操作" align="right">
            <template #default>
              <div class="operateBox flexRowAC">
                <div class="operateDe">
                  查看
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'

const activeName = ref('d1')
const count = ref<any>(0)
const page_num = ref<Number>(1)
const page_size = ref<Number>(10)
const tableData = ref<any>([])
// data
const form = reactive({
  mch_id: '',
  code: '',
  serMerCode: '',
  companyName: '',
  name: '',
  contactPhone: '',
  status: ''
})

// 重置
function resetFn() {
  page_num.value = 1
  form.mch_id = ''
  form.code = ''
  form.serMerCode = ''
  form.companyName = ''
  form.name = ''
  form.contactPhone = ''
  form.status = ''
  applistFn()
}

const applistFn = async() => {
}

let handleCurrentChange = (val: number) => {
  page_num.value = val
  applistFn()
}

let handleSizeChange = (val: number) => {
  page_size.value = val
  applistFn()
}
onMounted(() => {
  applistFn()
})
</script>
<style lang="scss" scoped>
.graphic_page {
  height: 100%;
  width: 100%;

}

.searchBox {
  gap: 20px;
  padding: 24px 0 0;
  flex-wrap: wrap;

  .serchItem {
    width: 240px;
    border-radius: 4px;
  }

  :deep(.el-button.el-button--primary) {
    background: var(--el-color-primary);
    border: none;
  }
}

.mer_content {
  background: #fff;

  .operateBox {
    justify-content: flex-end;
    gap: 20px;

    .operateDe {
      cursor: pointer;
      font-size: 14px;
      color: var(--el-color-primary);
    }
  }

  .paginationBox {
    justify-content: center;
    height: 100px;
  }
}

:deep(.tenanat-tabs1) {
  padding: 10px 0;

  .el-tabs__item {
    color: #999999;
  }

  .el-tabs__item.is-active {
    color: var(--el-color-primary);
  }
}
</style>
