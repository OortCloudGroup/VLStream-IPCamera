<template>
  <div class="d_page">
    <el-form ref="formRef" class="formBox" :model="form" :rules="rules">
      <el-form-item label="">
        <el-radio-group v-model="form.every" @change="form.every===''?form.cycle=false: form.cycle=true">
          <el-radio-button label="不重复" value="" />
          <el-radio-button label="每天" value="every" />
          <el-radio-button label="隔天" value="next" />
          <el-radio-button label="每周" value="week" />
          <el-radio-button label="每月" value="month" />
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.every!==''">
        <div class="time2SelBox flexRowAC">
          <el-form-item label="开始时间" prop="start_t">
            <el-date-picker
              v-model="form.start_t"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择时间"
            />
          </el-form-item>
          <el-form-item label="触发时间">
            <el-time-picker v-model="form.time" value-format="HH:mm:ss" placeholder="00:00:00" />
          </el-form-item>
          <el-form-item v-if="form.every==='next'" label="每隔">
            <el-input-number v-model="form.next" :min="1" :max="99" />
            天
          </el-form-item>
          <el-form-item v-if="form.every==='week'" label="触发日期">
            <el-checkbox-group v-model="form.week">
              <el-checkbox label="星期一" value="1" />
              <el-checkbox label="星期二" value="2" />
              <el-checkbox label="星期三" value="3" />
              <el-checkbox label="星期四" value="4" />
              <el-checkbox label="星期五" value="5" />
              <el-checkbox label="星期六" value="6" />
              <el-checkbox label="星期日" value="7" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="form.every==='week'" label="每隔">
            <el-input-number v-model="form.next" :min="0" :max="99" />
            周
          </el-form-item>
          <el-form-item v-if="form.every==='month'" label="触发日期">
            <el-checkbox-group v-model="form.month">
              <el-checkbox v-for="(item,i) in 31" :key="i" :value="''+item">
                {{ item > 9 ? '' + item : '0' + item }}
              </el-checkbox>
              <el-checkbox value="L">
                最后一天
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="结束时间" prop="end_t">
            <el-date-picker
              v-model="form.end_t"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择时间"
            />
          </el-form-item>
          <div class="tipBox flexRowAC">
            <el-icon>
              <WarningFilled />
            </el-icon>
            <span v-if="form.every==='every'">在开始时间点触发后，在一天内按设置的时间点触发任务，直到截至时间（截止时间无法一直执行）</span>
            <span v-if="form.every==='next'">在开始时间点触发后，在设置时间间隔天数后的当天内按设置的时间点触发任务，直到截止时间（截止时间无法一直执行）</span>
            <span v-if="form.every==='week'">在开始时间点触发后，在一周按设置的时间点触发任务，直到截止时间（截止时间无法一直执行）</span>
            <span v-if="form.every==='month'">在开始时间点后，在一月内按设置的时间点触发任务，直到截至时间</span>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!--    <div style="text-align: right;">-->
    <!--      <el-button @click="emits('close')">-->
    <!--        取消-->
    <!--      </el-button>-->
    <!--      <el-button type="primary" @click="save(formRef)">-->
    <!--        保存-->
    <!--      </el-button>-->
    <!--    </div>-->
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FormRules } from 'element-plus'

// const props: any = defineProps(['item'])
const formRef = ref('') // form Ref
const dataForm = ref<any>('') // form Ref
const form = reactive({
  priority: 'normal',
  cycle: false,
  every: '',
  time: '00:00:00', // 延时act 发送时间段
  week: ['1'],
  month: ['1'],
  interval: 1, // 间隔 隔天、每周 可传此参数
  next: 1,
  start_t: undefined,
  end_t: undefined
})
const rules = reactive<FormRules<any>>({
  time: [
    { required: true, message: '触发时间', trigger: 'blur' }
  ],
  start_t: [
    { required: true, message: '开始时间', trigger: 'blur' }
  ],
  end_t: [
    { required: true, message: '结束时间', trigger: 'blur' }
  ]
})

// 保存
const save = async() => {
  dataForm.value = ''
  let formEl:any = formRef.value
  if (!formEl) return
  return await formEl.validate((valid: boolean) => {
    if (valid) {
      let data: any = {
        every: form.every,
        cycle: true,
        end: form.end_t,
        start: form.start_t,
        types: 1,
        run: [form.time] // 循环定时触发时间: 示例：【每天: 传05:10】, 【隔天：传05:10】,【每周：传 1 (1代表星期一)】,【每月：传 10 （10 代表当月10号）】
      }
      if (form.every === 'next') {
        data.types = 2
        data.interval = form.next // 表示每次触发间隔周期， 隔天、每周 可传此参数
      }
      if (form.every === 'week') {
        data.types = 3
        data.run = form.week
        data.interval = form.next || 0 // 表示每次触发间隔周期， 隔天、每周 可传此参数
        data['trg_time'] = form.time // 每周月定时类型触发的时分秒时间
      }
      if (form.every === 'month') {
        data.types = 4
        data.run = form.month
        data['trg_time'] = form.time // 每周月定时类型触发的时分秒时间
      }
      dataForm.value = { ...data }
      return dataForm.value
    } else {
      return false
    }
  })
}

defineExpose({ save, dataForm })
</script>
<style lang="scss" scoped>
.d_page {

}

// form
:deep(.formBox ) {
  padding: 0 20px;

  .el-form-item__label {
    width: 100px;
    text-align: left;
  }

  .cy_every {
    width: 100%;
    padding-top: 12px;
  }

  .el-radio-group {
    .el-radio {
      &.is-checked {
        background-color: var(--el-color-primary);

        .el-radio__label {
          color: #fff;
        }
      }

      .el-radio__input {
        display: none;
      }

      .el-radio__label {
        //color: #fff;
      }

    }
  }
}

// 延时选择
.time2SelBox {
  width: 500px;
  border: 1px solid #DADADA;
  padding: 24px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  .lo_label {
    padding-left: 30px;
  }
}

.tipBox {
  align-items: flex-start;
  width: 100%;
  padding: 16px 12px;
  background: #EDF5FF;
  border: 1px solid rgba(205, 228, 255, 1);
  font-size: 12px;
  color: #666666;
  line-height: 18px;
  font-weight: 400;
  gap: 4px;

  .tip {
    color: #1F84F1;
  }

  > .el-icon {
    font-size: 16px;
    color: #1F84F1;
  }
}

</style>
