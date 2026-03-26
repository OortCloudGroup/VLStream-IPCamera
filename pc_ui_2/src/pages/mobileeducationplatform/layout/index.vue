<template>
  <div class="page-container mobileEduPage flexRowAC">
    <div v-if="isInitConfig" class="content_box" :class="{ 'content_collapse': collapse }">
      <page-header :coll="headerSid" :config="uiConfig.mobileeducationplatform" @handle="headerClick" />
      <div v-if="finish" class="content" :class="{pl20:!headerSid}">
        <div class="mobileEduBox flexRowAC" @click="mobileEduStartTalk">
          <div class="startBtn flexRowAC">
            开始谈话
          </div>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import uiConfig from '@/config/UIConfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useCounter } from '@/store/counter'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import PageHeader from './components/pageHeader.vue'
import { getUserInfo } from '@/api/login'
import { getToken, removeToken } from '@/utils/cache/cookies'

const finish = ref(false)
const headerSid = ref(true)
const store: any = useUserStore()
const router = useRouter()
const storeC: any = useCounter()
const collapse = computed(() => storeC.collapse)
// let accessToken = getToken()

const initGetToken = () => {
  let accessToken = getToken()
  if (accessToken) {
    store.versionToken().then(() => {
      finish.value = true
      const data = {
        accessToken: accessToken,
        oort_uuid: store.userInfo.oort_uuid
      }
      getUserInfo(data).then((res: any) => {
        store.userInfo = { ...store.userInfo, ...res.data.userInfo }
        finish.value = true
      })
    }).catch((err: any) => {
      removeToken()
      ElMessage.error(err.msg)
      router.push('/')
    })
  } else {
    ElMessageBox.alert('登录信息失效，请重新登录', '提示', {
      confirmButtonText: '确定',
      callback: () => {
        removeToken()
        router.push('/')
      }
    })
  }
}

import initConfig from '@/utils/initConfig'
import bus from '@/utils/bus'

const isInitConfig = ref(false)
initConfig().then(() => {
  isInitConfig.value = true
  initGetToken()
})

// 配置
headerSid.value = router.currentRoute.value.path === '/system'
const headerClick = (val) => {
  headerSid.value = val
}

// 调用-开始谈话
const mobileEduStartTalk = () => {
  setTimeout(() => {
    bus.$emit('handleStartTalk')
  }, 300)
  router.push('/shouldTalk')
}

</script>
<style lang="scss">
.page-container {
  gap: 20px;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  background-color: #F0F2F5;
  color: #000;
}

.content_box {
  width: calc(100% - 270px);
  width: 100%;
  height: 100%;

  .content {
    padding-right: 20px;
    height: calc(100% - 64px);
    overflow: auto;
  }
}

.content_collapse {
  width: 100%;
}

.content.pl20 {
  //padding-left: 20px;
}

.mobileEduPage {
  // 菜单高度
  .el-menu.el-menu--vertical.sidebar-el-menu.subMenuLeft {
    padding-top: 88px;
  }

  .content {
    position: relative;
  }

  // 菜单顶贴按钮
  .mobileEduBox {
    background-color: var(--common-bg-color);
    background-color: #F0F2F5;
    width: 260px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    justify-content: center;

    .startBtn {
      cursor: pointer;
      margin-top: 20px;
      justify-content: center;
      width: 210px;
      color: #fff;
      background-color: var(--el-color-primary);
      border-radius: 4px;
      height: 48px;
    }
  }
}
</style>
