<template>
  <div class="new_meeting">
    <div class="new_meeting_body">
      <el-form ref="formRef" class="tenantNForm" :model="form" :rules="rules">
        <el-form-item prop="subject">
          <div class="meeting_typeBox">
            <el-radio-group v-model="form.meeting_type">
              <el-radio :value="1">
                线下会议
              </el-radio>
              <el-radio :value="2">
                线上会议
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <div class="new_meeting_item subject">
          <img class="subject_img" src="@/assets/img/meeting_assistant/timeZone.png" />
          <el-input v-model="form.subject" class="meeting_tile" placeholder="会议主题" maxlength="64" />
        </div>
        <!-- 开始结束时间选择-->
        <div v-if="form.meeting_type===2" class="new_meeting_item">
          <div class="new_meeting_time_range flexRowAC">
            <img src="@/assets/img/meeting_assistant/time_2.png" />
            <new-meeting-time ref="meetingTimeRef" :time="datePickerTime" />
          </div>
        </div>
        <div v-if="form.meeting_type===1" class="new_meeting_item">
          <div class="work_index_body_select" @click="selectMeetingRoom">
            <div class="work_index_body_select_left">
              <div class="select_title">
                <img src="@/assets/img/meeting_assistant/add_m_book.png" height="24" width="24" />
                <span>会议室预定</span>
              </div>
              <div v-if="meetingRoom&&meetingRoomName?.name">
                <div class="flexRowAC mee">
                  <div class="ti">
                    {{ meetingRoomName['name'] }}
                  </div>
                  <span class="sp">{{
                    datePickerTime[0].slice(0, 10)
                  }} <span class="sp c">{{
                    `${datePickerTime[0].slice(11, 16)}~${datePickerTime[1].slice(11, 16)}`
                  }}</span></span>
                </div>
                <div class="flexRowAC mee">
                  <span class="s1">会议室地址：</span>
                  <span class="sp">{{ meetingRoomName.address || '-' }}</span>
                </div>
                <div class="flexRowAC mee">
                  <span class="s1">容纳人数：</span>
                  <span class="sp">{{ meetingRoomName['capacity'] || 0 }}</span>
                </div>
                <div class="flexRowAC mee">
                  <span class="s1">会议室设备列表：</span>
                  <span class="sp">{{ meetingRoomName['equipment'] || '-' }}</span>
                </div>
              </div>
              <span v-else class="select_content">选择会议室</span>
            </div>
            <div class="work_index_body_select_right">
              <el-icon color="#999">
                <ArrowRightBold />
              </el-icon>
            </div>
          </div>
        </div>
        <div class="new_meeting_item">
          <div class="new_meeting_item_title">
            <img src="@/assets/img/meeting_assistant/time_2.png" />
            <div class="timeZoneBox flexRowAC">
              <div class="flexRowAC t" @click="zoneVisi=true">
                时区
                <el-icon>
                  <ArrowRight />
                </el-icon>
              </div>
              <div v-if="timeZoneValue" class="flexRowAC">
                <div class="line" />
                {{ `(${timeZoneValue['time_zone']}) ${timeZoneValue['addr']}` }}
              </div>
            </div>
          </div>
          <div class="flexRowAC">
            <div v-if="timeZoneValue" class="converBox flexRowAC">
              日程时区时间：
              <span>{{ convertedTimeValue[0] }}&nbsp;&nbsp;&nbsp;</span>
              <span>{{ convertedTimeValue[1] }}</span>
              <span>({{ timeZoneValue['time_zone'] }})</span>
            </div>
          </div>
        </div>
        <div v-if="form.meeting_type===2" class="new_meeting_item">
          <div class="work_index_body_select">
            <div class="work_index_body_select_left">
              <div class="select_title">
                <img src="@/assets/img/meeting_assistant/add_m_video.png" height="24" width="24" />
                <span>视频会议</span>
              </div>
            </div>
            <div class="work_index_body_select_right">
              <!--              <el-switch
                v-model="form.meeting_type"
                active-color="#1156A6"
                inactive-color="#fff"
                :active-value="2"
                :inactive-value="1"
              />-->
            </div>
          </div>
          <div v-if="form.meeting_type===2" class="new_meeting_item_video">
            <div class="new_meeting_item_v_t">
              <span :class="{act:form.online_type===1}" @click="form.online_type=1">开启线上会议</span>
              <span :class="{act:form.online_type===2}" @click="form.online_type=2">第三方会议</span>
            </div>
            <div class="new_meeting_item_v_area">
              <el-input
                v-model="meetingAddr"
                style="width:100%"
                :rows="4"
                type="textarea"
                placeholder="请输入视频会议地址"
              />
            </div>
          </div>
        </div>
        <div class="new_meeting_item">
          <div class="new_meeting_item_title">
            <img src="@/assets/img/meeting_assistant/add_m_rep.png" />
            <span>重复</span>
          </div>
          <template v-if="queryTemp?.conference_uid">
            {{ form['conference_job'] || '无重复' }}
          </template>
          <template v-else>
            <cycle v-if="!form['conference_job']" ref="cycleRef" />
          </template>
        </div>
        <div class="new_meeting_item">
          <div class="new_meeting_item_title">
            <img src="@/assets/img/meeting_assistant/add_m_warn.png" />
            <span>添加提醒</span>
          </div>
          <div class="new_meeting_item_body">
            <el-radio-group v-model="form.reminder_time">
              <el-radio-button label="不提醒" :value="0" />
              <el-radio-button label="开始时" :value="1" />
              <el-radio-button label="提前10分钟" :value="60*10" />
              <el-radio-button label="提前20分钟" :value="60*20" />
              <el-radio-button label="提前30分钟" :value="60*30" />
              <el-radio-button label="提前1小时" :value="60*60" />
              <el-radio-button label="提前1天" :value="60*60*24" />
            </el-radio-group>
          </div>
        </div>
        <el-form-item>
          <div class="work_index_body_select">
            <div class="work_index_body_select_left">
              <div class="select_title">
                <img src="@/assets/img/meeting_assistant/add_m_video.png" height="24" width="24" />
                <span>会议加密（仅会议相关人员查看信息）</span>
              </div>
            </div>
            <div class="work_index_body_select_right">
              <el-switch
                v-model="form.encrypted"
                active-color="#1156A6"
                inactive-color="#fff"
                :active-value="2"
                :inactive-value="1"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="new_meeting_item">
            <div class="person_select">
              <div class="person_select_title">
                <img src="@/assets/img/meeting_assistant/add_m_org.png" height="24" width="24" />
                <span>会议组织人</span>
              </div>
              <div class="person_group">
                <div v-for="(item, index) in form.manage" :key="index" class="person_group_item">
                  <oort_img class="person_group_item_head" :src="item.oort_photo" default-img="tx" />
                  <span class="person_group_item_name">{{ item['oort_name'] }}</span>
                  <img
                    class="person_group_item_remove"
                    src="@/assets/img/icon_x.png"
                    @click="form.manage.splice(index, 1)"
                  />
                </div>
                <div class="person_group_item">
                  <img
                    class="person_group_item_head"
                    src="@/assets/img/meeting_assistant/add_m_person.png"
                    @click="userVisi=true,userVisiS=true"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <div class="new_meeting_item">
          <div class="person_select">
            <div class="person_select_title">
              <img src="@/assets/img/meeting_assistant/add_m_org.png" height="24" width="24" />
              <span>参会人</span>
            </div>
            <div class="person_group">
              <div v-for="(item, index) in form.guest" :key="index" class="person_group_item flexRowAC">
                <oort_img class="person_group_item_head" :src="item.oort_photo" default-img="tx" />
                <span class="person_group_item_name">{{ item['oort_name'] }}</span>
                <img
                  class="person_group_item_remove"
                  src="@/assets/img/icon_x.png"
                  @click="form.guest.splice(index, 1)"
                />
              </div>
              <div class="person_group_item">
                <img
                  class="person_group_item_head"
                  src="@/assets/img/meeting_assistant/add_m_person.png"
                  @click="userVisi=true,userVisiS=false"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="new_meeting_item">
          <div class="new_meeting_item_title">
            <img src="@/assets/img/meeting_assistant/add_m_intro.png" />
            <span>会议议程</span>
          </div>
          <div class="new_meeting_item_body">
            <div style="position: relative">
              <el-input
                v-model="form.detail"
                style="width:100%;min-height: 60px;"
                :autosize="{ minRows: 5, maxRows: 20 }"
                type="textarea"
                placeholder="请输入会议介绍"
                maxlength="1024"
                show-word-limit
              />
              <ai-icon-remark
                v-model="form.detail"
                :number="256"
                mod="议程"
                :keyword="'会议主题:'+ form.subject +'，时间' + (datePickerTime?.[0]||'')"
              />
            </div>
          </div>
        </div>
        <div class="new_meeting_item">
          <div class="new_meeting_item_title">
            <img src="@/assets/img/meeting_assistant/update_pic.png" />
            <span>上传图片</span>
          </div>
          <div class="new_meeting_item_body">
            <el-upload
              :action="upfileURL"
              :headers="headers"
              :show-file-list="false"
              class="up_box"
              drag
              multiple
              accept=".png, .jpg, .jpeg"
              :on-success="val=>handleAvatarSuccess(val, 'cover')"
              :before-upload="beforeUpload"
            >
              <el-icon class="el-icon--upload">
                <upload-filled />
              </el-icon>
              <div class="el-upload__text">
                上传图片
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  可同时上传多张
                </div>
              </template>
            </el-upload>
            <div v-if="form.cover" class="coverBox flexRowAC">
              <div v-for="(item,index) in form.cover" :key="index" class="img d">
                <img v-if="item" class="img" :src="item.url" alt="" />
                <el-icon @click="form.cover.splice(index,1)">
                  <CircleCloseFilled />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="new_meeting_item">
          <div class="new_meeting_item_title">
            <img src="@/assets/img/meeting_assistant/update_attach.png" />
            <span>上传附件</span>
          </div>
          <div class="new_meeting_item_body">
            <el-upload
              :action="upfileURL"
              :headers="headers"
              :show-file-list="false"
              class="up_box"
              drag
              multiple
              accept=".word,.excel,.ppt,.doc,.docx,.pdf,.xls,.xlsx,.pdf,.apk,.zip,.rar,.7z,.tar,.gz,.txt,video/*, audio/*"
              :on-success="val=>handleAvatarSuccess(val, 'material')"
              :before-upload="beforeUpload"
            >
              <el-icon class="el-icon--upload">
                <upload-filled />
              </el-icon>
              <div class="el-upload__text">
                上传附件
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  可同时上传多个
                </div>
              </template>
            </el-upload>
            <div class="materialBox">
              <div v-for="(item,index) in form.material" :key="index" class="materialItem flexRowAC">
                <div v-if="item.materialuid" class="flexRowAC">
                  <calc-file-type-img class="urlBox" :data="item.title" />
                  <div>
                    {{ item.title }}
                    <div class="time">
                      {{ FilesSizeCalc(item.size) }} ・ {{ item.created_at }}
                    </div>
                  </div>
                </div>
                <file-upload-progress v-else :data="item" :is-repeat="item['isRepeat']" />
                <el-icon @click="form.material.splice(index,1)">
                  <CircleCloseFilled />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="elButtonBox flexRowAC">
          <el-button @click="emits('close')">
            取消
          </el-button>
          &nbsp;&nbsp;
          <el-button type="primary" @click="saveClick(formRef)">
            保存
          </el-button>
        </div>
      </el-form>
    </div>
    <el-drawer
      v-model="bookDrawerVis"
      title="预定会议室"
      direction="rtl"
      size="60%"
      @close="bookRoomHandle"
    >
      <MeetingBookRoom
        v-if="bookDrawerVis"
        ref="bookRef"
        :time="timeArr"
        :list="meetingRoom"
        :curr="meetingRoomName"
        :conference_uid="queryTemp?.conference_uid"
        @handleSave="handleSave"
      />
    </el-drawer>
    <!--人员选择-->
    <el-dialog
      v-model="userVisi"
      title="人员选择"
      width="53%"
      destroy-on-close
      append-to-body
    >
      <address-seting-dialog
        v-if="userVisi"
        :mode="3"
        :user-list="userVisiS?form.manage:form.guest"
        @cancelChoose="userVisi=false"
        @saveChoose="saveConfirm"
        @close="userVisi=false"
      />
    </el-dialog>
    <!--时区-->
    <el-dialog
      v-model="zoneVisi"
      title="会议时区"
      width="40%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <time-zone
        v-if="zoneVisi"
        @handle="val=>timeZoneValue=val"
        @close="zoneVisi=false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { ArrowRightBold } from '@element-plus/icons-vue'
