<template>
  <div class="c_content docuPage">
    <div class="c_cont">
      <div class="c_t">
        功能描述
      </div>
      <div class="c_t1 dotBox flexRowAC">
        <div class="dot" />
        API生成
      </div>
      <div class="c_t">
        请求URL
      </div>
      <div class="c_t1">
        {{ Config.URL }}
      </div>
      <div class="c_t">
        HTTP请求方法（Method）
      </div>
      <div class="c_t1">
        HTTP POST
      </div>
      <div class="c_t">
        请求头说明（Request Header）
      </div>
      <div class="c_t1 ct1PB">
        请在HTTP请求中添加以下自定义Header。
      </div>
      <el-table
        :data="tableData"
        border
        class=""
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="header 名"
          width="180"
        />
        <el-table-column
          prop="value"
          label="值"
        />
      </el-table>
      <div class="c_t ct1TABLE">
        URL参数（Parameters）
      </div>
      <div class="reqBody">
        URL参数指以 {参数名}={参数值} 形式拼接到 URL 上的键值对。它以 ? 开头，不同参数之间使用 & 连接。形如 ?p1=v1&p2=v2
      </div>
      <el-table
        :data="tableDataWD"
        border
        class=""
        style="width: 100%"
      >
        <el-table-column prop="date" label="数据类型" />
        <el-table-column prop="i1" label="数据类型" />
        <el-table-column prop="i2" label="数据类型" />
        <el-table-column prop="i3" label="允许的值" />
        <el-table-column prop="i4" label="描述" />
      </el-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Config from '@/config'

const tableData = ref<any>([])
const tableDataWD = ref<any>([])
tableData.value = [
  {
    date: 'Content-Type',
    value: 'application/json; charset=UTF-8'
  }
]
tableDataWD.value = [
  {
    date: 'is_gray',
    i1: 'integer',
    i2: '',
    i3: '',
    i4: ''
  }, {
    date: 'is_gray',
    i1: 'integer',
    i2: '',
    i3: '',
    i4: ''
  }
]
</script>
<style lang="scss" scoped>
.docuPage {
  background: #FAFAFA;
  padding: 40px 20px;
  border-radius: 8px;
  // 标题
  .c_t {
    padding-bottom: 20px;
    font-weight: 700;
    color: #333333;
    font-size: 16px;
  }

  // 详情
  .c_t1 {
    padding-bottom: 32px;
    color: #333333;
    font-size: 14px;
  }

  .c_t1.ct1PB {
    padding-bottom: 16px;
  }

  // 请求体说明
  .ct1TABLE {
    padding-top: 32px;
  }

  // 请求体说明_desc
  .reqBody {
    line-height: 40px;
    color: #333333;
    font-size: 14px;
  }
}

.dotBox{
  gap: 4px;
  .dot{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--el-color-primary);
  }
}
</style>
