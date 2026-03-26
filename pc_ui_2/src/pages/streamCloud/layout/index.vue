<template>
  <div class="page-container flexRowAC">
    <div class="content_box">
      <common-page-header :config="uiConfig.streamCloud" />
      <div v-if="finish" class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import uiConfig from '@/config/UIConfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import CommonPageHeader from './components/commonPageHeader.vue'
import { getUserInfo } from '@/api/login'
import { getToken, removeToken } from '@/utils/cache/cookies'

const finish = ref(false)
const store: any = useUserStore()
const router = useRouter()
let accessToken = getToken()
if (accessToken) {
  store.versionToken().then(() => {
    finish.value = true
    const data = {
      accessToken: store.userInfo.accessToken,
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
</script>
<style lang='scss' scoped>
.page-container {
  gap: 20px;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  background-color: #06162F;;
  color: #000;
}

.content_box {
  width: 100%;
  height: 100%;

  .content {
    padding-right: 20px;
    //padding-bottom: 20px;
    height: calc(100% - 64px);
    overflow: auto;
  }
}

.content_collapse {
  width: 100%;
}
</style>
