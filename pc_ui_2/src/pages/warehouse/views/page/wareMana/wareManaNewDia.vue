<template>
  <div class="wareNDPage">
    <div>
      <el-radio-group v-model="selItem" class="selBox">
        <div v-for="(item,i) in tableDataEntry" :key="i">
          <el-radio :value="(i+1)">
            {{ item['wg01'] }}
          </el-radio>
        </div>
      </el-radio-group>
    </div>
    <div style="text-align: right;">
      <el-button @click="emits('close')">
        取消
      </el-button>
      <el-button type="primary" @click="SelClick">
        确定
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ckmtDataList } from '@/api/warehouse'

const emits: any = defineEmits(['handle', 'close'])
// const props: any = defineProps([ 'selItem'])
const store: any = useUserStore()
const tableDataEntry = ref<any>([])
const count = ref<any>(0)
const page = ref<Number>(1)
const pagesize = ref<Number>(10)
let selItem = ref<number>(0)

// 数据列表
const applistFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    page: page.value,
    pagesize: pagesize.value,
    cid: 1
  }
  ckmtDataList(data).then((res: any) => {
    if (res.code === 200) {
      tableDataEntry.value = res.data.list
      count.value = res.data.count
    }
  })
}

// 确定
const SelClick = () => {
  if (selItem.value) {
    let data = tableDataEntry.value[selItem.value - 1]
    emits('handle', data)
    emits('close')
  }
}

onMounted(() => {
  applistFn()
})
</script>
<style lang="scss" scoped>
.wareNDPage {
  padding: 0 20px;

}

.selBox {
  align-items: flex-start;
  flex-direction: column;
}
</style>