import MeetingBookRoom from './components/MeetingBookRoom.vue'
import { useUserStore } from '@/store/modules/user'
import { conferenceInfo, conferenceSave } from '@/api/meetingMana'
import Config from '@/config'
import { timestampToTime, timeToTimestamp } from '@/utils/time'
import Cycle from '@/pages/meetingMana/views/page/meetingMana/components/cycle.vue'
import AiIconRemark from '@/components/aiIconRemark.vue'
import Oort_img from '@/components/oort_img.vue'
import FileUploadProgress from '@/pages/meetingMana/views/page/meetingMana/components/fileUploadProgress.vue'
import CalcFileTypeImg from '@/components/calcFileTypeImg.vue'
import { FilesSizeCalc } from '@/utils/filesSizeCalc'
import TimeZone from '@/pages/meetingMana/views/page/meetingMana/components/timeZone.vue'
import { convertTimezone } from '@/utils/timezonConverter'
import NewMeetingTime from '@/pages/meetingMana/views/page/meetingMana/components/newMeetingTime.vue'

const props = defineProps(['item'])
let queryTemp = ref<any>('')
const emits = defineEmits(['close', 'handle'])
const store: any = useUserStore()
let headers = ref<any>(Config.headers) // 上传headers
let upfileURL = ref<any>('') // 上传路径
upfileURL.value = Config.URL + Config.gateWay + 'oortcloud-fastdfsservice/fastdfs/v1/uploadFile'
const formRef = ref('') // form Ref
const bookRef = ref<any>(null) // form Ref
let userVisi = ref(false) // 人员选择
let userVisiS = ref(true) // 人员选择 单选
const datePickerTime = ref<any>([])
const meetingRoom = ref<any>(null)
const meetingRoomName = ref<any>(null)
const meetingAddr = ref('')
const cycleRef = ref<any>('') // Ref 不重复
// const meetingRepeat = ref('不重复')
// const meetingRemind = ref('不提醒')
const bookDrawerVis = ref(false)
const zoneVisi = ref(false) // 会议时区
const timeZoneValue = ref<any>('') // 会议时区
const timeArr = ref<any>(['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'])
const meetingTimeRef = ref<any>(null)
const form = reactive<any>({
  subject: '',
  status: 1, // 会议状态
  duration: 0,
  reminder_time: 0,
  job: {
    types: 0
  },
  manage: [
    {
      oort_name: store.userInfo?.oort_name,
      oort_uuid: store.userInfo?.oort_uuid,
      oort_photo: store.userInfo?.oort_photo
    }
  ], // 主持人
  encrypted: 2, // 会议是否加密 1加密 2不加密
  cover: [], // 会议封面
  material: [], // 会议封面
  room_uid: '', // 会议室唯一标记
  guest: [], // 参会人员
  meeting_type: 2, // 线上
  detail: '', // 会议简介
  online_type: 1 // 1本平台会议 2第三方会议
})
const rules = reactive<FormRules<any>>({
  subject: [
    { required: true, message: '请输入会议标题', trigger: 'blur' }
  ],
  manage: [
    { required: true, message: '请选择会议组织人', trigger: 'blur' }
  ]
})

