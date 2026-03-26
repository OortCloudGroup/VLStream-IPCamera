<template>
  <div class="c_content">
    <div class="flexRowAC creddTabBox">
      <div v-for="(item,i) in creddTab" :key="i" class="flexRowAC cdTItem" :class="{act:cdAct===i}" @click="chageCreddTaab(i)">
        {{ item }}
      </div>
    </div>
    <div v-if="!code_img_pub" class="flexRowAC c_cont_Box">
      <div class="c_inputBox">
        <div v-if="cdAct===0">
          <el-input
            v-model="form.textareaCode"
            :rows="10"
            class="c_text"
            type="textarea"
            placeholder="请输入文本内容"
          />
        </div>
        <div v-if="cdAct===1">
          <el-input v-model="form.textareaCode" show-word-limit maxlength="20" placeholder="请输入" />
        </div>
        <!--上传文件-->
        <el-upload
          v-if="cdAct===2"
          v-loading="uploading"
          class="up_box"
          :action="upfileURL"
          :headers="headers"
          :show-file-list="false"
          drag
          multiple
          accept=".word,.excel,.ppt,.doc,.docx,.pdf,.xls,.xlsx,.pdf,.apk,.zip,.rar,.7z,.tar,.gz,.txt"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <div v-if="!dataUrlF.length" class="ccUpTextBox flexRowAC">
            <img class="ccUpImg" src="@/assets/img/QRCodeManaPlat/ccUp.png" alt="" />
            <div class="ccUpText">
              上传文件
            </div>
            <div class="ccUpTextD">
              点击上传、拖拽文件到这里，一次可上传多个文件
              <br />支持 word、excel、pdf、ppt、zip、apk 等多种文件格式，单文件最大支持200MB
            </div>
          </div>
          <div v-else class="ccUpTextBox imgShow flexRowAC">
            <div v-for="(item,i) in dataUrlF" :key="i" class="flexRowAC imgShowImg">
              <div class="imgShowImgFBox flexRowAC">
                <div class="imgShowImgFI" />
                <div>{{ item.path }}</div>
                <div>{{ item.size }}</div>
              </div>
              <el-icon class="imgShowClose" @click.stop="delData(i)">
                <CircleClose />
              </el-icon>
            </div>
          </div>
        </el-upload>
        <!--上传图片-->
        <el-upload
          v-if="cdAct===3"
          v-loading="uploading"
          :action="upfileURL"
          :headers="headers"
          :show-file-list="false"
          class="up_box"
          drag
          multiple
          accept=".png, .jpg, .jpeg"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <div v-if="!dataUrl.length" class="ccUpTextBox flexRowAC">
            <img class="ccUpImg" src="@/assets/img/QRCodeManaPlat/ccUp1.png" alt="" />
            <div class="ccUpText">
              上传图片
            </div>
            <div class="ccUpTextD">
              点击上传、拖拽图片到这里，一次可上传多个文件
              <br />单图片最大支持5MB
            </div>
          </div>
          <div v-else class="ccUpTextBox imgShow flexRowAC">
            <div v-for="(item,i) in dataUrl" :key="i" class="flexRowAC imgShowImg">
              <img class="imgShowImg_" :src="item.file" alt="" />
              <el-icon class="imgShowClose" @click.stop="delData(i)">
                <CircleClose />
              </el-icon>
            </div>
          </div>
        </el-upload>
        <!--上传音视频-->
        <el-upload
          v-if="cdAct===4"
          v-loading="uploading"
          :action="upfileURL"
          :headers="headers"
          :show-file-list="false"
          class="up_box"
          drag
          multiple
          accept="video/*, audio/*"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <div v-if="!dataUrlV.length" class="ccUpTextBox flexRowAC">
            <img class="ccUpImg" src="@/assets/img/QRCodeManaPlat/ccUp2.png" alt="" />
            <div class="ccUpText">
              上传音视频
            </div>
            <div class="ccUpTextD">
              点击上传、拖拽音视频到这里，一次可上传一个文件
              <br />单音视频最大支持100MB
            </div>
          </div>
          <div v-else class="ccUpTextBox imgShow flexRowAC">
            <div v-for="(item,i) in dataUrlV" :key="i" class="flexRowAC imgShowImg">
              <div class="imgShowImgFBox flexRowAC">
                <div class="imgShowImgFI" />
                <div>{{ item.path }}</div>
                <div>{{ item.size }}</div>
              </div>
              <el-icon class="imgShowClose" @click.stop="delData(i)">
                <CircleClose />
              </el-icon>
            </div>
          </div>
        </el-upload>
        <div class="c_t_i">
          <div class="c_title">
            <span style="color: red;">*</span>标题
          </div>
          <el-input v-model="form.qrTitle" show-word-limit maxlength="20" placeholder="请输入" />
        </div>
        <div class="c_t_i">
          <div class="c_title">
            类型
          </div>
          <el-select
            v-model="form.qrTypeName"
            filterable
            remote
            reserve-keyword
            placeholder="请选择类型名称"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="changeType"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.qrTypeName"
              :value="item"
            />
          </el-select>
        </div>
        <div class="c_t_i">
          <div class="c_title">
            描述
          </div>
          <el-input
            v-model="form.qrDescription"
            :rows="3"
            class="c_text"
            type="textarea"
            placeholder="请输入"
            show-word-limit
            maxlength="256"
          />
        </div>
        <div class="geneCode flexRowAC">
          <div v-if="codeImg" class="generateCode rep flexRowAC" @click="createCode">
            再次生成
          </div>
          <div v-else class="generateCode flexRowAC" @click="createCode">
            生成二维码
          </div>
        </div>
      </div>
      <div class="c_code_out">
        <div class="c_code flexRowAC">
          <div v-if="codeImg" class="c_codeIT flexRowAC">
            <img class="c_codeImg" :src="codeImg" alt="" />
            <div class="c_codeBtn flexRowAC" @click="operateCreat_Fn">
              发布二维码
            </div>
          </div>
          <div v-else class="c_code_t flexRowAC">
            预览二维码
          </div>
        </div>
      </div>
    </div>
    <div v-else class="code_s_img flexRowAC">
      <img class="code_s_img_show" :src="code_img_pub" alt="" />
      <div class="code_s_img_btn flexRowAC" @click="operateCodeImg">
        返回
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { operateCreat, operateRegisterQrCode, typeQueryPageList } from '@/api/QRcode'
import Config from '@/config'

