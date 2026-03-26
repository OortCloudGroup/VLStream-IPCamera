<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import useAppConfig from '@/hooks/useAppConfig'
const { initHeader } = useAppConfig('questionnaire')
initHeader()
</script>
<style>
.flexRowAC{
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
