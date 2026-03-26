<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2024-11-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <commonsub-menu>
    <template v-if="isShow" #subOut>
      <div class="routeMenuBox flexRowAC">
        <router-link class="subOutTitle flexRowAC" to="/question">
          <el-icon>
            <Plus />
          </el-icon>
          问卷调查
        </router-link>
      </div>
    </template>
  </commonsub-menu>
</template>

<script lang="ts" setup>
import CommonsubMenu from '@/components/commonsubMenu.vue'
import { useCounter } from '@/store/counter'
import { computed } from 'vue'

const storeC = useCounter()
const isShow = computed(() => !storeC.collapse)

</script>
<style lang="scss" scoped>
.routeMenuBox {
  justify-content: center;
  padding: 20px;
  width: 100%;

  .subOutTitle {
    justify-content: center;
    opacity: 1;
    border-radius: 8px;
    background: var(--el-color-primary);
    color: #fff;
    width: 100%;
    height: 48px;
    gap: 8px;
  }
}

</style>
