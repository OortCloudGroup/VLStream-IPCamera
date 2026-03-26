<template>
  <div>
    <div class="nmt_range">
      <div class="nmt_date_wrap">
        <span class="nmt_date" @click="openStartDate">{{ dayjs(datePickerTime[0]).format('YYYY年M月D日') }}</span>
        <el-date-picker
          ref="startDateRef"
          v-model="datePickerTime[0]"
          type="date"
          value-format="YYYY-MM-DD"
          class="nmt_hidden"
        />
      </div>
      <span class="nmt_time_wrap">
        <div class="nmt_time_wrap_box">
          <!--          <span class="nmt_time" @click="openStartTime">{{ dayjs(datePickerTime[0]).format('HH:mm') }}</span>-->
          <el-time-select
            ref="startTimeRef"
            v-model="start"
            class="startTimeRef"
            start="00:30"
            step="00:30"
            end="23:30"
          />
        </div>
        <span class="nmt_sep">&nbsp;—&nbsp;</span>
        <div class="nmt_time_wrap_box">
          <!--          <span class="nmt_time" @click="openEndTime">{{ dayjs(datePickerTime[1]).format('HH:mm') }}</span>-->
          <el-time-select
            ref="endTimeRef"
            v-model="end"
            class="startTimeRef"
            :start="start"
            step="00:30"
            end="23:30"
          />
        </div>
      </span>
      <div class="nmt_date_wrap">
        <span class="nmt_date" @click="openEndDate">{{ dayjs(datePickerTime[1]).format('YYYY年M月D日') }}</span>
        <el-date-picker
          ref="endDateRef"
          v-model="datePickerTime[1]"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledEndDate"
          class="nmt_hidden"
        />
      </div>
    </div>
    <div class="newMeetingTime flexRowAC">
      <!-- 保留原有控件行，如需彻底隐藏可加 nmt_hidden -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { dayjs } from 'element-plus'
import { defineExpose } from 'vue'

const props = defineProps(['time'])
// const emits = defineEmits(['handle'])
const now = new Date()
const startHour = now.getHours()
const startMinute = now.getMinutes() >= 30 ? 30 : 0
let start = ref(
  `${startHour.toString().padStart(2, '0')}:${startMinute === 0 ? '00' : '30'}`
)
// 计算 end
let endHour = startHour
let endMinute = startMinute + 30
if (endMinute === 60) {
  endHour += 1
  endMinute = 0
}
let end = ref(
  `${endHour.toString().padStart(2, '0')}:${endMinute === 0 ? '00' : '30'}`
)
const today = dayjs(new Date()).format('YYYY-MM-DD')
// 明天
// const tomorrow = dayjs(Date.now() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
const datePickerTime = ref<any>([
  `${today} ${start.value}:00`,
  `${today} ${end.value}:00`
])

const startDateRef = ref()
const endDateRef = ref()
const startTimeRef = ref()
const endTimeRef = ref()

function openStartDate() {
  if (startDateRef.value && typeof startDateRef.value.handleOpen === 'function') {
    startDateRef.value.handleOpen()
  } else if (startDateRef.value && typeof startDateRef.value.focus === 'function') {
    startDateRef.value.focus()
  }
}
function openEndDate() {
  if (endDateRef.value && typeof endDateRef.value.handleOpen === 'function') {
    endDateRef.value.handleOpen()
  } else if (endDateRef.value && typeof endDateRef.value.focus === 'function') {
    endDateRef.value.focus()
  }
}

/* function openStartTime() {
  if (startTimeRef.value && typeof startTimeRef.value.handleOpen === 'function') {
    startTimeRef.value.handleOpen()
  }
}
function openEndTime() {
  if (endTimeRef.value && typeof endTimeRef.value.handleOpen === 'function') {
    endTimeRef.value.focus()
  } else if (endTimeRef.value && typeof endTimeRef.value.focus === 'function') {
    endTimeRef.value.focus()
  }
} */

// 只允许选择大于 datePickerTime[0] 的日期
function disabledEndDate(time) {
  const startDate = dayjs(datePickerTime.value[0]).format('YYYY-MM-DD')
  const currentDate = dayjs(time).format('YYYY-MM-DD')
  return currentDate <= startDate
}