let creddTab = ref<any>(['文本', '网址', '文件', '图片', '音视频']) // 创建二维码
let cdAct = ref<number>(0) // 二维码act
let codeImg = ref<any>(0) // 二维码 展示
let dataUrl = ref<any>([]) // 上传文件 图片
let dataUrlF = ref<any>([]) // 上传文件 图片
let dataUrlV = ref<any>([]) // 上传音视频 图片
let headers = ref<any>(Config.headers) // 上传headers
let upfileURL = ref<any>('') // 上传路径
let code_img_pub = ref<any>('') // 发布成功返回二维码
upfileURL.value = Config.URL + Config.gateWay + 'oortcloud-fastdfsservice/fastdfs/v1/uploadFile'
// data
const form = reactive({
  textareaCode: '',
  qrCodeLink: '',
  qrTitle: '',
  qrTypeName: '',
  qrTypeId: '',
  qrDescription: ''
})

// 发布成功返回二维码
const operateCodeImg = () => {
  code_img_pub.value = ''
  codeImg.value = ''
  form.textareaCode = ''
  form.qrTitle = ''
  form.qrTypeName = ''
  form.qrDescription = ''
}

// 根据文本生成二维码图片
const createCode = async() => {
  if (!form.textareaCode && cdAct.value < 2) {
    return ElMessage.warning('请输入文本')
  }
  if (cdAct.value === 2 && !dataUrlF.value.length) {
    return ElMessage.warning('未上传文件')
  }
  if (cdAct.value === 3 && !dataUrl.value.length) {
    return ElMessage.warning('未上传图片')
  }
  if (cdAct.value === 4 && !dataUrlV.value.length) {
    return ElMessage.warning('未上传音视频')
  }
  let data = {
    text: form.textareaCode
  }
  if (cdAct.value > 1) {
    let arr: any = []
    if (cdAct.value === 2) {
      dataUrlF.value.forEach((item: any) => {
        arr.push(item.url)
      })
    }
    if (cdAct.value === 3) {
      dataUrl.value.forEach((item: any) => {
        arr.push(item.url)
      })
    }
    if (cdAct.value === 4) {
      dataUrlV.value.forEach((item: any) => {
        arr.push(item.url)
      })
    }
    data.text = arr.join(',')
  }
  let res: any = await operateCreat(data)
  form.qrCodeLink = res.data
  if (res.code === 200) {
    ElMessage.success(res.msg)
    codeImg.value = qrCodeData(res.data)
  }
}

