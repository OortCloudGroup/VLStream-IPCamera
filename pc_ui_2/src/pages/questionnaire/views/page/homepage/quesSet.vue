<template>
  <div class="homePage">
    <el-button type="primary" @click="save">
      保存
    </el-button>
    <div class="setQeT pad">
      人员限制
    </div>
    <div class="setQe line flexRowAC">
      <div class="setQe_l">
        谁可以回答
      </div>
      <div class="setQe_R flexRowAC">
        自选人员
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
    </div>
    <div class="setQe line flexRowAC">
      <div class="setQe_l">
        答题人员
      </div>
      <div class="setQe_R flexRowAC">
        自选人员
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
    </div>
    <div class="setQe flexRowAC">
      <div class="setQe_l">
        记录用户昵称
      </div>
      <div class="setQe_R flexRowAC">
        <el-switch v-model="value" />
      </div>
    </div>
    <div class="setQeT">
      频次限制
    </div>
    <div class="setQe flexC flexRowAC">
      <div class="setQe_l">
        每部手机只能答一次
      </div>
      <div class="setCondOut">
        <div class="setCond">
          <el-checkbox v-model="checked1" size="large">
            每个账号限制
          </el-checkbox>
          <div class="flexRowAC setCondInput">
            <el-select v-model="checkedO">
              <el-option label="只能" :value="1" />
            </el-select>
            只能
            <el-input v-model="checkedInput" type="number" />
            次
          </div>
        </div>
        <div class="setCond">
          <el-checkbox v-model="checked1" size="large">
            每台设备限制
          </el-checkbox>

          <div class="flexRowAC setCondInput">
            <el-select v-model="checkedO">
              <el-option label="每天" :value="1" />
            </el-select>
            只能
            <el-input v-model="checkedInput" type="number" />
            次
          </div>
        </div>
        <div class="setCond">
          <el-checkbox v-model="checked1" size="large">
            每个IP限制
          </el-checkbox>
          <div class="flexRowAC setCondInput">
            <el-select v-model="checkedO">
              <el-option label="每周" :value="1" />
            </el-select>
            只能
            <el-input v-model="checkedInput" type="number" />
            次
          </div>
        </div>
      </div>
    </div>
    <div class="setQeT">
      答后设置
    </div>
    <div class="setQe flexRowAC">
      <div class="setQe_l">
        允许修改已填内容
      </div>
      <div class="setQe_R flexRowAC">
        <el-switch v-model="value1" />
      </div>
    </div>
    <div class="setQeT">
      时间设置
    </div>
    <div class="setQe line flexRowAC">
      <div class="setQe_l">
        开始时间
      </div>
      <div class="setQe_R flexRowAC">
        <el-date-picker
          v-model="value2"
          type="datetime"
          placeholder="未设置"
        />
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
    </div>
    <div class="setQe pb flexRowAC">
      <div class="setQe_l">
        结束时间
      </div>
      <div class="setQe_R flexRowAC">
        <el-date-picker
          v-model="value3"
          type="datetime"
          placeholder="未设置"
        />
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const emits: any = defineEmits(['handle', 'close'])
let value = ref(true)
let value1 = ref(true)
let value2 = ref('')
let value3 = ref('')
const checked1 = ref(true)
const checkedO = ref(1)
const checkedInput = ref('')

const save = () => {
  emits('close')
  emits('handle')
}
</script>
<style lang="scss" scoped>
.setQeT {
  color: #718096;
  font-size: 14px;
  padding: 20px 0 0;

  &.pad {
    padding-top: 20px;
  }
}

.setQe {
  height: 48px;
  justify-content: space-between;

  &.line {
    border-bottom: 1px solid #D8D8D8;
  }

  .setQe_l {
    color: #1A1A1A;
    font-size: 14px;
  }

  .setQe_R {
    cursor: pointer;
    gap: 8px;
    color: #333333;
    font-size: 14px;
  }
}

.setQe.flexC {
  padding: 10px 0  16px;
  height: initial;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  .setCondOut {
    background-color: #f7f7f7;
    padding: 0 16px 16px;
  }

  :deep(.setCond) {
    width: 100%;

    .setCondInput {
      gap: 8px;
      font-size: 14px;
      color: #333;
    }

    .el-select {
      width: 80px;
    }

    .el-input, .el-input__wrapper, .el-input__inner {
      width: 100px;
    }
  }
}

:deep(.setQe_R) {
  .el-input__wrapper {
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  }

  .el-input__prefix {
    display: none;
  }

  .el-input__inner {
    text-align: right;
  }
}
</style>
