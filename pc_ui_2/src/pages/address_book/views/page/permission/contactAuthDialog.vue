<template>
  <div class="dialog_body">
    <div v-if="isAdmin" class="mode-tip">
      <img src="@/assets/img/address_book/tip_icon.png" alt="" />
      <div>
        提示：此人员为管理员，默认拥有全部权限，不能编辑调整设置
      </div>
    </div>
    <el-form ref="form" label-position="left" :model="formData">
      <el-form-item label="姓名">
        <el-input v-model="formData.name" disabled />
      </el-form-item>
      <el-form-item label="当前部门">
        <el-input v-model="formData.dept" disabled />
      </el-form-item>
      <el-form-item label="部门和用户可见列表设置权限">
        <div class="form_content">
          <div class="form_content_item">
            <span class="form_content_item_tips">开启设置此权限,可对单一某用户设置查询部门和用户可见范围</span>
          </div>
          <div class="form_content_item">
            <span>是否给该用户开启设置部门和用户可见列表设置权限</span>
            <el-switch
              v-model="formData.islist"
              active-color="var(--el-color-primary)"
              inactive-color="#999999"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="用户字段显示隐藏权限">
        <div class="form_content">
          <div class="form_content_item">
            <span class="form_content_item_tips">开启设置用户字段显示隐藏权限，可对单一某个用户的字段进行显示或隐藏</span>
          </div>
          <div class="form_content_item">
            <span>是否给该用户开启设置用户字段显示隐藏权限</span>
            <el-switch
              v-model="formData.iscolumn"
              active-color="var(--el-color-primary)"
              inactive-color="#999999"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="部门用户显示隐藏权限">
        <div class="form_content">
          <div class="form_content_item">
            <span class="form_content_item_tips">开启设置部门用户显示隐藏权限，可对某个部门用户的字段进行显示或隐藏</span>
          </div>
          <div class="form_content_item">
            <span>是否给该用户开启设置部门用户显示隐藏权限</span>
            <el-switch
              v-model="formData.ishidden"
              active-color="var(--el-color-primary)"
              inactive-color="#999999"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="字段编辑和描述设置权限">
        <div class="form_content">
          <div class="form_content_item">
            <span class="form_content_item_tips">开启此权限后，可对通讯录用户字段的可编辑范围和字段描述进行设置</span>
          </div>
          <div class="form_content_item">
            <span>是否给该用户开启字段编辑和描述设置权限</span>
            <el-switch
              v-model="formData.customauth"
              active-color="var(--el-color-primary)"
              inactive-color="#999999"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="角色显示隐藏权限">
        <div class="form_content">
          <div class="form_content_item">
            <span class="form_content_item_tips">开启设置角色显示隐藏权限，可对某个角色的字段进行显示或隐藏</span>
          </div>
          <div class="form_content_item">
            <span>是否给该用户开启设置角色显示隐藏权限</span>
            <el-switch
              v-model="formData.isrole"
              active-color="var(--el-color-primary)"
              inactive-color="#999999"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="排序权限">
        <div class="form_content">
          <div class="form_content_item">
            <span class="form_content_item_tips">开启拖拽部门、人员排序功能后，在PC端选中部门后可对该部门下的子集部门和人员排序</span>
          </div>
          <div class="form_content_item">
            <span>是否给该用户开启拖拽部门、人员排序功能</span>
            <el-switch
              v-model="formData.issort"
              active-color="var(--el-color-primary)"
              inactive-color="#999999"
            />
          </div>
        </div>
      </el-form-item>
      <!--      <el-form-item label="默认显示隐藏权限">-->
      <!--        <div class="form_content">-->
      <!--          <div class="form_content_item">-->
      <!--            <span class="form_content_item_tips">开启设置默认显示隐藏权限，可对默认的字段显示进行设置</span>-->
      <!--          </div>-->
      <!--          <div class="form_content_item">-->
      <!--            <span>是否给该用户开启设置默认显示隐藏权限</span>-->
      <!--            <el-switch-->
      <!--              v-model="formData.istenant"-->
      <!--              active-color="var(&#45;&#45;el-color-primary)"-->
      <!--              inactive-color="#999999"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-form-item>-->
      <el-form-item label="是否可以设置下级管理">
        <div class="form_content">
          <div class="form_content_item">
            <span class="form_content_item_tips">开启设置下级管理员权限后可将自己管理的部门用户设置为下级管理员</span>
          </div>
          <div class="form_content_item">
            <span>是否给该用户开启设置下级管理员权限</span>
            <el-switch
              v-model="formData.issubordinate"
              active-color="var(--el-color-primary)"
              inactive-color="#999999"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item class="set_user_dialog" label="管理的部门">
        <el-cascader
          v-model="deptCodeArr"
          :props="cascaderProps"
          clearable
          class="cas_sel"
        />
        <span class="set_user_dialog_tips">为该用户设置管理部门，不选则默认为管理所有部门</span>
      </el-form-item>
    </el-form>
    <div v-if="!isAdmin" class="dialog_btn">
      <el-button type="danger" @click="modifyDept(0)">
        清除该人员权限
      </el-button>
      <el-button type="primary" @click="modifyDept(1)">
        保存
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { saveAuth, deptList, getUserAuth } from '@/api/address_book'

const store = useUserStore()

const props = defineProps(['data'])

const emits = defineEmits(['confirm'])

