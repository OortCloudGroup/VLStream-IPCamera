<template>
  <div class="statisPage">
    <div v-if="props.isTab" class="staTab flexRowAC">
      <div :class="{act:sAct===0}" class="staItem" @click="staClick(0)">
        扫码统计
      </div>
      <div :class="{act:sAct===1}" class="staItem" @click="staClick(1)">
        扫码历史
      </div>
    </div>
    <div v-if="sAct===0">
      <code-mana-dia-sta v-if="itemObj" :item-obj="itemObj" />
    </div>
    <div v-if="sAct===1">
      <el-table :data="tableData" :header-cell-style="()=>{return {background:'#F8F8F9'}}">
        <el-table-column prop="date" label="序号" width="180">
          <template #default="scope">
            {{ scope.$index + (page_num - 1) * page_size + 1 }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="scanBy" label="扫码人"/> -->
        <el-table-column prop="scanTime" label="扫码时间" />
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
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import CodeManaDiaSta from './codeManaDiaSta.vue'
import { scanPage } from '@/api/QRcode'

const props = defineProps(['isTab', 'itemObj'])
const tableData = ref<any>([])
const sAct = ref<any>(0)
const count = ref<any>(0)
const page_num = ref<Number>(1)
const page_size = ref<Number>(10)

// 扫码统计
const staClick = (index: number) => {
  sAct.value = index
}

// 分页查询二维码类型
const applistFn = async() => {
  let data = props.itemObj.id
  let res: any = await scanPage(data)
  if (res.code === 200) {
    count.value = res.data.total
    tableData.value = res.data.records
  }
}

let handleSizeChange = (val: number) => {
  page_size.value = val
  applistFn()
}
let handleCurrentChange = (val: number) => {
  page_num.value = val
  applistFn()
}

watch(() => props.itemObj, () => {
  applistFn()
})

onMounted(() => {
  applistFn()
})
</script>
<style lang='scss' scoped>
.statisPage {
  height: 560px;
}

.staTab {
  padding-bottom: 20px;
  gap: 34px;

  .staItem {
    cursor: pointer;
    font-size: 16px;
    color: #939393;
    padding-bottom: 6px;
  }

  .staItem.act {
    font-size: 16px;
    color: var(--el-color-primary);
    border-bottom: 1px solid var(--el-color-primary);
  }
}

.paginationBox {
  justify-content: center;
  height: 100px;
}
</style>
