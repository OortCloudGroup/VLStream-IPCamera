<template>
  <div class="meetrommPage">
    <div class="depNameBox flexRowAC">
      <div class="exportBtnBox flexRowAC">
        <el-button type="primary" class="exportBtn newBtn flexRowAC" @click="addRoom('')">
          <el-icon class="BtnImg">
            <Plus />
          </el-icon>
          新建
        </el-button>
      </div>
    </div>
    <div>
      <el-table
        class="new_table"
        :show-overflow-tooltip="true"
        stripe
        :data="tableData"
      >
        <el-table-column type="selection" :width="clacPXToVW(55)" />
        <el-table-column prop="date" label="序号" :width="clacPXToVW(65)">
          <template #default="scope">
            {{ scope.$index + (page - 1) * pagesize + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="会议室名称">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="会议室地址" />
        <el-table-column prop="capacity" label="容纳人数" />
        <el-table-column prop="equipment" label="设备列表" />
        <el-table-column label="会议室状态" :width="clacPXToVW(120)">
          <template #header>
            <div class="flexRowAC">
              <div>会议室状态</div>
              <el-tooltip content="禁用状态下的会议室不能被预约" placement="top">
                <el-icon size="24">
                  <InfoFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <template #default="scope">
            {{ scope.row.status === 1 ? '已启用' : '已禁用' }}
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              @click="messconfStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="door_number" label="会议室门牌编号" />
        <el-table-column prop="created_at" label="创建时间" :width="clacPXToVW(200)" />
        <el-table-column prop="operate" label="操作" fixed="right" align="right">
          <template #default="scope">
            <div class="operateBox flexRowAC">
              <el-tooltip
                content="编辑"
                effect="light"
                placement="top"
              >
                <div class="new_table_svg_group" @click="addRoom(scope.row)">
                  <oort-svg-icon width="20" height="20" name="table_edit" class="new_table_svg_group_svg" />
                </div>
              </el-tooltip>
              <el-tooltip
                content="删除"
                effect="light"
                placement="top"
              >
                <div class="new_table_svg_group" @click="delClick(scope.row)">
                  <oort-svg-icon width="20" height="20" name="table_del" />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox flexRowAC">
        <el-pagination
          background
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagesize"
          layout="total, prev, pager, next, sizes"
          :total="count"
          class="justifyAlign"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="dVisi"
      title="新建会议室"
      width="40%"
      :close-on-click-modal="false"
    >
      <built-meetroom v-if="dVisi" :item="itemObj" @close="dVisi=false" @handle="getListFn" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { clacPXToVW } from '@/utils/index'
import { conferenceroomDel, conferenceroomList, conferenceroomStatus } from '@/api/meetingMana'
import { useUserStore } from '@/store/modules/user'
import BuiltMeetroom from '@/pages/meetingMana/views/page/meetingMana/components/builtMeetroom.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const count = ref(0)
const page = ref(1)
const pagesize = ref(10)
const store: any = useUserStore()
let dVisi = ref(false)
let itemObj = ref(false) // 新建会议室

// 删除
const delClick = (val) => {
  ElMessageBox.confirm('是否确定删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    let data = {
      accessToken: store.userInfo.accessToken,
      room_uid: val.room_uid
    }
    let res: any = await conferenceroomDel(data)
    if (res.code === 200) {
      // 列表 刷新
      getListFn()
      ElMessage.success('会议室删除成功')
    } else {
      ElMessage.error(res.msg)
    }
  })
}

// 状态
const messconfStatus = (val) => {
  let data = {
    accessToken: store.userInfo.accessToken,
    room_uid: val.room_uid,
    status: val.status
  }
  conferenceroomStatus(data).then((res: any) => {
    if (res.code === 200) {
      if (val.status === 1) ElMessage.success('会议室启用成功')
      if (val.status === 2) ElMessage.success('会议室禁用成功')
    } else {
      ElMessage.error(res.msg)
    }
    // 刷新 获取
    getListFn()
  })
}

// 添加会议室
const addRoom = (val) => {
  dVisi.value = true
  itemObj.value = val || ''
}

const getListFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    page: page.value,
    pagesize: pagesize.value
  }
  let res: any = await conferenceroomList(data)
  if (res.code === 200) {
    tableData.value = res.data.list || []
    count.value = res.data.count
  }
}
let handleSizeChange = (val: number) => {
  pagesize.value = val
  getListFn()
}
let handleCurrentChange = (val: number) => {
  page.value = val
  getListFn()
}
onMounted(() => {
  getListFn()
})
</script>

<style lang="scss" scoped>
.meetrommPage {
  padding: 20px;
}

.exportBtnBox {
  padding-bottom: 20px;
}

// 分页
.paginationBox {
  justify-content: center;
  height: 100px;
}

.operateBox {
  justify-content: flex-end;
  gap: 2px;

  .appBtn {
    line-height: 22px;
    cursor: pointer;
    padding: 6px 12px;
    border: 0.5px solid rgba(220, 223, 230, 1);
    border-radius: 2px;
  }
}
</style>
