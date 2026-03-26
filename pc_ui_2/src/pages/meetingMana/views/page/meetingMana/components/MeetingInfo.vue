<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2025-04-16 10:27:55
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <div v-if="infoTemp" class="meetting_info">
    <div v-if="meetingEdit===false" class="meeting_opr">
      <div class="meeting_opr_item meeting_opr_item_blue">
        <img src="@/assets/img/meeting_assistant/meeting_opr_sync.png" />
        <span class="meeting_opr_item_text">桌牌同步</span>
      </div>
      <div class="meeting_opr_item meeting_opr_item_blue" @click="houseNumberSyncFn(infoTemp)">
        <img src="@/assets/img/meeting_assistant/meeting_opr_info.png" />
        <span class="meeting_opr_item_text">信息发布同步</span>
      </div>
      <div class="meeting_opr_item meeting_opr_item_blue">
        <img src="@/assets/img/meeting_assistant/meeting_opr_paper.png" />
        <span class="meeting_opr_item_text">无纸化服务同步</span>
      </div>
      <!--v-if="store.userInfo.oort_uuid===infoTemp['creator_uid']"-->
      <div class="meeting_opr_item meeting_opr_item_blank" @click="editClick(infoTemp)">
        <img src="@/assets/img/meeting_assistant/meeting_opr_edit.png" />
        <span class="meeting_opr_item_text">编辑</span>
      </div>
      <!--v-if="store.userInfo.oort_uuid===infoTemp['creator_uid']"-->
      <div class="meeting_opr_item meeting_opr_item_red" @click="delClick(infoTemp)">
        <img src="@/assets/img/meeting_assistant/meeting_opr_delete.png" />
        <span class="meeting_opr_item_text">删除</span>
      </div>
    </div>
    <template v-if="meetingEdit===false">
      <div class="meetting_info_title">
        <span class="flexRowAC">{{ infoTemp['subject'] || '-' }}
          <div class="meetingTypeBox flexRowAC">
            <template v-if="infoTemp.meeting_type===1"> 线下会议</template>
            <template v-if="infoTemp.meeting_type===2"> 线上会议</template>
          </div>
        </span>
        <span>{{
          `${infoTemp['start_dt'].slice(0, 10)} ${daysOfWeekFn(infoTemp['start_dt'])}  ${infoTemp['start_dt'].slice(11, 16)}~${infoTemp['end_dt'].slice(11, 16)}`
        }}&nbsp;{{ infoTemp['end_dt'].slice(0, 10) }}</span>
        <img v-if="infoTemp.status===9" class="cancelBox" src="@/assets/img/meeting_assistant/meet_end.png" alt="" />
        <img v-if="infoTemp.status===10" class="cancelBox" src="@/assets/img/meeting_assistant/meet_cancel.png" alt="" />
      </div>
      <div class="meetting_info_item">
        <img src="@/assets/img/meeting_assistant/time_2.png" height="24" width="24" />
        <span>{{ infoTemp['start_dt']?.slice(11, 16) }} - {{ infoTemp['end_dt']?.slice(11, 16) }}</span>
      </div>
      <!--时区-->
      <div class="meetting_info_item">
        <img src="@/assets/img/meeting_assistant/time_2.png" height="24" width="24" />
        <div class="flexRowAC">
          <div class="line" />
          {{ `(${infoTemp['time_zone']}) ${infoTemp['addr']}` }}
        </div>
        <div class="s">
          {{ infoTemp.device_start_dt.slice(0, 10) }}&nbsp;{{
            infoTemp.device_start_dt.slice(11, 16)
          }}&nbsp;{{ infoTemp.device_end_dt.slice(11, 16) }}
        </div>
      </div>
      <div class="meetting_info_item">
        <img src="@/assets/img/meeting_assistant/add_m_book.png" height="24" width="24" />
        <span>{{ infoRoomTemp?.['name'] || '-' }}</span>
      </div>
      <div v-if="infoTemp['conference_job']" class="meetting_info_item">
        <img src="@/assets/img/meeting_assistant/add_m_rep.png" height="24" width="24" />
        <span>{{ infoTemp['conference_job'] }}</span>
      </div>
      <div class="meetting_info_item">
        <img src="@/assets/img/meeting_assistant/add_m_warn.png" height="24" width="24" />
        <span v-if="infoTemp.reminder_time===0">不提醒</span>
        <span v-if="infoTemp.reminder_time===1">开始时</span>
        <span v-if="infoTemp.reminder_time===60*10">提前10分钟</span>
        <span v-if="infoTemp.reminder_time===60*20">提前20分钟</span>
        <span v-if="infoTemp.reminder_time===60*30">提前30分钟</span>
        <span v-if="infoTemp.reminder_time===60*60">提前1小时</span>
        <span v-if="infoTemp.reminder_time===60*60*24">提前1天</span>
      </div>
      <div class="person_select">
        <div class="meetting_info_item">
          <img src="@/assets/img/meeting_assistant/qrCode.png" height="24" width="24" />
          <span>签到二维码</span>
        </div>
        <div class="flexRowAC qrcodeBox">
          <el-image
            v-if="infoTemp.qrcode"
            class="qrcode"
            :src="infoTemp.qrcode"
            :preview-src-list="[infoTemp.qrcode]"
            :preview-teleported="true"
          />
          <div v-if="infoTemp.qrcode" class="downloadBox flexRowAC" @click="viewFn(infoTemp.qrcode)">
            <img src="@/assets/img/meeting_assistant/download.png" height="20" width="20" />
            <span>下载</span>
          </div>
        </div>
      </div>
      <div class="person_select">
        <div class="meetting_info_item">
          <img src="@/assets/img/meeting_assistant/add_m_org.png" height="24" width="24" />
          <span>会议组织人</span>
        </div>
        <div class="person_group">
          <!-- userFormat(infoTemp['creator_uid'],'')-->
          <div v-for="(item, index) in userFormat(infoTemp['manage'],'arr')" :key="index" class="person_group_item">
            <oort_img class="person_group_item_head" :src="item.oort_photo" default-img="tx" />
            <span class="person_group_item_name">{{ item['oort_name'] }}</span>
          </div>
        </div>
      </div>
      <div class="person_select">
        <div class="meetting_info_item">
          <img src="@/assets/img/meeting_assistant/add_m_ch.png" height="24" width="24" />
          <span>参会人</span>
        </div>
        <div class="person_group">
          <div
            v-for="(item, index) in userFormat(infoTemp['guest'],'arr')"
            :key="index"
            class="person_group_item flexRowAC"
          >
            <oort_img class="person_group_item_head" :src="item.oort_photo" default-img="tx" />
            <span class="person_group_item_name flexRowAC">{{ item['oort_name'] }}</span>
          </div>
        </div>
      </div>
      <div class="meetting_info_item">
        <img src="@/assets/img/meeting_assistant/add_m_intro.png" height="24" width="24" />
        <span>会议大纲：{{ infoTemp['detail'] || '-' }}</span>
      </div>
      <div v-if="infoTemp.cover&&infoTemp.cover.length" class="meetting_info_item flexS">
        <img src="@/assets/img/meeting_assistant/update_pic.png" height="24" width="24" />
        <div class="coverBox flexRowAC">
          <div v-for="(item,index) in infoTemp.cover" :key="index" class="img d">
            <el-image
              v-if="item"
              class="img d"
              :zoom-rate="1.2"
              :src="item.url"
              show-progress
              :preview-src-list="infoTemp.cover.map(tt=>tt.url)"
              fit="cover"
            />
            <img v-else class="img e" :src="item.url" alt="" />
          </div>
        </div>
      </div>
      <div v-if="infoTemp.material&&infoTemp.material.length" class="meetting_info_item flexS">
        <img src="@/assets/img/meeting_assistant/update_attach.png" height="24" width="24" />
        <div class="materialBox flexRowAC">
          <div v-for="(item,index) in infoTemp.material" :key="index" class="materialItem flexRowAC">
            <calc-file-type-img class="urlBox" :data="item.title" />
            <div class="view flexRowAC">
              <preview-files-url :url="item.url">
                <template #url>
                  <el-icon><View /></el-icon>
                </template>
              </preview-files-url>
              <el-icon @click="viewFn(item.url)">
                <Download />
              </el-icon>
            </div>
            <div>
              {{ item.title }}
              <div class="time">
                {{ FilesSizeCalc(item.size) }} ・ {{ item.created_at }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--会议纪要-->
      <div class="dynamic">
        <div class="pe-t">
          会议纪要
        </div>
        <meeting-info-dynamic :id="infoTemp.conference_uid" />
      </div>
    </template>
    <template v-if="meetingEdit===true">
      <div class="meetingEditTitle">
        会议概览
      </div>
      <new-meeting :item="meetingItem" @close="meetingEdit=false" @handle="emits('handle')" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { conferenceDel, houseNumberSync } from '@/api/meetingMana'
import MeetingInfoDynamic from '@/pages/meetingMana/views/page/meetingMana/components/MeetingInfoDynamic.vue'
import NewMeeting from '@/pages/meetingMana/views/page/meetingMana/newMeeting.vue'
import Oort_img from '@/components/oort_img.vue'
import CalcFileTypeImg from '@/components/calcFileTypeImg.vue'
import PreviewFilesUrl from '@/components/previewFilesUrl.vue'
import { FilesSizeCalc } from '@/utils/filesSizeCalc'

const store: any = useUserStore()
const props: any = defineProps(['data', 'act'])
const emits = defineEmits(['handle'])
let infoTemp = ref<any>('')
let infoUserTemp = ref<any>('')
let infoRoomTemp = ref<any>('')
let meetingEdit = ref(false)
let meetingItem = ref(false)

// 时间 周
const daysOfWeekFn = (today) => {
  let date = new Date(today)
  let daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  let weekDay = daysOfWeek[date.getDay()]
  return weekDay
}

const houseNumberSyncFn = (rows) => {
  ElMessageBox.confirm('是否将会议信息下发同步到门牌？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    const params = {
      accessToken: store.userInfo.accessToken,
      conference_uid: rows.conference_uid
    }
    let res: any = await houseNumberSync(params)
    if (res.code === 200) {
      ElMessage.success('同步成功')
      emits('handle')
    }
  }).catch(() => {
  })
}