const formData = reactive({
  name: '',
  dept: '',
  islist: false,
  iscolumn: false,
  ishidden: false,
  issort: false,
  issubordinate: false,
  isrole: false,
  customauth: false
  // istenant: false
})

const deptCodeArr = ref<string[][]>([])
const isAdmin = ref<boolean>(false) // 是否为管理员
/* cascader 配置 */
const cascaderProps = reactive({
  label: 'oort_dname',
  value: 'oort_dcode',
  multiple: true,
  checkStrictly: true,
  emitPath: true,
  lazy: true,
  lazyLoad: async(node: any, resolve: any) => {
    const params: any = {}
    params.accessToken = store.userInfo?.accessToken
    let data
    if (node.level === 0) {
      // 第一层级使用 deptList 接口
      params.dept_code = ''
      const res = await deptList(params)
      data = res.data.list
    } else {
      // 其他层级使用 deptList 接口
      params.all_child = true
      params.pdeptcode = node.data.oort_dcode
      const res = await deptList(params)
      data = res.data.list
    }
    resolve(data)
  }
})

/* 保存 / 清除权限 */
const modifyDept = async(status: 0 | 1) => {
  const deptcodeArr = deptCodeArr.value
    .filter(arr => arr && arr.length)
    .map(arr => arr[arr.length - 1])

  const params = {
    accessToken: store.userInfo?.accessToken,
    status,
    deptcode: deptcodeArr,
    islist: formData.islist ? 1 : 0,
    iscolumn: formData.iscolumn ? 1 : 0,
    ishidden: formData.ishidden ? 1 : 0,
    issort: formData.issort ? 1 : 0,
    issubordinate: formData.issubordinate ? 1 : 0,
    isrole: formData.isrole ? 1 : 0,
    customauth: formData.customauth ? 1 : 0,
    // istenant: formData.istenant ? 1 : 0,
    uuid: props.data.oort_uuid
  }

  const res = await saveAuth(params)
  if (res.code === 200) {
    ElMessage.success('操作成功')
    emits('confirm', true)
  }
}

const getUserAuthList = async() => {
  const params = {
    accessToken: store.userInfo?.accessToken,
    user_id: props.data.oort_uuid
  }
  const res = await getUserAuth(params)
  if (res.code === 200) {
    isAdmin.value = !!res.data.is_admin
    formData.islist = res.data.islist === 1
    formData.iscolumn = res.data.iscolumn === 1
    formData.ishidden = res.data.ishidden === 1
    formData.issort = res.data.issort === 1
    formData.issubordinate = res.data.issubordinate === 1
    formData.isrole = res.data.isrole === 1
    formData.customauth = res.data.customauth === 1
    // formData.istenant = res.data.istenant === 1
    deptCodeArr.value = []

    // 根据 deptcode 在 ds 中找到对应的完整路径
    if (Array.isArray(res.data.deptcode) && Array.isArray(res.data.ds)) {
      res.data.deptcode.forEach((deptCode: string) => {
        let matchedPath = ''
        let shortestLength = Infinity

        res.data.ds.forEach((path: string) => {
          const cleanPath = path.replace(/\t/g, '').trim()
          const pathSegments = cleanPath.split('/').filter(Boolean)

          if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1] === deptCode) {
            if (pathSegments.length < shortestLength) {
              shortestLength = pathSegments.length
              matchedPath = cleanPath
            }
          }
        })

        // 如果找到了匹配的路径，将其转换为级联选择器的格式
        if (matchedPath) {
          const codePath = matchedPath
            .split('/')
            .filter(Boolean) // 去掉空串
          if (codePath.length) {
            deptCodeArr.value.push(codePath)
          }
        } else {
          deptCodeArr.value.push([deptCode])
        }
      })
    }
  }
}

/* 同步 data 到 formData（示例） */
watch(
  () => props.data,
  (val) => {
    formData.name = val.oort_name || ''
    formData.dept = val.oort_depname || ''
  },
  { immediate: true }
)

onMounted(async() => {
  await getUserAuthList()
})
</script>

<style scoped lang="scss">
.dialog_body {
  width: calc(100% - 32px);
  margin: 0 16px;
  min-height: 19rem;
}
:deep(.el-form-item__label){
  min-width: unset;
  width: 110px;
  color: #333333;
}
.dialog_btn {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 20px;
}

.form_content {
  display: flex;
  flex-direction: row;
  min-height: 60px;
  border-top: 0.5px solid rgba(227, 227, 227, 0.5);

  &_item {
    width: 340px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    &_tips {
      white-space: break-spaces;
      font-size: 12px;
      color: #333;
    }

    span {
      margin: 4px 0;
      font-size: 12px;
      color: #999;
      line-height: 1.2;
    }
  }
}

.set_user_dialog {
  position: relative;
  &_tips {
    position: absolute;
    top: 30px;
    left: 0;
    font-size: 10px;
    color: #999;
  }
}
.set_user_dialog_tips{
  color: #999;
  font-size: 10px
}
:deep(.el-cascader.cas_sel) {
  width: 100%;
}

.mode-tip {
  height: 40px;
  min-width: 780px;
  display: flex;
  align-items: center;
  background: #EDF5FF;
  border: 1px solid #CDE4FF;
  padding-left: 10px;
  gap: 6px;
  margin:  0 0 10px 0;
  img{
    width: 16px;
  }
  div{
    color: #167EFF;
    font-size: 14px;
    line-height: normal;
    text-align: left;

  }
}
</style>
