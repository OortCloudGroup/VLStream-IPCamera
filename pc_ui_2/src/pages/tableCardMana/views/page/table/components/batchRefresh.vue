<!--
 * @Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2025-05-28 10:58:05
 * @Last Modified by:  兰舰
 * @Copyright 奥尔特云(深圳)智慧科技 aPaaS-front-team. All rights reserved.
!-->

<template>
  <div class="card">
    <div class="card_body">
      <div v-for="(item, index) in statusArr" :key="index" class="card_process">
        <span>编号：{{ item.name }}</span>
        <span>状态：{{ convertStr(item.state) }}</span>
        <span>进度：{{ item.ratio }} % </span>
        <el-icon v-if="item.state !=='success'" class="loadding_icon">
          <Loading />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
const store = useUserStore()
const props = defineProps({
  queueArr: {
    type: Object,
    default: null
  },
  isSetDefault: {
    type: Boolean,
    default: false
  }
})

const convertStr = (state) => {
  switch (state) {
    case 'normal':
      return '等待中'
    case 'waiting':
      return '等待下发'
    case 'scan':
      return '搜索设备'
    case 'refresh':
      return '正在下发'
    case 'success':
      return '下发完成'
    case 'fail':
      return '下发出错'
    default:
      return '未知'
  }
}

import { getQueueStatus, addQueue } from '@/api/tableService/index'
const startAllPic = async() => {
  const params = {
    accessToken: store.getStoreToken()
  }
  params.queue = props.queueArr
  let res = await addQueue(params)
  if (res.code === 200) {
    startGetAllStatus(props.queueArr)
  }
}

let timer = null
const statusArr = ref([])
const startGetAllStatus = async(tempQueueArr) => {
  const params = {
    accessToken: store.getStoreToken(),
    names: tempQueueArr.map(item => item.name)
  }
  let res = await getQueueStatus(params)
  if (res.code === 200) {
    statusArr.value = []
    for (let key in res.data) {
      console.log(key)
      statusArr.value.push({ ...res.data[key], name: key })
    }
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = setTimeout(() => {
      startGetAllStatus(tempQueueArr)
    }, 1500)
  }
}

onMounted(() => {
  startAllPic()
})

// 组件销毁时候，清理timer
onUnmounted(() => {
  if (timer) {
    window.clearTimeout(timer)
  }
})

</script>

<style scoped>

    .card {
        display: flex;
        flex-direction: column;
    }

    .card_title {
        display: flex;
        align-items: center;
        height: 32px;
        span {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
        }
    }

    .card_body {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .card_process {
        height: 32px;
        border: 1px solid #E5E5E5;
        border-radius: 2px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 8px;
        span {
            line-height: 32px;
            flex: 1;
            height: 100%;
            font-size: 14px;
            align-items: center;
        }
    }

    .loadding_icon {
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
        }

</style>
