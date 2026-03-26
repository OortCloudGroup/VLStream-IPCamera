<template>
  <div class="question_container">
    <div class="box-out">
      <el-form ref="formRef" class="formBox" :model="form" :rules="rules">
        <div class="que_title">
          基本信息
        </div>
        <!-- 基本信息   -->
        <el-form-item prop="title" label="投票标题">
          <el-input v-model="form.title" class="wh-input" placeholder="输入通知主题" />
        </el-form-item>
        <el-form-item label="投票内容">
          <el-input
            v-model="form.content"
            class="wh-input"
            :autosize="{ minRows: 2, maxRows: 10 }"
            maxlength="256"
            show-word-limit
            type="textarea"
            placeholder="输入通知内容"
          />
        </el-form-item>
        <div class="que_title">
          题目
        </div>
        <el-form-item label="题目设置" class="themesT">
          <div v-for="(cc,ci) in form.themes" :key="ci" class="wh-input add_ques_w">
            <div class="flexRowAC add_ques_wt">
              {{ NOFn(ci) }}.
              <el-input v-model="cc.theme" class="wh-input" placeholder="输入题目" />
              &nbsp;&nbsp;
              <el-icon color="red" size="18" style="cursor: pointer" @click="form.themes.length>1?form.themes.splice(ci,1): ''">
                <RemoveFilled />
              </el-icon>
            </div>
            <div v-for="(item,i) in cc['options']" :key="i">
              <div class="picture flexRowAC">
                <el-upload
                  :headers="headers"
                  class="picture_add tu flexRowAC"
                  :class="{photo_imgs:item.url}"
                  :action="upfileURL"
                  list-type="picture-card"
                  :on-success="(res) => {handleAvatarSuccess(res, i,ci)}"
                  :before-upload="beforeAvatarUpload"
                >
                  <div v-if="!item.url" class="picture_add flexRowAC">
                    <el-icon>
                      <Plus />
                    </el-icon>
                    <span>&nbsp;&nbsp;添加图片</span>
                  </div>
                  <img v-else class="el-upload-list__item-thumbnail" :src="item.url" alt="" />
                </el-upload>
                <div
                  class="delete_icon flexRowAC"
                  :class="{photo:item.url}"
                  @click="plusRemove(i,ci)"
                >
                  <el-icon color="red" size="18">
                    <RemoveFilled />
                  </el-icon>
                </div>
              </div>
              <div class="add_ques flexRowAC">
                <input v-model="item.option_content" class="add_ques_input" placeholder="编辑选项内容" type="text" />
                <div class="delete_icon " />
              </div>
            </div>
            <div class="flexRowAC multiBox">
              <div>
                此题可多选&nbsp;&nbsp;<el-switch v-model="cc.multi" :inactive-value="1" :active-value="2" />
              </div>
              <div class="add_ques_vote flexRowAC" @click="plusAdd(ci)">
                <el-icon color="#1F78F4" size="18">
                  <CirclePlusFilled />
                </el-icon>
                <span>&nbsp;&nbsp;添加选项</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="添加题目">
          <div class="add_ques_vote flexRowAC" @click="plusTheme()">
            <el-icon color="#1F78F4" size="18">
              <CirclePlusFilled />
            </el-icon>
            <span>&nbsp;&nbsp;添加题目</span>
          </div>
        </el-form-item>
        <el-form-item prop="start_dt" label="开始时间">
          <el-date-picker
            v-model="form.start_dt"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            class="wh-input"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item prop="end_dt" label="截止时间">
          <el-date-picker
            v-model="form.end_dt"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            class="wh-input"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="匿名发布">
          <el-switch v-model="form.anonymous" :inactive-value="1" :active-value="2" />
        </el-form-item>
      </el-form>
      <!--        提交发布-->
      <div class="elButtonBox flexRowAC">
        <el-button @click="emits('close')">
          取消
        </el-button>
        &nbsp;&nbsp;
        <el-button type="primary" @click="submitClick(formRef)">
          提交发布
        </el-button>
      </div>
      <!-- end  -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { Plus, CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue'
import { ElMessage, FormRules } from 'element-plus'
import Config from '@/config'
import { vote2Info, voteAdd2, voteEdit2 } from '@/api/meetingMana'

const props = defineProps(['item'])
const emits = defineEmits(['close', 'handle'])
let queryTemp = ref(props.item)
const formRef = ref<any>(null) // form Ref
let headers = ref<any>(Config.headers) // 上传headers
const upfileURL = ref('')// 添加图片
upfileURL.value = Config.URL + Config.gateWay + 'oortcloud-fastdfsservice/fastdfs/v1/uploadFile'

const form = reactive({
  title: '',
  content: '',
  start_dt: '', // 开始时间
  end_dt: '', // 结束时间
  vote_type: 2, // 1-文本,2-图文
  anonymous: 1, // 匿名
  multi: 1, // 多选
  themes: [
    {
      theme: '',
      multi: '',
      options: [
        {
          option_content: '',
          url: ''
        },
        {
          option_content: '',
          url: ''
        }
      ]
    }
  ] //	题目
})
const rules = reactive<FormRules<any>>({
  title: [
    { required: true, message: '请输入投票标题', trigger: 'blur' }
  ],
  start_dt: [
    { required: true, message: '请选择时间', trigger: 'blur' }
  ],
  end_dt: [
    { required: true, message: '请选择时间', trigger: 'blur' }
  ]
})

const handleAvatarSuccess = (res, index, ci) => {
  if (res.code === 200) {
    form.themes[ci].options[index].url = res.data.url
  } else {
    ElMessage.error('上传失败')
  }
}
const beforeAvatarUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }
  return isLt2M
}

