<template>
  <div class="login-container">
    <div class="login_form">
      <div class="login_tips">
        <span>欢迎登录  <span style="font-size: 16px;color:#666666">{{ props['config'].login_title }}</span></span>
      </div>
      <div class="login_body">
        <el-form
          v-if="passwordLogin"
          ref="ruleFormRef"
          :model="loginForm"
          :rules="rules"
        >
          <el-form-item class="login_input_item" prop="username">
            <el-input v-model="loginForm.username" size="large" placeholder="请输入用户名">
              <template #prefix>
                <el-icon class="el-input__icon">
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="login_input_item" prop="password">
            <el-input
              v-model="loginForm.password"
              size="large"
              placeholder="请输入密码"
              :type="passwordType"
              @keyup.enter="submitForm(ruleFormRef)"
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <Key />
                </el-icon>
              </template>
              <template #suffix>
                <el-icon v-if="passwordType" @click="showPwd">
                  <Hide />
                </el-icon>
                <el-icon v-else @click="showPwd">
                  <View />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="loginForm.captchaID" class="login_input_item login_input_yzm">
            <el-input v-model="loginForm.code" style="width: 50%" size="large" placeholder="请输入验证码" />
            <img
              style="width: 50%"
              :src="codePngUrl + loginForm.captchaID + '.png?' + timeStamp"
              @click="timeStamp=new Date().getTime()"
            />
          </el-form-item>
          <el-form-item class="login_input_item">
            <el-button
              v-loading="loading"
              size="large"
              class="login_btn"
              type="primary"
              @click="submitForm(ruleFormRef)"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>
        <div v-else style="width: 100%;display: flex;justify-content: flex-start">
          <div v-if="showeiXinCode" class="qr_code_div">
            <div class="qr_code_div_img">
              <img :src="codeImg" alt="" />
              <div v-if="qrStatus > 3" class="qr_code_mask">
                <img src="@/assets/img/login/refresh.png" @click="getQRCodeGetKey" />
                <span v-if="qrStatus === 4">已取消登陆，点击刷新</span>
                <span v-if="qrStatus === 5">二维码已过期，点击刷新</span>
              </div>
            </div>
            <div class="qr_code_div_span">
              <span v-if="qrStatus === 3">扫码成功，等待确认</span>
              <span v-if="qrStatus === 1">确认登陆中</span>
              <span v-if="qrStatus === 2">请使用手机App扫一扫</span>
            </div>
          </div>
          <div v-else class="noCheck">
            <span>请阅读并同意《用户协议》及《隐私保护声明》</span>
          </div>
        </div>
        <div class="botton_box">
          <div v-if="Config.showDeal" class="botton_box_agree">
            <el-checkbox v-model="checked" />
            <span style="color: #666666;font-size: 12px; margin-left: 8px ">已阅读并同意
              <a
                style="color: #007EDE;"
                href="http://oortcloudsmart.com/servceAgreement.html"
                target="_blank"
              >《用户协议》</a>
              及
              <a
                style="color: #007EDE;"
                href="http://oortcloudsmart.com/privacypolicy.html"
                target="_blank"
              >《隐私权保护声明》</a>
            </span>
          </div>
          <div class="botton_box_login_bottom">
            {{ props['config'].login_bottom }}
          </div>
        </div>
      </div>
    </div>
    <template v-if="false">
      <!--    左上角的按钮切换二维码或者账号密码登录  -->
      <img
        v-if="!passwordLogin"
        class="loginGightpic"
        src="@/assets/img/login/login_ic2.png"
        @click="showPassLoginOrCodeLogin"
      />
      <img v-else class="loginGightpic" src="@/assets/img/login/login_ic.png" @click="showPassLoginOrCodeLogin" />
    </template>
  </div>
</template>

<script lang='ts' setup>
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { useUserStoreW } from '@/store/modules/userWare'
import Config from '@/config/index'
import { ElMessage } from 'element-plus'
import { User, Key, View, Hide } from '@element-plus/icons-vue'
import getQueryUrlString from '@/utils/getQueryUrlString'
import { getToken, removeToken, setToken } from '@/utils/cache/cookies'
import { checkLoginStatus, getLoginQrCode } from '@/api/QRcode'
// import { qrcoceGetKey, verifyToken } from '@/api/sso.js'
// import { qrcoceGetKey, qrcodeCheck, verifyToken } from '@/api/sso.js'
// import QrcodeImg from './qrcodeComponent/qrcodeImg.vue'
const store = useUserStoreW()
const router = useRouter()
const verifyToken = store.verifyToken
const props: any = defineProps({
  showRegs: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    default: () => {}
  },
  client: {
    type: String,
    default: 'pcweb'
  }
})
const codePngUrl = ref(Config.URL + Config.gateWay + 'oortcloud-sso/captcha/v1/')
// 二维码登录还是用户名密码登录
const passwordLogin = ref(true)
const showeiXinCode = ref(true)
const codeImg = ref('') //  获取二维码
const qrStatus = ref(0) // 扫描状态
const loading = ref(false)
const checked = ref(true)
const loginForm = reactive({
  username: '',
  password: '',
  captchaID: '',
  code: ''
})