// 码Base64字符串
function qrCodeData(data) {
  // 解码Base64字符串
  let binary = atob(data)
  let array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }
  // 创建Blob对象
  let blob = new Blob([array], { type: 'image/png' })
  // 创建URL
  return URL.createObjectURL(blob)
}

// 发布二维码
const operateCreat_Fn = async() => {
  if (!form.qrTitle) {
    return ElMessage.warning('请输入标题')
  }
  let data = {
    inputType: cdAct.value, // 0：文本 1：网址 2：文件 3：图片 4：音视频
    qrCodeData: form.qrCodeLink, // 二维码的图像数据
    qrTitle: form.qrTitle, // 标题
    qrDescription: form.qrDescription, // 二维码描述
    qrTypeId: form.qrTypeId, // 类型id
    qrTypeName: form.qrTypeName, // 描述
    qrCodeLink: form.textareaCode
  }
  let res: any = await operateRegisterQrCode(data)
  if (res.code === 200) {
    ElMessage.success('发布成功')
    code_img_pub.value = qrCodeData(res.data)
  }
}
const uploading = ref(false)
// 文件大小不能超过 2：文件200M 3：图片 5M  4：音视频100M
const beforeAvatarUpload = (file: any) => {
  let isLt2M = file.size / 1024 / 1024 < 5
  if (cdAct.value === 2) {
    isLt2M = file.size / 1024 / 1024 < 200
    if (!isLt2M) {
      ElMessage.error('文件大小不能超过 200MB!')
    }
  }
  if (cdAct.value === 3) {
    isLt2M = file.size / 1024 / 1024 < 5
    if (!isLt2M) {
      ElMessage.error('图片大小不能超过 5MB!')
    }
  }
  if (cdAct.value === 4) {
    isLt2M = file.size / 1024 / 1024 < 100
    if (!isLt2M) {
      ElMessage.error('音视频1文件大小不能超过 100MB!')
    }
  }
  uploading.value = true
  return isLt2M
}

const chageCreddTaab = (index: number) => {
  cdAct.value = index
  dataUrl.value = []
  dataUrlF.value = []
  dataUrlV.value = []
}

// 上传
const handleAvatarSuccess = (res: any, uploadFile: any) => {
  uploading.value = false
  if (res.code === 200) {
    let obj = {
      file: URL.createObjectURL(uploadFile.raw!),
      url: res.data.url,
      path: res.data.path,
      size: res.data.size
    }

    if (cdAct.value === 2) {
      let l = obj.path.split('/')
      obj.path = l[l.length - 1]
      dataUrlF.value.push(obj)
      form.textareaCode = dataUrlF.value.map(item => item.url).join(',')
    }
    if (cdAct.value === 3) {
      dataUrl.value.push(obj)
      form.textareaCode = dataUrl.value.map(item => item.url).join(',')
    }
    if (cdAct.value === 4) {
      let l = obj.path.split('/')
      obj.path = l[l.length - 1]
      dataUrlV.value.push(obj)
      form.textareaCode = dataUrlV.value.map(item => item.url).join(',')
    }
  } else {
    ElMessage.error('上传失败')
  }
}

// 上传删除
const delData = (index: number) => {
  if (cdAct.value === 2) {
    dataUrlF.value.splice(index, 1)
  }
  if (cdAct.value === 3) {
    dataUrl.value.splice(index, 1)
  }
  if (cdAct.value === 4) {
    dataUrlV.value.splice(index, 1)
  }
}

const options = ref([])
const loading = ref(false)