// 时区换算日期
const convertedTimeValue = computed(() => {
  let start_dt, end_dt
  if (datePickerTime.value && datePickerTime.value.length && timeZoneValue.value) {
    start_dt = convertTimezone(datePickerTime.value[0], 'UTC+08:00', timeZoneValue.value.time_zone)
    end_dt = convertTimezone(datePickerTime.value[1], 'UTC+08:00', timeZoneValue.value.time_zone)
  }
  return [start_dt, end_dt]
})

// 保存用户选中
const saveConfirm = async(address: any) => {
  // 选择的用户
  if (address.user) {
    if (userVisiS.value) form.manage = address.user || []
    if (!userVisiS.value) form.guest = address.user || []
  }
  userVisi.value = false
}

// 会议室预定
const selectMeetingRoom = () => {
  bookDrawerVis.value = true
}

// 预定的会议室
const bookRoomHandle = () => {
  let R: any = ''
  if (bookRef.value) R = bookRef.value
  if (R) {
    meetingRoom.value = R.activePosArr || []
    meetingRoomName.value = R.activeSelList[0]
    form.duration = meetingRoom.value.length * 60 || 0
    // 会议室唯一标记
    if (meetingRoomName.value?.room_uid) {
      let R = meetingRoomName.value
      let E = `${endTransFn(timeArr.value[R.end])}`
      datePickerTime.value = [`${R.yearTemp} ${timeArr.value[R.start]}:00`, `${R.yearTemp} ${E}:00`]
      form.room_uid = R.room_uid
      // 线下
      form.meeting_type = 1
    }
  }
}

