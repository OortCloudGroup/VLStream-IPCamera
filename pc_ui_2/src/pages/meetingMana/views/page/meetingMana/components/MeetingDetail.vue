<template>
  <div class="meeting_detail">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="会议" name="first">
        <MeetingInfo :act="props.act" :data="dataObj" @handle="emits('handle')" />
      </el-tab-pane>
      <el-tab-pane label="会议签到" name="second">
        <MeetingSign v-if="activeName==='second'&&dataObjId" :id="dataObjId" />
      </el-tab-pane>
      <el-tab-pane label="投票" name="third">
        <MeetingVote v-if="activeName==='third'&&dataObjId" :id="dataObjId" />
      </el-tab-pane>
      <el-tab-pane label="录音录像" name="fourth">
        <MeetingRecord v-if="activeName==='fourth'&&dataObjId" :id="dataObjId" />
      </el-tab-pane>
      <el-tab-pane label="会议结论" name="fivth">
        <MeetingResult v-if="activeName==='fivth'&&dataObjId" :id="dataObjId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MeetingInfo from './MeetingInfo.vue'
import MeetingSign from './MeetingSign.vue'
import MeetingVote from './MeetingVote.vue'
import MeetingRecord from './MeetingRecord.vue'
import MeetingResult from './MeetingResult.vue'
import { conferenceInfo } from '@/api/meetingMana'
import { useUserStore } from '@/store/modules/user'

const activeName = ref('first')
const store: any = useUserStore()
const props = defineProps(['id', 'act'])
const emits = defineEmits(['handle'])
let dataObj = ref('')
let dataObjId = ref('')

// 详情
const getInfoFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    conference_uid: props.id
  }
  let res: any = await conferenceInfo(data)
  if (res.code === 200) {
    dataObj.value = res.data
    dataObjId.value = res.data?.conference?.conference_uid
  }
}

watch(() => props.id, (val) => {
  if (val) getInfoFn()
}, { immediate: true })

</script>

<style lang="scss" scoped>
.meeting_detail {
  padding: 0 20px;
  border-left: 1px solid #ebeef5;
}

:deep(.el-tabs__nav-wrap:after) {
  display: none;
}
</style>
