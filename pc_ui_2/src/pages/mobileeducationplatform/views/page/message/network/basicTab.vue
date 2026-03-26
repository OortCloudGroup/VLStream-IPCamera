<template>
  <div class="systemBasic">
    <el-form v-if="props.tab==='mac1'" ref="sbForm" class="sbForm" label-position="top" :model="form">
      <el-form-item label="网卡类型">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="IP地址">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="IPv4子网掩码">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="设备IPv4地址">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="IPv4默认网关">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="IPv6模式">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="IPv6子网掩码">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="物理地址">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="MTU">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <div class="set_secu flexRowAC">
        DNS服务器配置
      </div>
      <el-form-item label="首选DNS服务器">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="首选DNS服务器">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='mac2'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用DDNS
        </el-checkbox>
      </el-form-item>
      <el-form-item label="DDNS类型">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="服务器地址">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="域名">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="密码确认">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='mac3'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用PPPoE
        </el-checkbox>
      </el-form-item>
      <el-form-item label="设备动态IP">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="密码确认">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='mac4'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="HTTP端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="RTSP端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="HTTPS端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="服务端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="服务增强型端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='mac5'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用UPnP
        </el-checkbox>
      </el-form-item>
      <el-form-item label="别名">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="端口映射方式">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='mac6'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="IP地址">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="码流类型">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="视频端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="音频端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps(['tab'])
const form = reactive({
  name: '',
  enable: '',
  time: 1,
  desc: []
})
console.log(props.tab)
</script>
<style lang="scss" scoped>
.systemBasic {
  padding-left: 20px;
  width: 480px;

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
</style>