const handleSave = (val) => {
  bookRef.value = val
  bookRoomHandle()
  bookDrawerVis.value = false
}

// 上传
const handleAvatarSuccess = (res: any, type) => {
  if (res.code === 200) {
    if (type === 'material') {
      let obj = {
        materialuid: '',
        ...res.data,
        title: res.data.src?.split('/')?.slice(-1)[0],
        url: res.data.url
      }
      if (obj) {
        obj.isRepeat = form.material.findIndex(tt => tt.md5 === obj.md5) !== -1
      }
      form.material.push(obj)
    } else {
      form.cover.push(res.data)
    }
  } else {
    ElMessage.error('上传失败')
  }
}

// 文件大小
const beforeUpload = () => {
  // let isLimit = file.size / 1024 / 1024 < 2
  // if (!isLimit) {
  //   ElMessage.error('图片大小不能超过2MB!')
  // }
  // return isLimit
}

// 添加
const saveClick = async(formEl: any) => {
  if (!form.subject) return ElMessage.warning('请输入会议标题')
  if (datePickerTime.value?.length === 0 && form.meeting_type === 1) return ElMessage.warning('请选择会议室')
  if (!form.manage) return ElMessage.warning('请选择会议组织人')
  let jobF = true
  if (!queryTemp.value?.conference_uid) jobF = await cycleRef.value.save()
  console.log('save', jobF)
  console.log('dataForm', cycleRef.value.dataForm)
  if (!jobF && !cycleRef.value.dataForm) {
    return ElMessage.warning('重复必填项为空')
  } else {
    form.job = undefined
    if (cycleRef.value.dataForm?.every) form.job = cycleRef.value.dataForm
  }
  if (!formEl) return
  await formEl.validate(async(valid: boolean) => {
    if (valid) {
      let data = {
        accessToken: store.userInfo.accessToken,
        ...form,
        manage: form.manage.map(item => item['oort_uuid']),
        guest: form.guest.map(item => item['oort_uuid'])
      }
      if (timeZoneValue.value) {
        data.time_zone = timeZoneValue.value.time_zone
        data.time_zone_area = timeZoneValue.value.addr
      } // 时区
      // meeting_type为1 时间获取
      if (datePickerTime.value && datePickerTime.value?.length !== 0) {
        data['start_dt'] = datePickerTime.value[0]
        data['end_dt'] = timestampToTime(timeToTimestamp(datePickerTime.value[1]))
      }
      // meeting_type为2 时间获取
      if (form.meeting_type === 2 && meetingTimeRef.value) {
        data['start_dt'] = meetingTimeRef.value.datePickerTime[0]
        data['end_dt'] = meetingTimeRef.value.datePickerTime[1]
      }
      // 会议室
      if (queryTemp.value) data['conference_uid'] = queryTemp.value.conference_uid
      console.log(data)
      let res: any = await conferenceSave(data)
      if (res.code === 200) {
        emits('close')
        emits('handle')
        ElMessage.success('保存成功')
      }
    } else {
      return false
    }
  })
}

