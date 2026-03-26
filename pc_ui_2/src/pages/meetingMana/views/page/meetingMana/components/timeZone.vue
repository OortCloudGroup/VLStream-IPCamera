<template>
  <div class="timeZonePage">
    <div v-if="false" class="zoneS">
      <el-checkbox v-model="checked1">
        会议开始时间和结束时间使用不同时区
      </el-checkbox>
    </div>
    <div class="zoneT">
      <el-select
        v-model="sel"
        filterable
        remote
        :remote-method="remoteMethod"
        :loading="loading"
        placeholder="会议时区"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="`(${item['time_zone']}) ${item.addr}`"
          :value="item['id']"
        />
      </el-select>
    </div>
    <div v-if="false" class="zoneT">
      <el-select
        v-model="sel"
        :disabled="!checked1"
        filterable
        placeholder="会议结束时区"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="`(${item['time_zone']})${item.addr}`"
          :value="item['id']"
        />
      </el-select>
    </div>
    <div class="elButtonBoxOut  elButtonBox flexRowAC">
      <el-button @click="emits('close'),sel=29">
        移除时区
      </el-button>
      <div class="elButtonBox flexRowAC">
        <el-button @click="emits('close')">
          取消
        </el-button>
        &nbsp;&nbsp;
        <el-button type="primary" @click="submitClick()">
          确定
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { timeZoneList } from '@/api/meetingMana'
import { useUserStore } from '@/store/modules/user'

const emits = defineEmits(['close', 'handle'])
const store: any = useUserStore()
const sel = ref(29)
const checked1 = ref(false)
const options = ref([])
const loading = ref(false)

// 时区列表
const timeZoneListFn = async(query) => {
  let data = {
    accessToken: store.userInfo.accessToken,
    addr: query
  }
  let res: any = await timeZoneList(data)
  if (res.code === 200) {
    loading.value = false
    options.value = res.data || []
  }
}

// 远程搜索
const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    timeZoneListFn(query)
  }
}

// 确定
const submitClick = () => {
  let v = options.value.find((tt: any) => tt.id === sel.value)
  emits('handle', v)
  emits('close')
}

onMounted(() => {
  timeZoneListFn('')
})
</script>

<style lang="scss" scoped>
.timeZonePage {

  .zoneS {
    padding-bottom: 20px;
  }

  .zoneT {
    padding-bottom: 20px;
  }
}

.elButtonBoxOut.elButtonBox {
  justify-content: space-between;
}

.elButtonBox {
  //padding: 40px 20px;
  justify-content: flex-end;
}
</style>