const timeStamp = ref(new Date().getTime())

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const ruleFormRef = ref('')
const submitForm = async(formEl: any) => {
  if (!formEl) return
  await formEl.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      store.login({
        username: loginForm.username,
        password: loginForm.password,
        code: loginForm.code
      }).then(() => {
        ElMessage.success('登录成功')
        router.push({ path: '/index' })
      }).catch(() => {
        loginForm.password = ''
        // 测试
      }).finally(() => {
        loading.value = false
      })
    } else {
      return false
    }
  })
}
// 显示隐藏 密码
let passwordType = ref<any>('password')
const showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
}
// 自动登录  3种方式
// 1 ,url 后面拼接 token 的形式
// 2 ，sessionStorage中存储token 的形式
// 3， 零信任
// 是否url 后面拼接了accessToken
const autoLogin = () => {
  let urlAccessToken = getQueryUrlString(window.location.href)
  if (!!urlAccessToken.accessToken) {
    // 这里要校验token的有效性
    const params = {
      accessToken: urlAccessToken.accessToken
    }
    verifyToken(params).then(res => {
      if (res.code === 200 && res.data) {
        setToken(urlAccessToken.accessToken)
        router.push('/index')
      } else {
        ElMessageBox.alert(res.msg + '，请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            removeToken()
            router.push('/')
          }
        })
      }
    })
    return
  }
  let tempObj = getToken()
  if (!!tempObj) {
    try {
      if (tempObj) {
        const params = {
          accessToken: tempObj
        }
        verifyToken(params).then(res => {
          if (res.code === 200 && res.data) {
            setToken(tempObj)
            router.push('/index')
          } else {
            ElMessageBox.alert(res.msg + '，请重新登录', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                removeToken()
                router.push('/')
              }
            })
          }
        })
      }
    } catch (e) {
      removeToken()
    }
  }
}
// 获取二维码
const getQRCodeGetKey = async() => {
  // let params = {
  //   client: 'pcweb'
  // }
  let res:any = await getLoginQrCode()
  codeImg.value = window.URL.createObjectURL(res.data)
  // getLoginQrCode(params).then(res => {
  //   qrcodeStr.value = res.data.qrcodekey
  getQRCheck()
  // })
}
// 查询二维码扫描状态
const getQRCheck = () => {
  // let params = {
  //   qrcodekey: qrcodeStr.value
  // }
  // 1:已扫码,确认登录 2:未扫码 3:已扫码,未确认 4:已扫码,取消登录 5:二维码已过期
  checkLoginStatus().then((res: any) => {
    qrStatus.value = res.data
    switch (res.data) {
      // 确定登陆
      case 1:
        // store.commit('setToken', res.data.userInfo.accessToken)
        // window.sessionStorage.setItem('accessToken', res.data.userInfo.accessToken)
        // window.sessionStorage.removeItem('tempObj')
        router.replace('/')
        break
      case 2:
      case 3:
        setTimeout(() => {
          // 判断是否处于当前扫码面板时候，才调用
          if (!passwordLogin.value) {
            getQRCheck()
          }
        }, 1500)
        break
      default:
        break
    }
  })
}
// 账号-扫码 切换
const showPassLoginOrCodeLogin = () => {
  passwordLogin.value = !passwordLogin.value
  showeiXinCode.value = true
  // 扫码 获取二维码
  if (!passwordLogin.value) {
    getQRCodeGetKey()
  }
}
onMounted(() => {
  autoLogin()
})

</script>

<style lang="scss" scoped>
.el-icon {
  cursor: pointer;
}

:deep(.login_body) {
  .el-input {
    .el-input__wrapper {
      padding: 2px;
    }

    .el-input__inner {
      padding: 0 40px;
    }

    .el-input__prefix {
      position: absolute;
      left: 18px;
    }

    .el-input__suffix {
      position: absolute;
      right: 18px;
    }
  }
}

.botton_box {
  width: 100%;
  @extend .flexRow;
  @extend .flexCenter;

  &_agree {
    @extend .flexRow;
    justify-content: center
  }

  &_login_bottom {
    font-size: 12px;
    color: $font-color-b9;
    text-align: center;
    margin-top: 8px
  }
}

// 扫描
.loginGightpic {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 127px;
  cursor: pointer;
}

.login-container {
  margin-top: -40px;
  width: 444px;
  min-height: 444px;
  padding: 32px 64px 16px;
  //background-color: $bg-w;
  position: relative;
  background-color: hsla(0, 0%, 100%, .9)
}

.login_form {
  //width: 360px;
  display: flex;
  flex-direction: column;
  position: relative;

}

/*二维码相关*/
.qr_code_div {
  width: 360px;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  &_img {
    flex: 1;
    margin-top: 34px;
  }

  &_span {
    height: 32px;
    font-size: 14px;
    color: #333333;
  }
}

// 刷新
.qr_code_mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: #444141cc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 55px;
    height: 55px;
    margin: 12px;
  }

  span {
    font-size: 16px;
    color: #fff;
  }
}

.login_tips {
  //margin: 20px;
  span {
    font-weight: bold;
    font-size: 36px;
    color: #333333;
  }
}

.login_body {
  //margin: 10px 45px;
}

.login_btn {
  width: 100%;
}

.login_input_item {
  margin: 40px 0;
}

:deep(.login_input_yzm .el-form-item__content) {
  display: flex;
  flex-direction: row;
}

</style>