function detailsFn(val) {
  let info = val.conference
  let room = val.conferenceRoom
  let user = val.userInfo
  // 时区
  timeZoneValue.value = {
    addr: info.addr,
    time_zone: info.time_zone
  }
  form['conference_job'] = info.conference_job
  form.subject = info.subject
  form.meeting_type = info.meeting_type
  form.online_type = info.online_type
  form.status = info.status
  form.encrypted = info.encrypted
  form.manage = user.filter((item: any) => info.manage.includes(item.oort_uuid))
  form.guest = user.filter((item: any) => info.guest.includes(item.oort_uuid))
  form.detail = info.detail
  form.cover = info.cover
  form.material = info.material
  datePickerTime.value = [info.start_dt, info.end_dt]
  // 会议室-回显
  let S = info.start_dt.split(' ')[1]?.substring(0, 5)
  let E = info.end_dt.split(' ')[1]?.substring(0, 5)
  if (room?.room_uid) {
    room['yearTemp'] = info.start_dt.substring(0, 10)
    meetingRoom.value = []
    if (S || E) {
      if (timeArr.value.indexOf(S) !== -1) {
        let S_ = timeArr.value.indexOf(S)
        meetingRoom.value.push(`${S_}--${room.room_uid}`)
      }
      if (timeArr.value.indexOf(E) !== -1) {
        let E_ = timeArr.value.indexOf(E)
        meetingRoom.value.push(`${E_}--${room.room_uid}`)
      }
    } else {
      meetingRoom.value = null
    }
  }
  meetingRoomName.value = room
}

