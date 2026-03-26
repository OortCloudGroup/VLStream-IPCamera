<template>
  <div class="header_container flexRowAC">
    <div class="collapse-btn flexRowAC" @click="collapseChage">
      <img v-if="!collapse" class="collapseImg" src="@/assets/img/message/collapse.png" alt="" />
      <img v-else class="collapseImg" src="@/assets/img/message/expand.png" alt="" />
    </div>
    <common-page-header-right-info />
  </div>
</template>

<script lang='ts' setup>
import CommonPageHeaderRightInfo from './commonPageHeaderRightInfo.vue'
import { computed } from 'vue'
import { useCounter } from '@/store/counter'

const storeC = useCounter()
const collapse = computed(() => storeC.collapse)
// 侧边栏折叠
const collapseChage = () => {
  storeC.collapse = !collapse.value
}

</script>
<style lang='scss' scoped>

.header_container {
  flex: 1;
  height: 64px;
  min-height: 64px;
  justify-content: space-between;
}
.collapse-btn{
  cursor: pointer;
}

.collapseImg {
  width: 20px;
  height: 20px;
  background-size: cover;
}
</style>
