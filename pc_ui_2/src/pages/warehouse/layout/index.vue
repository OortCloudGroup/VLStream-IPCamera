<template>
  <div class="page-container flexRowAC">
    <v-sidebar v-if="finish" />
    <div class="content_box" :class="{ 'content_collapse': collapse }">
      <common-page-header :config="uiConfig.payUi" />
      <div v-if="finish" class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import uiConfig from '@/config/UIConfig'
import VSidebar from './components/sidebar.vue'
import { ElMessage } from 'element-plus'
import { useUserStoreW } from '@/store/modules/userWare'
import { useCounter } from '@/store/counter'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import CommonPageHeader from './components/commonPageHeader.vue'
import { getToken, removeToken } from '@/utils/cache/cookies'

const finish = ref(false)
const store = useUserStoreW()
const router = useRouter()
const storeC = useCounter()
const collapse = computed(() => storeC.collapse)
let accessToken = getToken()
if (accessToken) {
  store.versionToken().then((res) => {
    if (res.code === 200) {
      finish.value = true
    } else {
      ElMessageBox.alert(res.msg + '，请重新登录', '提示', {
        confirmButtonText: '确定',
        callback: () => {
          removeToken()
          router.push('/')
        }
      })
    }
  }).catch((err) => {
    removeToken()
    ElMessage.error(err.msg)
    router.push('/')
  })
} else {
  removeToken()
  router.push('/')
}
</script>
<style lang='scss'>
.page-container {
  gap: 20px;
  align-items: flex-start;
  height: 100%;
  background-color: #F0F2F5;
  color: #000;
}

.content_box {
  flex: 1;
  height: 100%;

  .content {
    padding-right: 20px;
    padding-bottom: 20px;
    height: calc(100% - 64px);
    overflow: auto;
  }
}
</style>
