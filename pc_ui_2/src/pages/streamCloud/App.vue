<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import useAppConfig from '@/hooks/useAppConfig'
import { useTheme } from '@/hooks/useTheme'

const { initHeader } = useAppConfig('streamCloud')
initHeader()
function theme_Fn() {
  document.documentElement.setAttribute('theme', 'streamCloud')
}
theme_Fn()

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()
</script>
<style>
.flexRowAC{
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
