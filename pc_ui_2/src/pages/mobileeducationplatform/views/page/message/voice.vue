<template>
  <div class="page">
    <div class="tipOut">
      <div class="tip flexRowAC">
        <van-icon name="info" />
        {{ policeName }}警官您尚未完成声纹注册，系统在教育谈话实时转录文字时无法识别区分您与谈话对象的内容，请按引导完成语音识别注册。
      </div>
    </div>
    <div class="tipOut">
      <el-button type="primary">
        开始声纹识别
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'

const store = useUserStore()
let policeName = ref<any>('')

policeName.value = store.userInfo?.oort_name

</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;

  .tipOut {
    padding: 40px;
  }
}

.tip {
  align-items: flex-start;
  padding: 16px 12px;
  border-radius: 8px;
  background: #F978321E;
  border: 1px solid #F97832;
  color: #F97832;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0px;
  text-align: left;

  .van-icon {
    font-size: 18px;
    margin-right: 4px;
  }
}
</style>