// 时间 :59
const endTransFn = (val) => {
  // let n = parseInt(val) - 1
  // let v = n > 9 ? `${n}:59` : n ? `0${n}:59` : '23:59'
  let n = parseInt(val)
  let v = n > 9 ? `${n}:00` : n ? `0${n}:00` : '23:59'
  return v
}

// 详情
const getInfoFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    conference_uid: queryTemp.value.conference_uid
  }
  let res: any = await conferenceInfo(data)
  if (res.code === 200) {
    detailsFn(res.data)
  }
}

watch(() => props.item, (val) => {
  queryTemp.value = val
  if (val) getInfoFn()
}, { immediate: true })
</script>

<style lang="scss" scoped>

.new_meeting_header {
  height: 47px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #ebeef5;
}

.new_meeting_body {
  padding: 0px 40px;
}

.new_meeting_item {
  max-width: 600px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 20px;

  &.subject {
    flex-direction: row;
    align-items: center;
  }

  .subject_img {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }
}

.meeting_tile {
  width: 600px;
  font-size: 22px;
  border: 0;
  line-height: 22px;
  //padding-top: 10px;

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    padding-left: 0;
  }
}

.new_meeting_time_range {
  height: 48px;
  width: 600px;
  /* :deep(.el-input__wrapper) {
    box-shadow: none !important;
  } */
  img {
    width: 24px;
    height: 24px;
  }
}