watch(
  [start, end, () => datePickerTime.value[0], () => datePickerTime.value[1]],
  ([newStart, newEnd, newStartDate, newEndDate], [oldStart, oldEnd, oldStartDate, oldEndDate]) => {
    // 1. start 变化时，更新 datePickerTime[0]
    if (newStart !== oldStart) {
      const datePart = dayjs(datePickerTime.value[0]).format('YYYY-MM-DD')
      datePickerTime.value[0] = `${datePart} ${newStart}:00`
    }
    // 2. end 变化时，更新 datePickerTime[1]
    if (newEnd !== oldEnd) {
      const datePart = dayjs(datePickerTime.value[1]).format('YYYY-MM-DD')
      datePickerTime.value[1] = `${datePart} ${newEnd}:00`
    }
    // 3. datePickerTime[0] 变化时，修正时间部分
    if (newStartDate !== oldStartDate) {
      const datePart = dayjs(newStartDate).format('YYYY-MM-DD')
      datePickerTime.value[0] = `${datePart} ${start.value}:00`
    }
    // 4. datePickerTime[1] 变化时，修正时间部分
    if (newEndDate !== oldEndDate) {
      const datePart = dayjs(newEndDate).format('YYYY-MM-DD')
      datePickerTime.value[1] = `${datePart} ${end.value}:00`
    }
    // 5. 结束时间必须大于开始时间
    if (
      dayjs(datePickerTime.value[1]).isBefore(dayjs(datePickerTime.value[0])) ||
      dayjs(datePickerTime.value[1]).isSame(dayjs(datePickerTime.value[0]))
    ) {
      const newEnd = dayjs(datePickerTime.value[0]).add(30, 'minute').format('YYYY-MM-DD HH:mm:ss')
      datePickerTime.value[1] = newEnd
      end.value = dayjs(newEnd).format('HH:mm')
    }
    /*    // 6. 通知父组件
    emits('handle', datePickerTime.value) */
  },
  { deep: true }
)

watch(() => props.time, (val) => {
  if (val && val.length) {
    let S = val[0].split(' ')
    let E = val[1].split(' ')
    datePickerTime.value = val
    start.value = S[1].slice(0, 5)
    end.value = E[1].slice(0, 5)
  }
}, { immediate: true })

defineExpose({
  datePickerTime
})

</script>

<style lang="scss" scoped>
.nmt_wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 15px;
  color: #222;
}
.nmt_range {
  display: flex;
  align-items: center;
  font-size: 15px;
  line-height: 16px;
  color: #222;
}
.nmt_date {
  padding: 2px 6px;
  margin: 0 8px;
  font-size: 15px;
  color: #222;
}
.nmt_time {
  font-size: 15px;
  padding: 2px 6px;
  color: #222;
}
.nmt_sep {
  margin: 0 4px;
  color: #222;
}
.nmt_picker_row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.nmt_picker {
  margin: 0 2px;
  font-size: 14px;
}
.nmt_picker_date :deep(.el-input__wrapper),
.nmt_picker_time :deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
  background: transparent !important;
  padding: 0 2px !important;
}
.nmt_picker_date :deep(.el-input__inner),
.nmt_picker_time :deep(.el-input__inner) {
  text-align: center;
  font-size: 14px;
  color: #222;
  padding: 0 !important;
}
.nmt_picker_date :deep(.el-input__suffix),
.nmt_picker_time :deep(.el-input__suffix) {
  display: none !important;
}
.nmt_date_wrap {
  display: inline-block;
  position: relative;

  :deep(.el-input) {
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    z-index: 0 !important;
  }
}
.nmt_time_wrap_box {
  display: inline-block;
  position: relative;
  :deep(.el-input) {
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    z-index: 0 !important;
  }
}
.nmt_hidden {
  visibility: hidden !important;
  position: absolute !important;
  left: 0;
  top: 100%;
  width: 0;
  height: 0;
  pointer-events: none !important;
  z-index: 0 !important;
}
.nmt_date,
.nmt_time {
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
}
.nmt_date:hover,
.nmt_time:hover {
  background: #f3f4f6;
}

:deep(.startTimeRef) {
  width: 80px;

  .el-icon {
    display: none;
  }

}
</style>

