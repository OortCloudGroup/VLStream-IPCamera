<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2025-04-16 16:57:00
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->

<template>
  <div class="meeting_list">
    <div
      v-for="(item,index) in tableData"
      :key="index"
      class="metting_list_item "
      :class="{act:isAct===index}"
      @click="selectMeetingRoom(index,item)"
    >
      <img class="metting_list_item_img" src="@/assets/img/meeting_assistant/meeting_list_item.png" />
      <div class="metting_list_item_right">
        <div class="m_t_time flexRowAC">
          <div class="flexRowAC">
            <div v-if="newDateT===item['start_dt'].slice(0,10)">
              今天
            </div>
            <div v-else class="flexRowAC">
              <template v-if="!props.time||props.status === 3">
                {{ item['start_dt'].slice(0, 5) }}
              </template>
              <span>{{ item['start_dt'].slice(5, 10) }}</span>
            </div>
            &nbsp;
            <div>{{ item['start_dt'].slice(11, 16) }}</div>
            ~
          </div>
          <span>{{ item['end_dt'].slice(11, 16) }}</span>
         &nbsp;{{ item['end_dt'].slice(0, 10) }}
        </div>
        <span v-if="item.time_zone!=='UTC+08:00'" class="m_t_title s flexRowAC">
          <div class="s">{{ item.device_start_dt.slice(0, 10) }}&nbsp;{{
            item.device_start_dt.slice(11, 16)
          }}&nbsp;{{ item.device_end_dt.slice(11, 16) }}({{ item.time_zone }})</div>
        </span>
        <span class="m_t_title">{{ item['subject'] }}</span>
        <span class="m_t_fqr">会议发起人：{{ item.username }} </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { conferenceList } from '@/api/meetingMana'
import { useUserStore } from '@/store/modules/user'
import { dayjs } from 'element-plus'

const props = defineProps(['status', 'act', 'time'])
const emits = defineEmits(['handle'])
let newDateT = dayjs(new Date()).format('YYYY-MM-DD')
const store: any = useUserStore()
const tableData = ref([])
const count = ref(0)
const page = ref(1)
const pagesize = ref(99)
let isAct = ref(props.act)
let timeExp = ref(props.time || [])

const getListFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    start_dt: undefined,
    end_dt: undefined,
    page: page.value,
    pagesize: pagesize.value,
    openstatus: props.status
  }
  if (timeExp.value && timeExp.value.length) {
    console.log('timeExp', timeExp.value)
    data['start_dt'] = timeExp.value[0]
    data['end_dt'] = timeExp.value[1]
  }
  let res: any = await conferenceList(data)
  if (res.code === 200) {
    tableData.value = res.data.list || []
    count.value = res.data.count
    if (tableData.value.length) {
      if (isAct.value > tableData.value.length - 1) isAct.value = 0
      let item: any = tableData.value[isAct.value]
      item['isAct'] = isAct.value
      emits('handle', item)
    } else {
      emits('handle', {})
    }
  }
}

const selectMeetingRoom = (index, item) => {
  isAct.value = index
  item['isAct'] = index
  emits('handle', item)
}

onMounted(() => {
  getListFn()
})

watch(() => props.time, (val) => {
  timeExp.value = val || []
  getListFn()
})

defineExpose({ getListFn, timeExp })
</script>

<style lang="scss" scoped>
.meeting_list {
  display: flex;
  flex-direction: column;
  padding-right: 20px;
}

.metting_list_item {
  width: 100%;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: 16px 20px;
  border-left: 4px solid #fff;
  gap: 12px;
  margin-bottom: 4px;
}

.metting_list_item:hover, .act {
  border-left: 4px solid var(--el-color-primary);
  background-color: aliceblue;
}

.act {
  .m_t_title {
    color: var(--el-color-primary);
  }
}

.metting_list_item_img {
  width: 28px;
  height: 28px;
}

.metting_list_item_right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.m_t_time {
  font-size: 14px;
  display: flex;
  align-items: center;
  line-height: 18px;
}

.m_t_title {
  padding-top: 8px;
  line-height: 18px;
  color: #333333;
  font-size: 16px;

  >.s {
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 14px;
    background-color: #E8E8E8;
    color: #999999;
  }
}

.m_t_fqr {
  padding-top: 6px;
  line-height: 12px;
  color: #999999;
  font-size: 12px;
}
</style>