.work_index_body_select {
  display: flex;
  flex-direction: row;
  width: 600px;
  margin-bottom: 8px;

  &_left {
    flex: 1;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }

  &_right {
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.select_title {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 4px 0px;

  img {
    width: 24px;
    height: 24px;
  }

  span {
    margin-left: 6px;
    font-size: 14px;
    color: #999999;
  }
}

.select_content {
  margin-left: 16px;
  font-size: 14px;
  color: #999999;
}

.new_meeting_item_video {
  width: 400px;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
}

.new_meeting_item_v_t {
  display: flex;
  align-items: center;
  height: 32px;

  span {
    font-size: 12px;
    color: #999999;
    margin-right: 16px;
    background: #F6F6F6;
    border-radius: 2px;
    padding: 2px 8px;
    cursor: pointer;
  }

  span:hover, .act {
    background: var(--el-menu-hover-bg-color);
    color: var(--el-color-primary);
  }
}

.new_meeting_item_v_area {

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
  }
}

.new_meeting_item_title {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 32px;
  font-size: 14px;
  color: #999999;

  img {
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }
}

.person_select {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;

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
      font-size: 14px;
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
      cursor: pointer;
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

.new_meeting_item_body {
  padding: 0 20px;
  min-height: 60px;
}

:deep(.el-drawer__body) {
  padding: 0px 20px;
}

.new_meeting {
  /* height: 100%; */
  /* overflow: auto; */
}

:deep(.el-radio-group) {
  gap: 20px;

  .el-radio-button__inner {
    background: #F6F6F6;
    border-radius: 2px;
    border: 1px solid var(--el-border);
  }

  .el-radio-button.is-active .el-radio-button__inner {
    background-color: var(--el-color-primary);
  }
}

.elButtonBox {
  padding: 40px 20px;
  max-width: 600px;
  justify-content: flex-end;
}

:deep(.el-page-header__title) {
  font-size: 18px;
}

// 图片
.coverBox {
  gap: 10px;
  flex-wrap: wrap;

  .d {
    position: relative;
    border: .1px solid rgba(247, 247, 247, .5);

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

  .d:hover .el-icon {
    display: flex;
  }

  .img {
    flex-shrink: 0;
    width: 110px;
    height: 110px;
    background-size: cover;
  }
}

// 附件
.materialBox {
  width: 100%;

  .el-icon {
    display: none;
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 16px;
    color: red;
  }

  &:hover .el-icon {
    display: flex;
  }

  .materialItem {
    margin-bottom: 10px;
    height: 54px;
    width: 100%;
    padding: 0 12px;
    font-size: 14px;
    color: #333;
    background-color: var(--el-menu-hover-bg-color);
    position: relative;

    .time {
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

// 会议室预定
.mee {
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding-bottom: 4px;

  .ti {
    font-size: 18px;
    color: #333333;
  }

  .s1 {
    color: #999;
  }

  .sp {
    color: #333;
    text-align: right;
    flex: 1;
    word-break: break-all;

    &.c {
      color: #FA9902;
    }
  }
}

.urlBox {
  height: 24px;
  width: auto;
  background-size: cover;
  margin-right: 8px;
}

.meeting_typeBox {
  padding-top: 20px;
}

.timeZoneBox {
  .line {
    width: 1px;
    height: 12px;
    margin: 0 12px;
    background-color: #E8E8E8;
  }

  .t {
    padding: 2px 4px;
    border-radius: 4px;
    color: #333;

    &:hover {
      cursor: pointer;
      background-color: #E8E8E8;
    }
  }
}

.converBox{
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  color: #333;
  background-color: #E8E8E8;
}
</style>
