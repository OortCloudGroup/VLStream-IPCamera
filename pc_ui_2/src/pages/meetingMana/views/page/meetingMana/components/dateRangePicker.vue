<template>
  <div class="date-picker">
    <div class="date-picker-container">
      <!-- 年份选择 -->
      <div class="year-selector">
        <div class="section-title">
          年份
        </div>
        <div class="year-grid">
          <div
            v-for="year in yearOptions"
            :key="year"
            :class="['year-item', { active: selectedYear === year, current: year === currentYear }]"
            @click="selectYear(year)"
          >
            {{ year }}
          </div>
        </div>
      </div>

      <!-- 月份选择 -->
      <div class="month-selector">
        <div class="section-title">
          月份
        </div>
        <div class="month-grid">
          <div
            v-for="month in 12"
            :key="month"
            :class="['month-item', {
              active: selectedMonth === month,
              current: month === currentMonth && selectedYear === currentYear
            }]"
            @click="selectMonth(month)"
          >
            {{ month }}
          </div>
        </div>
      </div>

      <!-- 日期选择 -->
      <div class="day-selector">
        <div class="section-title">
          日期
        </div>
        <div class="day-grid">
          <div
            v-for="day in getDaysInMonth()"
            :key="day"
            :class="['day-item', {
              active: selectedDay === day,
              current: day === currentDay && selectedMonth === currentMonth && selectedYear === currentYear,
              'has-data': highlightDays.includes(day),
              'in-range': isDayInDragRange(day),
              'range-start': dragRange.start === day,
              'range-end': dragRange.end === day
            }]"
            @click="selectDay(day)"
            @mousedown="startDrag(day)"
            @mouseenter="onDayHover(day)"
            @mouseup="endDrag(day)"
          >
            {{ day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { dayjs } from 'element-plus'

// Props
const props = defineProps(['list'])

// 当前时间
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1
const currentDay = now.getDate()

// 选中的值
const selectedYear = ref(currentYear)
const selectedMonth = ref(currentMonth)
const selectedDay = ref(currentDay)

// 选择级别：year, month, day, range
const selectionLevel = ref('day')

// 拖拽相关状态
const isDragging = ref(false)
const dragRange = ref({
  start: null,
  end: null
})

// 高亮日期数组
let highlightDays = ref([])

// 生成年份选项（当前年份居中的9个年份）
const yearOptions = computed(() => {
  const years = []
  for (let i = currentYear - 4; i <= currentYear + 4; i++) {
    years.push(i)
  }
  return years
})

// 获取指定月份的天数
const getDaysInMonth = () => {
  if (!selectedYear.value || !selectedMonth.value) return []

  const daysInMonth = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
}

// 格式化时间
const formatDateTime = (year, month = 1, day = 1, hour = 0, minute = 0, second = 0) => {
  const date = new Date(year, month - 1, day, hour, minute, second)
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 计算日期范围
const dateRange = computed(() => {
  let start_dt, end_dt

  if (selectionLevel.value === 'year') {
    // 选择年份：整年范围
    start_dt = formatDateTime(selectedYear.value, 1, 1, 0, 0, 0)
    end_dt = formatDateTime(selectedYear.value, 12, 31, 23, 59, 59)
  } else if (selectionLevel.value === 'month') {
    // 选择月份：整月范围
    const lastDay = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
    start_dt = formatDateTime(selectedYear.value, selectedMonth.value, 1, 0, 0, 0)
    end_dt = formatDateTime(selectedYear.value, selectedMonth.value, lastDay, 23, 59, 59)
  } else if (selectionLevel.value === 'range') {
    // 拖拽选择：日期范围
    const startDay = Math.min(dragRange.value.start, dragRange.value.end)
    const endDay = Math.max(dragRange.value.start, dragRange.value.end)
    start_dt = formatDateTime(selectedYear.value, selectedMonth.value, startDay, 0, 0, 0)
    end_dt = formatDateTime(selectedYear.value, selectedMonth.value, endDay, 23, 59, 59)
  } else {
    // 选择日期：整天范围
    start_dt = formatDateTime(selectedYear.value, selectedMonth.value, selectedDay.value, 0, 0, 0)
    end_dt = formatDateTime(selectedYear.value, selectedMonth.value, selectedDay.value, 23, 59, 59)
  }

  return { start_dt, end_dt }
})

// 判断日期是否在拖拽范围内
const isDayInDragRange = (day) => {
  // if (!isDragging.value || !dragRange.value.start || !dragRange.value.end) return false
  const start = Math.min(dragRange.value.start, dragRange.value.end)
  const end = Math.max(dragRange.value.start, dragRange.value.end)
  return day >= start && day <= end
}

// 开始拖拽
const startDrag = (day) => {
  selectedDay.value = ''
  isDragging.value = true
  dragRange.value.start = day
  dragRange.value.end = day
  selectionLevel.value = 'range'

  // 阻止文本选择
  document.addEventListener('selectstart', preventDefault)
  document.addEventListener('mouseup', onDocumentMouseUp)
}

// 拖拽过程中
const onDayHover = (day) => {
  if (isDragging.value) {
    dragRange.value.end = day
  }
}

// 结束拖拽
const endDrag = (day) => {
  if (isDragging.value) {
    dragRange.value.end = day
    isDragging.value = false
    emitDateChange()
    // 移除事件监听
    document.removeEventListener('selectstart', preventDefault)
    document.removeEventListener('mouseup', onDocumentMouseUp)
  }
}

// 文档鼠标抬起事件
const onDocumentMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    // 移除事件监听
    document.removeEventListener('selectstart', preventDefault)
    document.removeEventListener('mouseup', onDocumentMouseUp)
  }
}

// 阻止默认事件
const preventDefault = (e) => {
  e.preventDefault()
}

// 选择年份
const selectYear = (year) => {
  selectedYear.value = year
  selectionLevel.value = 'year'
  // 清空选中日期和拖拽范围
  selectedMonth.value = ''
  selectedDay.value = ''
  dragRange.value = { start: null, end: null }
  emitDateChange()

/*   // 重新获取高亮数据
  fetchHighlightData() */
}

// 选择月份
const selectMonth = (month) => {
  selectedMonth.value = month
  selectionLevel.value = 'month'
  // 清空选中日期和拖拽范围
  selectedDay.value = ''
  dragRange.value = { start: null, end: null }
  emitDateChange()

  // // 重新获取高亮数据
  // fetchHighlightData()
}

// 选择日期
const selectDay = (day) => {
  if (isDragging.value) return // 如果正在拖拽，不响应点击

  selectedDay.value = day
  selectionLevel.value = 'day'
  // 清空拖拽范围
  dragRange.value = { start: null, end: null }
}

// 触发事件
const emit = defineEmits(['dateChange'])

const emitDateChange = () => {
  const eventData = {
    level: selectionLevel.value,
    year: selectedYear.value,
    month: selectedMonth.value,
    day: selectedDay.value,
    ...dateRange.value
  }

  // 如果是范围选择，添加范围信息
  if (selectionLevel.value === 'range') {
    eventData.range = {
      start: dragRange.value.start,
      end: dragRange.value.end
    }
  }

  emit('dateChange', eventData)
}

// 监听年份和月份变化，重新获取高亮数据
watch(() => props.list, (val) => {
  highlightDays.value = val?.map(item => parseInt(item.date)) || []
})

// 初始化时触发事件和获取数据
onMounted(() => {
  emitDateChange()
})
</script>

<style scoped>
.date-picker {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.date-picker-container {
  display: flex;
}

.year-selector,
.month-selector,
.day-selector {
  flex: 1;
  border-right: 1px solid #e6e6e6;
  padding: 16px;
}

.day-selector {
  border-right: none;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
  text-align: center;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.day-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.year-item,
.month-item,
.day-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  user-select: none;
}

.year-item:hover,
.month-item:hover,
.day-item:hover {
  background-color: #f0f0f0;
}

.year-item.active,
.month-item.active,
.day-item.active {
  background-color: var(--el-color-primary);
  color: white;
}

.year-item.current,
.month-item.current,
.day-item.current {
  background-color: var(--el-menu-hover-bg-color);
  color: var(--el-color-primary);
  font-weight: 600;
}

.year-item.active.current,
.month-item.active.current,
.day-item.active.current {
  background-color: var(--el-color-primary);
  color: white;
}

/* 有数据的日期深灰色背景 */
.day-item.has-data {
  /*background-color: #6c757d;*/
  /*color: white;*/
  position: relative;
}
.day-item.has-data::after {
  position: absolute;
  left: calc(50% - 2px);
  bottom: 2px;
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--el-color-primary);
}
.active.day-item.has-data::after,.day-item.has-data.in-range.range-start::after,.day-item.has-data.in-range.range-end::after{
  background-color: white;
}

.day-item.has-data:hover {
  /*background-color: #5a6268;*/
}

/* 拖拽范围样式 */
.day-item.in-range {
  background-color: var(--el-color-primary-dark-2);
  color: var(--el-color-primary);
}

.day-item.range-start,
.day-item.range-end {
  background-color: var(--el-color-primary);
  color: white;
}

/* 优先级：有数据的日期在拖拽范围内时保持深灰色 */
.day-item.has-data.in-range {
  /*background-color: #6c757d;*/
  /*color: white;*/
}

.day-item.has-data.range-start,
.day-item.has-data.range-end {
  /*background-color: var(--el-color-primary);*/
  /*color: white;*/
}

.debug-info {
  padding: 16px;
  background-color: #f8f9fa;
  border-top: 1px solid #e6e6e6;
  font-size: 12px;
  color: #666;
}

.debug-info div {
  margin-bottom: 4px;
}

.debug-info div:last-child {
  margin-bottom: 0;
}
</style>
