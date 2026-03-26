<template>
  <div class="new_meeting">
    <div class="new_meeting_header">
      <el-page-header icon="ArrowLeft" @back="backFn">
        <template #content>
          <span class="text-large font-600 mr-3"> 新建会议 </span>
        </template>
      </el-page-header>
    </div>
    <new-meeting :item="''" @close="backFn" @handle="backFn" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import NewMeeting from '@/pages/meetingMana/views/page/meetingMana/newMeeting.vue'

const router = useRouter()

const backFn = () => {
  router.push('/allMeeting')
}

</script>

<style lang="scss" scoped>
.new_meeting_header {
  height: 47px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-page-header__title){
  font-size: 18px;
}

</style>
