<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2024-11-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <div v-if="isInitConfig" class="page-container flexRowAC">
    <div class="content_box" :class="{ 'content_collapse': collapse }">
      <page-header :config="uiConfig.address_book" />
      <div v-if="finish" class="layout_content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import uiConfig from '@/config/UIConfig'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useCounter } from '@/store/counter'
import { ref, computed } from 'vue'
import PageHeader from './components/pageHeader.vue'
import { getUserInfo } from '@/api/login/index'
import useGoWhere from '@/hooks/useGoWhere'

const finish = ref(false)
const store: any = useUserStore()
const storeC: any = useCounter()
const collapse = computed(() => storeC.collapse)
const removeToken = store.removeStoreToken
const getToken = store.getStoreToken

const initGetToken = () => {
  let accessToken = getToken()
  if (accessToken) {
    store.versionToken().then(() => {
      finish.value = true
      const data = {
        accessToken: store.token
      }
      getUserInfo(data).then((res: any) => {
        store.userInfo = { ...store.userInfo, ...res.data }
        finish.value = true
      })
    }).catch((err: any) => {
      removeToken()
      ElMessageBox.alert(err.msg + '! 登录信息失效，请重新登录', '提示', {
        confirmButtonText: '确定',
        callback: () => {
          removeToken()
          useGoWhere().goWhere()
        }
      })
    })
  } else {
    removeToken()
    useGoWhere().goWhere()
  }
}

import initConfig from '@/utils/initConfig'
const isInitConfig = ref(false)
initConfig().then(() => {
  isInitConfig.value = true
  initGetToken()
})

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
  width: 100%;
  height: 100%;
  .layout_content {
    width: 100%;
    height: calc(100% - 64px);
    overflow: auto;
  }
}

.content_collapse {
  width: 100%;
}
</style>
