<template>
  <div class="right_info">
    <span class="right_info_tips">欢迎您</span>
    <img class="right_info_img" src="@/assets/img/login/icon_user.png" />
    <div class="right_name_div">
      <span class="right_info_tips">{{ userInfo?.name || '未登录' }}</span>
    </div>
    <el-icon size="16px" color="white">
      <CaretBottom />
    </el-icon>
    <div class="info_panel">
      <div class="info_panel_item">
        <div class="info_btn" @click="logoutClick">
          <span>退出登录</span>
        </div>
      </div>
      <div class="dept_panel">
        <span>{{ userInfo?.name || '' }}</span>
        <span>账号：{{ userInfo?.user }}</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useUserStoreW } from '@/store/modules/userWare'
import { useRouter } from 'vue-router'
import { CaretBottom } from '@element-plus/icons-vue'

const store = useUserStoreW()
const router = useRouter()
const userInfo = computed(() => {
  return store.userInfo
})

// 退出登录
const logoutClick = () => {
  store.loginOut(store.token).then(() => {
    router.push('/login')
  })
}
</script>

<style lang="scss" scoped>

.right_name_div {
  /*width: 220px;*/
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
}

.info_panel::after {
  content: "";
  position: absolute;
  top: -24px;
  right: 16px;
  width: 0;
  border-width: 12px;
  border-style: solid;
  border-color: transparent transparent #fff transparent; /* transparent 设置边框颜色透明 */
}

.right_info {
  position: relative;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  min-width: 180px;

  &_tips {
    margin: 0 8px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.65);
    min-width: 48px;
  }

  &_img {
    margin: 0 16px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}

.caret_icon {
  cursor: pointer;
}

.right_info:hover {
  .info_panel {
    display: flex;
  }
}

.info_panel:hover {
  display: flex;
}

.info_panel {
  z-index: 999999;
  position: absolute;
  top: 60px;
  right: -13px;
  padding: 10px;
  width: 180px;
  min-height: 110px;
  display: none; // 默认隐藏，鼠标移动到这里在显示处理
  flex-direction: column;
  background: #FFFFFF;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
  border-radius: 2px;
}

.info_panel_item {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: 0.5px solid #d2d2d2;
}

.info_btn:hover {
  font-weight: bold;
}

.info_btn {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48%;
  height: 32px;

  span {
    padding: 4px;
    font-size: 14px;
    color: $main-color;
  }
}

.dept_panel {
  width: 100%;
  min-height: 32px;

  span {
    margin-left: 8px;
    font-size: 12px;
    color: #333333;
  }
}

</style>
