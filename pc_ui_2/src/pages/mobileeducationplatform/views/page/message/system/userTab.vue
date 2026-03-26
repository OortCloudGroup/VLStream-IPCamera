<template>
  <div class="userPage">
    <div v-if="props.tab==='u1'">
      <div class="useBtnBox flexRowAC">
        <div class="userBtn flexRowAC" @click="messVisi=true">
          <img class="BtnImg" src="@/assets/img/message/new.png" alt="" />新增
        </div>
        <div class="userBtn edit flexRowAC">
          <div class="ue flexRowAC">
            <img class="BtnImg" src="@/assets/img/camera/btn/edit.png" alt="" />编辑
          </div>
          <div class="ue flexRowAC">
            <img class="BtnImg" src="@/assets/img/camera/btn/usually.png" alt="" />通用参数
          </div>
          <div class="ue flexRowAC">
            <img class="BtnImg" src="@/assets/img/camera/btn/set.png" alt="" />账号安全设置
          </div>
        </div>
        <div class="userBtn BtnD flexRowAC">
          <img class="BtnImg" src="@/assets/img/message/delete.png" alt="" />删除
        </div>
      </div>
      <el-table :show-overflow-tooltip="true" header-cell-class-name="header_cell" stripe :data="tableData">
        <el-table-column prop="name" label="序号" />
        <el-table-column prop="name1" label="用户名" />
        <el-table-column prop="name2" label="用户类型" />
      </el-table>
    </div>
    <div v-if="props.tab==='u2'">
      <div class="useBtnBox flexRowAC">
        <div class="userBtn re flexRowAC">
          <el-icon><Refresh /></el-icon>刷新
        </div>
      </div>
      <el-table :show-overflow-tooltip="true" header-cell-class-name="header_cell" stripe :data="tableData">
        <el-table-column prop="name" label="序号" />
        <el-table-column prop="name1" label="用户名" />
        <el-table-column prop="name2" label="用户类型" />
        <el-table-column prop="name2" label="IP地址" />
        <el-table-column prop="name2" label="用户操作时间" />
      </el-table>
    </div>
    <el-dialog
      v-model="messVisi"
      title="账号安全设置"
      width="40%"
      :close-on-click-modal="false"
    >
      <user-tab-new @close="messVisi=false" @handle="applistFn" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import UserTabNew from '@/pages/cameraMana/views/page/message/system/userTab/userTabNew.vue'

const props = defineProps(['tab'])
let tableData = ref<any>()
const messVisi = ref<boolean>(false)// 发送dialog

// 渠道列表
const applistFn = async() => {
}
</script>
<style lang="scss" scoped>
.userPage {
  padding-left: 20px;
  width: 880px;

  .sbForm {
    .el-input {
      height: 40px;
    }
  }

  .softBox {
    width: 100%;
    gap: 12px;
  }
}

.useBtnBox {
  gap: 16px;
  padding-bottom: 20px;
  padding-top: 4px;

  .userBtn {
    justify-content: center;
    gap: 8px;
    width: 82px;
    height: 36px;
    background: #1A53FF;
    color: #fff;
    border: 1px solid rgba(26, 83, 255, 1);
    border-radius: 18px;
  }

  .userBtn.BtnD {
    color: #F62E2E;
    background: #FFFFFF;
    border: 1px solid rgba(255, 183, 183, 1);
  }

  .userBtn.edit{
    padding: 16px;
    gap: 32px;
    color: #333;
    width: auto;
    background: #FFFFFF;
    border: 1px solid #999;

    .ue {
      gap: 8px;
    }
  }

  .userBtn.re {
    border: 1px solid #999;
    color: #333;
    background: #FFFFFF;
  }
}

</style>