// 下载
const viewFn = (url) => {
  window.open(url, '_blank')
}

// 过滤
const userFormat = (uid, type) => {
  const classify: any = infoUserTemp.value.filter((item: any) => type !== 'arr' ? item.oort_uuid === uid : uid.includes(item.oort_uuid))
  return classify || []
}

// 编辑
const editClick = (rows) => {
  meetingEdit.value = true
  meetingItem.value = rows
}

// 删除
const delClick = (rows) => {
  ElMessageBox.confirm('是否删除该会议？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    const params = {
      accessToken: store.userInfo.accessToken,
      conference_uid: rows.conference_uid
    }
    let res: any = await conferenceDel(params)
    if (res.code === 200) {
      ElMessage.success('会议删除成功')
      emits('handle')
    }
  }).catch(() => {
  })
}

watch(() => props.data, (val) => {
  meetingEdit.value = false
  if (val) {
    infoTemp.value = val.conference
    infoRoomTemp.value = val.conferenceRoom
    infoUserTemp.value = val.userInfo
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>

.meetting_info {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
}

.meeting_opr {
  display: flex;
  flex-direction: row;
  height: 60px;
  gap: 8px;
}

.meeting_opr_item {
  cursor: pointer;
  height: 44px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  img {
    width: 24px;
    height: 24px;
    margin-right: 4px;
  }

  span {
    font-size: 16px;
  }
}

.meeting_opr_item_blue {
  background: var(--el-color-primary);

  span {
    color: #fff;
  }
}

.meeting_opr_item_blank {
  border: 1px solid rgba(217, 217, 217, 1);

  span {
    color: #333333;
  }
}

.meeting_opr_item_red {
  border: 1px solid red;

  span {
    color: red;
  }
}

.meetting_info_title {
  min-height: 60px;
  margin-top: 10px;
  margin: 4px 0px;
  display: flex;
  flex-direction: column;
  position: relative;

  span:nth-of-type(1) {
    font-size: 24px;
    line-height: 24px;
  }

  span:nth-of-type(2) {
    font-size: 14px;
    padding: 10px 0;
  }

  .cancelBox {
    position: absolute;
    top: -10px;
    left: 30%;
    width: 78px;
    height: 78px;
  }
}

.meetting_info_item {
  display: flex;
  flex-direction: row;
  min-height: 40px;
  align-items: flex-start;
  word-break: break-all;

  img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  span {
    font-size: 16px;
    color: #333333;
  }

  &.flexS {
    margin-top: 20px;
    align-items: flex-start;
    flex-wrap: wrap;
  }
}

// 签到二维码
.qrcodeBox{
  margin-top: -10px;
  padding-left: 24px;
  align-items: flex-start;
  gap: 10px;
  .qrcode {
    width: 100px;
    height: 100px;
  }

  .downloadBox{
    cursor: pointer;
    padding-top: 10px;
    color: #0F6BFF;
    font-size: 14px;
  }
}

.person_select {
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;

  &_title {
    display: flex;
    align-items: center;
    height: 45px;

    img {
      width: 24px;
      height: 24px;
    }

    span {
      margin-left: 6px;
      font-size: 12px;
      color: #999999;
    }
  }
}

.person_group {
  width: 560px;
  display: flex;
  min-height: 54px;
  flex-wrap: wrap;
  margin-left: 32px;
  gap: 4px;

  &_item {
    padding: 4px 10px;
    display: flex;
    width: calc(20% - 4px);
    position: relative;
    flex-direction: column;
    align-items: center;
    text-align: center;

    &_head {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    &_name {
      white-space: break-spaces;
      font-size: 12px;
      color: #333;
    }

    &_remove {
      position: absolute;
      right: 6px;
      top: -4px;
      width: 16px;
      height: 16px;
      background-color: #c9c9c9;
      border-radius: 50%;
    }
  }
}

.gap_height {
  margin: 0 4px;
  height: 2px;
  width: 100%;
  background-color: #f0f0f0;
}

hr {
  border: 0.5px solid #F8F9FB;
}

.newTask_more {
  margin-top: 8px;
  background-color: #fff;
  display: flex;
  align-items: center;
  height: 48px;
  width: 100%;
}

.newTask_imgFile {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: 8px 4.4% 8px 4.4%;
  font-size: 12px;
}

.newTask_cfren {
  background-color: #fff;
  display: flex;
  padding: 0 4.4%;
  align-items: center;
  justify-content: space-between;

  span {
    font-size: 12px;
  }
}

.newTask_zxren_img {
  display: flex;
  justify-content: space-between;
  padding: 4.4% 0;
}

.newTask_div1 {
  background-color: #fff;
  display: flex;
  width: 100%;
  min-height: 86px;

  .newTask_div2 {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .newTask_color_fontsize {
    margin-top: 1.5%;
    color: #999999;
    font-size: 12px;
  }

  .newTask_img_size {
    padding-left: 4.4%;
    padding-top: 3%;
    width: 24px;
    height: 24px;
  }

  span {
    padding-top: 10px;
  }
}

.file_item {
  margin-left: 4.4%;
  margin-bottom: 4.4%;
  position: relative;
  height: 48px;
  width: 91.1%;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #FFFFFF;

  &_name {
    max-width: 215px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &_text {
    margin-left: 4.4%;
    display: flex;
    flex-direction: column;
  }

  &_delete {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 4%;
    right: 1%;
  }
}

.gap_height {
  height: 12px;
  width: 100%;
  background-color: #f0f0f0;
}

hr {
  border: 0.5px solid #F8F9FB;
}

.newTask_more {
  margin-top: 8px;
  background-color: #fff;
  display: flex;
  align-items: center;
  height: 48px;
  width: 100%;

  span {
    margin-left: 4.4%;
  }
}

.newTask_imgFile {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: 8px 4.4% 8px 4.4%;
  font-size: 12px;
}

.newTask_cfren {
  background-color: #fff;
  display: flex;
  padding: 0 4.4%;
  align-items: center;
  justify-content: space-between;

  span {
    font-size: 12px;
  }
}

.newTask_zxren_img {
  display: flex;
  justify-content: space-between;
  padding: 4.4% 0;
}

.newTask_div1 {
  background-color: #fff;
  display: flex;
  width: 100%;
  min-height: 86px;

  .newTask_div2 {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .newTask_color_fontsize {
    margin-top: 1.5%;
    color: #999999;
    font-size: 12px;
  }

  .newTask_img_size {
    padding-left: 4.4%;
    padding-top: 3%;
    width: 24px;
    height: 24px;
  }

  span {
    padding-top: 10px;
  }
}

.file_item {
  margin-left: 4.4%;
  margin-bottom: 4.4%;
  position: relative;
  height: 48px;
  width: 91.1%;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #F2F2F2;

  &_name {
    max-width: 215px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &_text {
    margin-left: 4.4%;
    display: flex;
    flex-direction: column;
  }

  &_delete {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 4%;
    right: 1%;
  }
}

// 图片
.coverBox {
  gap: 10px;
  flex-wrap: wrap;

  .d {
    position: relative;
    border: .1px solid rgba(247,247,247,.5);

    .el-icon {
      display: none;
      font-size: 20px;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      color: red;
    }
  }

  .d:hover  .el-icon {
      display: flex;
    }

  .img {
    flex-shrink: 0;
    width: 110px;
    height: 110px;
    background-size: cover;

    &.e {
      background-color: #f7f7f7;
    }
  }
}

// 附件
.materialBox {
  padding-top: 10px;
  width: 100%;
  flex-wrap: wrap;
  gap: 8px;

  .materialItem {
    height: 54px;
    width: calc(50% - 8px);
    padding: 0 12px;
    font-size: 14px;
    color: #333;
    background-color: var(--el-menu-hover-bg-color);

    .time{
      color: #B1B9C5;
      font-size: 11px;
    }
  }

  .materialImg {
    width: 28px;
    height: 38px;
    margin-right: 14px;
  }
}

.dynamic {
  // 会议纪要-title
  .pe-t {
    padding: 20px 0;
    font-size: 16px;
    color: #333;
    letter-spacing: 0;
    font-weight: 600;
  }

}

.meetingEditTitle {
  color: var(--el-color-primary);
}

.meetting_info_item .materialItem {
  position: relative;

  .urlBox {
    height: 48px;
    width: auto;
    background-size: cover;
    margin-right: 8px;
  }

  &:hover .view {
    display: flex;
  }

  .view {
    cursor: pointer;
    gap: 20px;
    position: absolute;
    right: 20px;
    display: none;
  }
}

.meetingTypeBox{
  margin-left: 20px;
  background-color: #FA9902;
  font-size: 12px;
  line-height: 12px;
  color: #fff;
  border-radius: 4px;
  padding: 4px 10px;
}
</style>