// const focusSearch = () => {
//   options.value = []
// }

const remoteMethod = async(query) => {
  loading.value = true
  const params = { qrTypeName: query, pageNum: 1, pageSize: 99 }
  let res = await typeQueryPageList(params)
  if (res.code === 200) {
    loading.value = false
    options.value = res.rows || []
  }
}

const changeType = (val) => {
  form.qrTypeName = val.qrTypeName
  form.qrTypeId = val.qrTypeId
}

</script>

<style lang="scss" scoped>
// 发布成功返回二维码
.code_s_img {
  padding-top: 40px;
  justify-content: center;
  flex-direction: column;
  gap: 20px;

  .code_s_img_show {
    width: 280px;
    height: 280px;
    background-color: #f7f7f7;
  }

  .code_s_img_btn{
    cursor: pointer;
    margin-top: 20px;
    justify-content: center;
    color: var(--el-color-primary);
    width: 280px;
    height: 48px;
    border: 1px solid var(--el-color-primary);
    border-radius: 4px;
    font-size: 16px;
  }
}

// 上传文件
.up_box {
  height: 220px;

  :deep(.el-upload.el-upload--text) {
    width: 100%;
    height: 100%;

    .el-upload-dragger {
      width: 100%;
      height: 100%;
    }
  }

  .ccUpTextBox {
    flex-direction: column;
  }

  .ccUpImg {
    width: 48px;
    height: 48px;
    background-size: cover;
  }

  .ccUpText {
    padding-top: 12px;
    font-size: 14px;
    color: #000000;
  }

  .ccUpTextD {
    padding-top: 12px;
    text-align: center;
    font-size: 12px;
    color: #939393;
  }
}

// 上传文件展示
.ccUpTextBox.imgShow {
  flex-direction: row;
  gap: 8px;

  .imgShowImg {
    width: 166px;
    background: #FFFFFF;
    border: 1px dashed var(--el-color-primary);
    border-radius: 8px;
    position: relative;
  }

  .imgShowClose {
    color: red;
    position: absolute;
    right: 8px;
    top: 8px;
    font-size: 18px;
  }

  .imgShowImg_ {
    max-width: 100%;
    height: 100%;
  }

  .imgShowImgFBox {
    flex-direction: column;
    justify-content: center;
    width: 166px;
    height: 166px;
  }

  .imgShowImgFI {
    width: 42px;
    height: 48px;
    background-color: #f7f7f7;
  }
}

// 文本
.creddTabBox {
  .cdTItem {
    cursor: pointer;
    color: #939393;
    padding: 10px 20px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.04);
  }

  .cdTItem.act {
    border-color: var(--el-color-primary);
  }
}

.c_cont_Box {
  gap: 60px;
  align-items: flex-start;
  padding-top: 20px;

  .c_code {
    justify-content: center;
    width: 320px;
    height: 400px;
    background: #FAFAFA;

    &_out {
      flex: 2;
    }
  }

  .c_code_t {
    color: #939393;
    cursor: pointer;
  }

  .c_codeBtn {
    cursor: pointer;
    justify-content: center;
    width: 280px;
    height: 48px;
    background: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);
    border-radius: 4px;
    font-size: 16px;
    color: #FFFFFF;
  }

  .c_codeIT {
    gap: 26px;
    flex-direction: column;
  }

  .c_codeImg {
    width: 280px;
    height: 280px;
    background-size: 100% 100%;
  }
}

// 标题
.c_inputBox {
  flex: 3;

  .c_t_i {
    padding-top: 20px;
  }

  .c_title {
    padding-bottom: 12px;
    font-size: 14px;
    color: #000000;
  }
}

// 生成二维码
.geneCode {
  justify-content: center;
  padding-top: 40px;

  .generateCode {
    cursor: pointer;
    justify-content: center;
    width: 200px;
    height: 48px;
    background: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);
    border-radius: 4px;
    font-size: 16px;
    color: #FFFFFF;
    font-weight: bold;
  }

  .generateCode.rep {
    border: 1px solid var(--el-color-primary);
    border-radius: 4px;
    background: #fff;
    color: var(--el-color-primary);
  }
}

</style>
