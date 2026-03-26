<template>
  <div class="meeting_sign">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="序号" :width="clacPXToVW(65)">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pagesize + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="签到人" :width="clacPXToVW(200)" />
      <el-table-column label="签名">
        <template #default="scope">
          <img v-if="scope.row.url" class="oortImg" :src="scope.row.url" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="sign_time" label="签到时间">
        <template #default="scope">
          <div class="sign_item_time">
            <div>{{ scope.row.sign_time }}</div>
            <div v-if="scope.row.location" class="s1 flexRowAC">
              <img class="img_sign" src="@/assets/img/location.png" />
              {{ scope.row.location }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { clacPXToVW } from '@/utils/index'
import { conferencesignList } from '@/api/meetingMana'
import { useUserStore } from '@/store/modules/user'

const tableData = ref([])
const count = ref(0)
const page = ref(1)
const pagesize = ref(10)
const props = defineProps(['id'])
const store: any = useUserStore()

const getListFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    page: page.value,
    pagesize: pagesize.value,
    conference_uid: props.id
  }
  let res: any = await conferencesignList(data)
  if (res.code === 200) {
    tableData.value = res.data.list || []
    count.value = res.data.count
  }
}

watch(() => props.id, () => {
  getListFn()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.meeting_sign {
  //padding: 0 20px;
}

.oortImg {
  width: 80px;
  height: 40px;
  padding-top: 4px;
}

.sign_item_time {
  padding-left: 20px;
  flex-direction: column;
  align-items: flex-start;

  .s1 {
    color: #999;
    font-size: 12px;
  }

  .img_sign {
    width: 18px;
    height: 20px;
    margin-right: 8px;
  }
}
</style>
