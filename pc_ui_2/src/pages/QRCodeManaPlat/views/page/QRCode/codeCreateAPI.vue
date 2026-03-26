<template>
  <div class="c_content tabCont flexRowAC">
    <div class="tabContR">
      <div class="examT flexRowAC" @click="apiHelpClick()">
        <el-icon><QuestionFilled /></el-icon>API生成帮助
      </div>
      <div v-if="!help">
        <div class="ex_title">
          HTTP Header
        </div>
        <div class="ex_H flexRowAC">
          <div class="ex_HT">
            <span class="red">*</span>Content-Type：
          </div>
          <el-input v-model="application" placeholder="必填" />
        </div>
        <div class="ex_title">
          URL参数
        </div>
        <div class="ex_UT">
          imgBase64
        </div>
        <div class="ex_UT_in">
          <el-input v-model="imgBase64" placeholder="选填" />
        </div>
        <div class="ex_UT">
          imgUrl
        </div>
        <div class="ex_UT_in">
          <el-input v-model="input" placeholder="选填" />
        </div>
        <div class="exbtnBox">
          <el-button type="primary" @click="initiateCall">
            发起调用
          </el-button>
        </div>
      </div>
      <!--API生成帮助-->
      <div v-if="help" class="helpBox">
        <el-icon class="helpIcon" @click="help=false">
          <CircleCloseFilled />
        </el-icon>
        <div class="help_title">
          一、对接流程
        </div>
        <div class="help_api1 flexRowAC">
          <img class="help_apiImg" src="@/assets/img/QRCodeManaPlat/api1.png" alt="" />
        </div>
        <div class="help_title">
          一、对接流程
        </div>
        <div class="help_api1 flexRowAC">
          <img class="help_apiImg2" src="@/assets/img/QRCodeManaPlat/api2.png" alt="" />
        </div>
      </div>
    </div>
    <div v-if="!help" class="tabContL" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

let help = ref<any>(true)
let application = ref<any>('')
let imgBase64 = ref<any>('')
let input = ref<any>('')
const initiateCall = () => {

}
const apiHelpClick = () => {
  help.value = true
}
</script>
<style lang="scss" scoped>
.tabCont {
  align-items: flex-start;
  gap: 20px;
}

.tabContR {
  flex: 1;

  .examT {
    cursor: pointer;
    padding-bottom: 30px;
    font-size: 14px;
    color: var(--el-color-primary);
    gap: 8px;
    .el-icon{
      font-size: 16px;
    }
  }

  .ex_title {
    padding-bottom: 20px;
    font-size: 16px;
    color: #333333;
    font-weight: 400;
  }

  .ex_H {
    padding-bottom: 20px;
    font-size: 14px;
  }

  .ex_HT {
    width: 240px;
  }

  .ex_UT {
    padding-bottom: 12px;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 400;
  }

  .ex_UT_in {
    padding-bottom: 20px;
  }

  .exbtnBox {
    padding-top: 40px;
  }
}

.tabContL {
  align-items: flex-start;
  justify-content: center;
  width: 1000px;
  height: 450px;
  padding: 20px;
  flex-shrink: 0;
  background: #FBFBFF;
  position: relative;

  .tabContLImg {
    width: 100%;
    height: calc(100% - 80px);
  }
}

.red {
  color: red;
  padding-right: 4px;
}

.helpBox {
  padding: 40px;
  width: 1544px;
  height: 829px;
  background: #FAFAFA;
  position: relative;

  .helpIcon {
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 20px;
    color: #B5BBCB;
  }

  .help_title {
    padding-bottom: 20px;
    font-size: 18px;
    color: #000000;
    font-weight: 700;
  }

  .help_api1 {
    justify-content: center;
  }

  .help_apiImg {
    width: 1209px;
    height: 120px;
    margin-bottom: 40px;
  }

  .help_apiImg2 {
    width: 1359px;
    height: 490px;
  }
}
</style>
