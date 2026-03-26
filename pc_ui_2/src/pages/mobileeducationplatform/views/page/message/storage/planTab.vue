<template>
  <div class="systemBasic">
    <div v-if="props.tab==='mac1'">
      <div>
        <el-checkbox v-model="form.enable">
          启用
        </el-checkbox>
      </div>
      <div style="padding-bottom: 20px;">
        <el-input v-model="form.desc" placeholder="请输入" />
      </div>
      <div class="useBtnBox flexRowAC">
        <div class="userBtn edit flexRowAC">
          <div class="ue flexRowAC" @click="messVisi=true">
            <img class="BtnImg" src="@/assets/img/camera/btn/usually.png" alt="" />高级参数
          </div>
        </div>
        <div class="userBtn BtnD flexRowAC">
          <img class="BtnImg" src="@/assets/img/message/delete.png" alt="" />删除
        </div>
        <div class="userBtn BtnD flexRowAC">
          <img class="BtnImg" src="@/assets/img/message/delete.png" alt="" />删除全部
        </div>
      </div>
    </div>
    <div v-if="props.tab==='mac2'">
      <el-tabs v-model="activeName" class="tenanat-tabs" @tab-click="handleClick">
        <el-tab-pane label="抓图计划" name="p1" />
        <el-tab-pane label="抓图参数" name="p2" />
      </el-tabs>
      <div v-if="activeName==='p1'">
        <div class="useBtnBox flexRowAC">
          <div class="userBtn edit flexRowAC">
            <div class="ue flexRowAC">
              <img class="BtnImg" src="@/assets/img/camera/btn/usually.png" alt="" />高级参数
            </div>
          </div>
          <div class="userBtn BtnD flexRowAC">
            <img class="BtnImg" src="@/assets/img/message/delete.png" alt="" />删除
          </div>
          <div class="userBtn BtnD flexRowAC">
            <img class="BtnImg" src="@/assets/img/message/delete.png" alt="" />删除全部
          </div>
        </div>
      </div>
      <el-form v-if="activeName==='p2'" class="sbForm" label-position="top" :model="form">
        <div class="set_secu flexRowAC">
          定时
        </div>
        <el-form-item>
          <el-checkbox v-model="form.enable">
            启用定时抓图
          </el-checkbox>
        </el-form-item>
        <el-form-item label="图片格式">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="分辨率">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="图片质量">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="抓图时间间隔">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <div class="set_secu flexRowAC">
          事件触发
        </div>
        <el-form-item>
          <el-checkbox v-model="form.enable">
            启用事件抓图
          </el-checkbox>
        </el-form-item>
        <el-form-item label="图片格式">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="分辨率">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="图片质量">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="抓图时间间隔">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="图片数量">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      v-model="messVisi"
      title="高级参数"
      width="40%"
      :close-on-click-modal="false"
    >
      <plan-tab-new @close="messVisi=false" @handle="applistFn" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { TabsPaneContext } from 'element-plus'
import PlanTabNew from '@/pages/cameraMana/views/page/message/storage/planTabNew.vue'

const props = defineProps(['tab'])
const activeName = ref('p1')
const messVisi = ref<boolean>(false)// 发送dialog
const form = reactive({
  name: '',
  enable: '',
  time: 1,
  desc: []
})

// tabsClick
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const applistFn = () => {
}
</script>
<style lang="scss" scoped>
.systemBasic {
  padding-left: 20px;
  width: 880px;

  .sbForm {
    .el-input {
      height: 40px;
    }
  }
}

.set_secu {
  gap: 8px;
  padding-bottom: 20px;
  font-size: 16px;
  color: #1A53FF;
  font-weight: 400;
}

// 按钮
.useBtnBox {
  gap: 16px;
  padding-bottom: 20px;
  padding-top: 4px;

  .userBtn {
    justify-content: center;
    gap: 8px;
    padding: 0 16px;
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