// 题目序号
const NOFn = (index) => {
  index = Number(index + 1)
  return index > 9 ? index : '0' + index
}

// 移除某项
const plusRemove = (index, ci) => {
  if (form.themes[ci].options.length > 2) {
    form.themes[ci].options.splice(index, 1)
  }
}

// 添加选项
const plusAdd = (index) => {
  let obj = { option_content: '', url: '' }
  form.themes[index].options.push(obj)
}

// 添加题目
const plusTheme = () => {
  let obj = {
    theme: '',
    multi: '',
    options: [
      {
        option_content: '',
        url: ''
      },
      {
        option_content: '',
        url: ''
      }
    ]
  }
  form.themes.push(obj)
}

// 必填项
function flag() {
  let array: any = form.themes
  for (let i = 0; i < array.length; i++) {
    if (!array[i].theme) {
      ElMessage.warning('请输入题目')
      return false
    } else {
      let O = array[i].options
      for (let j = 0; j < O.length; j++) {
        if (!O[j].option_content) {
          ElMessage.warning('请输入选项内容')
          return false
        }
      }
    }
  }
  return true
}

const submitClick = async(formEl: any) => {
  if (!formEl) return
  await formEl.validate(async(valid: boolean) => {
    if (valid) {
      if (!flag()) {
        return
      }
      let data: any = { ...form }
      data.conference_uid = queryTemp.value?.conference_uid
      if (queryTemp.value?.vote_uid) data['vote_uid'] = queryTemp.value.vote_uid
      let res: any = queryTemp.value?.vote_uid ? await voteEdit2(data) : await voteAdd2(data)
      if (res.code === 200) {
        ElMessage.success(res.msg)
        emits('close')
        emits('handle')
      }
    } else {
      return false
    }
  })
}

function detailsFn(val) {
  let data = val.vote
  let themes = val.themes
  form.title = data.title
  form.content = data.content
  form.start_dt = data.start_dt
  form.end_dt = data.end_dt
  form.vote_type = data.vote_type
  form.anonymous = data.anonymous
  form.multi = data.multi
  form.themes = themes
}

// 详情
const getInfoFn = async() => {
  let data = {
    conference_uid: queryTemp.value.id,
    vote_uid: queryTemp.value.vote_uid
  }
  let res: any = await vote2Info(data)
  if (res.code === 200) {
    detailsFn(res.data)
  }
}
onMounted(() => {
  if (queryTemp.value?.vote_uid) getInfoFn()
})
</script>
<style lang="scss" scoped>
.question_container {
  height: 100%;
}

// nav
.nav_status {
  height: 60px;
  padding: 10px 0 0 20px;
  position: relative;
  border-bottom: 1px solid #FAFAFA;

  &:before {
    content: '';
    width: 3px;
    height: 18px;
    background-color: #1A1A1A;
    position: relative;
    top: 0;
    left: 0px;

  }

  .nav_title {
    height: 40px;
    line-height: 40px;
    color: #333;
    margin-left: 12px;

    &:last-child {
      color: #999;
    }
  }
}

.box-out {
  height: calc(100% - 60px);
  overflow: auto;
}

// 添加投票
.add_ques {
  height: 60px;
  padding-left: 24px;
  margin-bottom: 14px;
  background-color: #F8F8F8;

  &_input {
    width: calc(100% - 60px);
    height: 100%;
    font-size: 14px;
    outline: none;
    border: none;
    background-color: #f7f7f7;
  }

  &_vote {
    justify-content: right;
    align-items: center;
    font-size: 14px;

    > .el-icon, > span {
      cursor: pointer;
    }
  }
}

// 添加题目
.add_ques_w {
  width: 100%;
  height: inherit !important;
  margin-left: 20px;

  .add_ques_wt {
    margin-left: -20px;
  }
}

// 添加图片
.picture {
  margin-top: 4px;
  background-color: #F8F8F8;
  padding-left: 20px;

  .tu {
    padding-top: 10px;
  }

  &_add {
    cursor: pointer;
    height: 48px;
    border-radius: 2px;
    width: calc(100% - 60px);

    &.photo_imgs {
      height: 140px;
      padding-right: 20px;
    }
  }

  :deep(.el-upload-list) {
    width: 100%;
    height: 100%;

    .el-upload {
      width: 100%;
      height: 100%;
    }

    .el-upload-list__item {
      display: none;
    }
  }
}

// 移除
.delete_icon {
  justify-content: center;
  width: 60px;
  height: 60px;
  text-align: center;

  > .el-icon {
    cursor: pointer;
  }
}

// 基本信息
:deep(.formBox) {
  width: 80%;

  .themesT{

    .el-form-item__label{
      height: 48px;
      line-height: 48px;
    }
  }

  .que_title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 18px;
    color: var(--el-color-primary);
    letter-spacing: 0;
    font-weight: 700;
    padding: 20px 36px 20px;
  }

  .el-form-item__label {
    width: 150px;
  }

  .el-input {
    height: 48px;
  }
}

.elButtonBox {
  //padding: 40px 20px;
  //max-width: 50%;
  justify-content: flex-end;
}

.multiBox {
  padding-bottom: 20px;
  justify-content: space-between;
}
</style>
