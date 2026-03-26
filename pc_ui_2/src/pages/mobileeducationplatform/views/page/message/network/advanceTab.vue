<template>
  <div class="systemBasic">
    <el-form v-if="props.tab==='mac1'" ref="sbForm" class="sbForm" label-position="top" :model="form">
      <el-form-item label="SNMP v1/v2">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="读共同体名称">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="写共同体名称">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="Trap地址">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="Trap端口">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="Trap团体名">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <div>SNMP v3</div>
      <el-form-item>
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="读安全名称">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="安全级别">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="认证算法">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="认证密码">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="私钥算法">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="私钥密码">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="写安全名称">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="安全级别">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="认证算法">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="认证密码">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="私钥算法">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="私钥密码">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <div class="set_secu flexRowAC">
        SNMP 其他配置
      </div>
      <el-form-item label="SNMP端口">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='mac2'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用DDNS
        </el-checkbox>
      </el-form-item>
      <el-form-item label="服务器地址">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="端口">
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
      <el-form-item label="结构目录">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="图片归档间隔（天）">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="图片名">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form v-if="props.tab==='mac3'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用PPPoE
        </el-checkbox>
      </el-form-item>
      <el-form-item label="发件人名称">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="发件人地址">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="SMTP服务器">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="SMTP端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="邮件加密">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="SMTP端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="抓取时间间隔（秒）">
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
      <el-form-item label="本地SIP端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="传输协议">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="白名单">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="服务端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="服务增强型端口">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <!--HTTPS-->
    <el-form v-if="props.tab==='mac5'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          自动跳转HTTPS
        </el-checkbox>
      </el-form-item>
      <div>证书详情</div>
      <el-form-item label="已安装证书">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="属性">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <!--QoS-->
    <el-form v-if="props.tab==='mac6'" class="sbForm" label-position="top" :model="form">
      <el-form-item label="音/视频DSCP">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="报警DSCP">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="管理DSCP">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <!--802.1X-->
    <el-form v-if="props.tab==='mac7'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用IEE 802.1X
        </el-checkbox>
      </el-form-item>
      <el-form-item label="协议类型">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="EAPOL版本">
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
    <!--集成协议-->
    <el-form v-if="props.tab==='mac8'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用ONVIF
        </el-checkbox>
      </el-form-item>
      <el-form-item label="ONVIF版本号">
        <el-input v-model="form.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <!--网络服务-->
    <el-form v-if="props.tab==='mac9'" class="sbForm" label-position="top" :model="form">
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用SDK服务
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用增强型SDK服务
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用TLS1.1版本
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.enable">
          启用TLS1.2版本
        </el-checkbox>
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
