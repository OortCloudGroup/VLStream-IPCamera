<template>
  <div v-if="isInitConfig" class="page_container">
    <common-login-header :config="uiConfig.doorCardMana" />
    <div class="login_bg">
      <!--      <div class="login_text" />-->
      <div class="login_text">
        <span class="logo_flag1">{{ uiConfig.doorCardMana.loginPageFlag1 }}</span>
        <div class="login_text_flag2">
          <span class="logo_flag2">{{
            uiConfig.doorCardMana.loginPageFlag2
          }}</span>
        </div>
      </div>
      <common-login-form :config="uiConfig.doorCardMana" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import uiConfig from '@/config/UIConfig.ts'
import CommonLoginHeader from '@/components/commonLoginHeader.vue'
import CommonLoginForm from '@/components/commonLoginForm.vue'
import initConfig from '@/utils/initConfig'

const isInitConfig = ref(false)
initConfig().then(() => {
  isInitConfig.value = true
})
</script>

<style lang="scss" scoped>
.page_container {
  background-color: var(--el-color-primary);
  background-image: url("@/assets/img/login/admin_bg.png");
  background-size: cover;
}

.login_bg {
  @extend .flexRow;
  @extend .flexCenter;
  width: 81%;
  height: calc(100vh - 68px - 20px);
}

.login_text {
  flex: 1;
  @extend .flexRow;
  @extend .flexCenter;
  flex-direction: column;

  .login_text_flag2 {
    width: 70%;
    margin-top: 8px;
    text-align: center;
  }
}

.logo_flag1 {
  font-size: 24px;
  color: var(--el-color-primary);
  margin-bottom: 8px
}

.logo_flag2 {
  font-size: 14px;
  color: var(--el-color-primary);
  margin-bottom: 8px
}

</style>
