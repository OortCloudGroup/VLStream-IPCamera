<template>
  <div class="dialog-content">
    <el-form v-if="talkForm" ref="talkFormRef" :model="talkForm" :rules="talkRules" label-width="120px">
      <el-form-item label="谈话类别" prop="talkType">
        <el-select v-model="talkForm.talkType" placeholder="请选择谈话类别" style="width: 100%">
          <el-option
            v-for="type in talkTypes"
            :key="type.categoryType"
            :label="type.categoryName"
            :value="type.categoryType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="谈话主题" prop="theme">
        <el-input
          v-model="talkForm.theme"
          placeholder="请输入谈话主题：限制字数50"
          maxlength="50"
          show-word-limit
          type="textarea"
          :rows="3"
        />
      </el-form-item>

      <el-form-item label="部门/监区" prop="department">
        <el-tree-select
          v-model="talkForm.department"
          :data="departmentOptions"
          :props="{
            label: 'label',
            value: 'name',
            children: 'children'
          }"
          placeholder="请选择部门/监区"
          style="width: 100%"
          check-strictly
          :lazy="true"
          :load="loadDepartmentNode"
          @node-click="handleNodeClick"
        />
      </el-form-item>

      <el-form-item label="谈话民警" prop="policeName">
        <el-select
          v-model="policeNameSelected"
          filterable
          remote
          reserve-keyword
          placeholder="请输入谈话民警姓名"
          :remote-method="remoteSearchPoliceName"
          :loading="policeNameLoading"
          style="width: 100%"
          :disabled="!startEmpty"
          @change="handlePoliceNameChange"
        >
          <el-option
            v-for="item in policeNameOptions"
            :key="item.oort_code"
            :label="item.oort_name"
            :value="item.oort_code"
          >
            <span>{{ item.oort_name }}</span>
            <span class="code-text">({{ item.oort_code }})</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="陪同民警" prop="escortPolice">
        <el-select
          v-model="escortPoliceSelected"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入陪同民警姓名"
          :remote-method="remoteSearchEscortPolice"
          :loading="escortPoliceLoading"
          style="width: 100%"
          @change="handleEscortPoliceChange"
        >
          <el-option
            v-for="item in escortPoliceOptions"
            :key="item.oort_code"
            :label="item.oort_name"
            :value="item.oort_code"
          >
            <span>{{ item.oort_name }}</span>
            <span class="code-text">({{ item.oort_code }})</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="谈话对象" prop="talkTarget">
        <el-select
          v-model="talkTargetSelected"
          filterable
          remote
          reserve-keyword
          placeholder="请输入谈话对象姓名"
          :remote-method="remoteSearchTalkTarget"
          :loading="talkTargetLoading"
          style="width: 100%"
          :disabled="!startEmpty"
          @change="handleTalkTargetChange"
        >
          <el-option
            v-for="item in talkTargetOptions"
            :key="item.oort_code"
            :label="item.oort_name"
            :value="item.oort_code"
          >
            <span>{{ item.oort_name }}</span>
            <span class="code-text">({{ item.oort_code }})</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="谈话地点" prop="place">
        <el-input v-model="talkForm.place" placeholder="请输入谈话地点" />
      </el-form-item>
    </el-form>
    <div class="dialog_buttons">
      <el-button @click="emit('cancel')">
        取消
      </el-button>
      <el-button type="primary" @click="confirmStartTalk">
        确认开始
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getCaseTypes, deptList, getdeptuser, getPrisonerList, startTalk } from '@/api/mobileeducationplatform/case'
import { ElMessage } from 'element-plus'
const store = useUserStore()

const startEmpty = ref(true)

const talkRules = {
  talkType: [{ required: true, message: '请选择谈话类别', trigger: 'change' }],
  theme: [
    { required: true, message: '请输入谈话主题', trigger: 'blur' },
    { max: 50, message: '谈话主题最多50个字符', trigger: 'blur' }
  ],
  department: [{ required: true, message: '请输入部门/监区', trigger: 'blur' }],
  policeName: [{ required: true, message: '请输入谈话民警', trigger: 'blur' }],
  talkTarget: [{ required: true, message: '请输入谈话对象', trigger: 'blur' }]
}

const talkForm = ref({
  talkType: '',
  theme: '',
  department: '',
  departmentCode: '',
  planId: '',
  escortPolice: '',
  escortPoliceCode: '',
  policeName: store.userInfo?.oort_name || '',
  talkTarget: '',
  prisonerType: '',
  prisonerCode: '',
  place: ''
})

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const talkTypes = ref([])

async function fetchTalkTypes() {
  try {
    const res = await getCaseTypes('1000')
    if (res.code === 200) {
      talkTypes.value = res.data
      // 默认设置为全部，不选择第一个类型
      talkForm.value.talkType = ''
    } else {
      ElMessage.error('获取谈话类型失败')
    }
  } catch (error) {
    ElMessage.error('获取谈话类型失败')
  }
}

function handleNodeClick(data) {
  talkForm.value.department = data.label
  talkForm.value.departmentCode = data.code
}

const departmentOptions = ref([])

const fetchDepartmentOptions = async() => {
  try {
    const params = {
      accessToken: store.token || '',
      oort_pdcode: store.userInfo?.oort_depcode || '',
      page: 1,
      pagesize: 100,
      isdel: 1
    }

    const response = await deptList(params)
    if (response && response.code === 200 && response.data) {
      // 只处理顶级部门
      departmentOptions.value = response.data.list.map(item => ({
        label: item.oort_dname,
        value: item.oort_dcode,
        code: item.oort_dcode,
        name: item.oort_dname,
        children: [], // 初始化为空数组
        leaf: false // 标记为非叶子节点
      }))
    } else {
      ElMessage.error('获取部门列表失败!')
      departmentOptions.value = []
    }
  } catch (err) {
    ElMessage.error('获取部门列表失败!')
    departmentOptions.value = []
  }
}

async function loadDepartmentNode(node, resolve) {
  if (node.level === 0) {
    // 根节点，返回顶级部门
    return resolve(departmentOptions.value)
  }

  try {
    const params = {
      accessToken: store.token || '',
      oort_pdcode: node.data.code, // 使用父节点的code作为查询参数
      page: 1,
      pagesize: 100,
      isdel: 1
    }
    const response = await deptList(params)
    if (response && response.code === 200 && response.data) {
      const children = response.data.list.map(item => ({
        label: item.oort_dname,
        value: item.oort_dcode,
        code: item.oort_dcode,
        name: item.oort_dname,
        children: [], // 初始化为空数组
        leaf: false // 标记为非叶子节点
      }))
      resolve(children)
    } else {
      resolve([])
    }
  } catch (error) {
    ElMessage.error('获取子部门失败!')
    resolve([])
  }
}

const policeNameLoading = ref(false)
const policeNameOptions = ref([])
const policeNameMap = ref({})
const policeNameSelected = ref('')

async function remoteSearchPoliceName(query) {
  if (query) {
    policeNameLoading.value = true
    try {
      const params = {
        accessToken: store.token || '',
        keyword: query,
        page: 1,
        pagesize: 99,
        showUser: 1
      }

      const response = await getdeptuser(params)
      if (response && response.code === 200 && response.data) {
        policeNameOptions.value = response.data.user || []

        // 更新编码到名称的映射
        policeNameOptions.value.forEach(item => {
          policeNameMap.value[item.oort_code] = item.oort_name
        })
      } else {
        ElMessage.error('获取谈话民警列表失败！')
        policeNameOptions.value = []
      }
    } catch (error) {
      ElMessage.error('获取谈话民警列表失败！')
      policeNameOptions.value = []
    } finally {
      policeNameLoading.value = false
    }
  } else {
    policeNameOptions.value = []
  }
}

function handlePoliceNameChange(value) {
  if (value) {
    talkForm.value.policeName = policeNameMap.value[value] || value
    talkForm.value.policeCode = value
  } else {
    talkForm.value.policeName = ''
    talkForm.value.policeCode = ''
  }
}

const escortPoliceLoading = ref(false)
const escortPoliceOptions = ref([])
const escortPoliceMap = ref({})
const escortPoliceSelected = ref([])
// 远程搜索陪同民警
async function remoteSearchEscortPolice(query) {
  if (query) {
    escortPoliceLoading.value = true
    try {
      const params = {
        accessToken: store.token || '',
        keyword: query,
        page: 1,
        pagesize: 99,
        showUser: 1
      }

      const response = await getdeptuser(params)
      if (response && response.code === 200 && response.data) {
        // 更新为正确的数据结构，用户数据在 data.user 中
        escortPoliceOptions.value = response.data.user || []

        // 更新编码到名称的映射
        escortPoliceOptions.value.forEach(item => {
          escortPoliceMap.value[item.oort_code] = item.oort_name
        })
      } else {
        ElMessage.error('获取陪同民警列表失败！')
        escortPoliceOptions.value = []
      }
    } catch (error) {
      ElMessage.error('获取陪同民警列表失败！')
      escortPoliceOptions.value = []
    } finally {
      escortPoliceLoading.value = false
    }
  } else {
    escortPoliceOptions.value = []
  }
}

// 处理陪同民警选择变化
function handleEscortPoliceChange(value) {
  if (value && value.length > 0) {
    // 将选中的编码转换为名称，用逗号分隔
    talkForm.value.escortPolice = value.map(code => escortPoliceMap.value[code] || code).join(',')
    // 保存编码，用逗号分隔
    talkForm.value.escortPoliceCode = value.join(',')
  } else {
    talkForm.value.escortPolice = ''
    talkForm.value.escortPoliceCode = ''
  }
}

const talkTargetLoading = ref(false)
const talkTargetOptions = ref([])
const talkTargetMap = ref({})
const talkTargetSelected = ref('')

// 远程搜索谈话对象
async function remoteSearchTalkTarget(query) {
  if (query) {
    talkTargetLoading.value = true
    try {
      // 判断输入是否为纯数字（罪犯编号）
      const isPrisonerNo = /^\d+$/.test(query)
      const params = {
        current: 1,
        size: 99
      }

      // 根据输入类型设置不同的查询参数
      if (isPrisonerNo) {
        params.prisonerNo = query
      } else {
        params.prisonerName = query
      }
      params.oortDepcode = store.userInfo?.oort_depcode || ''
      const response = await getPrisonerList(params)
      if (response && response.code === 200 && response.data) {
        talkTargetOptions.value = response.data.records.map(item => ({
          oort_code: item.prisonerNo,
          oort_name: item.prisonerName
        }))
        // 更新编码到名称的映射
        talkTargetOptions.value.forEach(item => {
          talkTargetMap.value[item.oort_code] = item.oort_name
        })
      } else {
        ElMessage.error('获取谈话对象列表失败!')
        talkTargetOptions.value = []
      }
    } catch (error) {
      ElMessage.error('获取谈话对象列表失败！')
      talkTargetOptions.value = []
    } finally {
      talkTargetLoading.value = false
    }
  } else {
    talkTargetOptions.value = []
  }
}

// 处理谈话对象选择变化
function handleTalkTargetChange(value) {
  if (value) {
    talkForm.value.talkTarget = talkTargetMap.value[value] || value
    talkForm.value.prisonerCode = value
    talkForm.value.prisonerType = talkTargetMap.value[value]?.prisonerType || ''
  } else {
    talkForm.value.talkTarget = ''
    talkForm.value.prisonerCode = ''
    talkForm.value.prisonerType = ''
  }
}

const emit = defineEmits(['startTalk'])
const talkFormRef = ref(null)
async function confirmStartTalk() {
  talkFormRef.value.validate(async(valid) => {
    if (valid) {
      try {
        const params = {
          prisonerName: talkForm.value.talkTarget,
          prisonerCode: talkForm.value.prisonerCode,
          policeName: talkForm.value.policeName,
          policeCode: talkForm.value.policeCode || store.userInfo?.oort_code,
          talkType: talkForm.value.talkType,
          theme: talkForm.value.theme,
          place: talkForm.value.place,
          escortPolice: talkForm.value.escortPolice,
          escortPoliceCode: talkForm.value.escortPoliceCode,
          department: talkForm.value.department,
          departmentCode: talkForm.value.departmentCode,
          prisonerType: talkForm.value.prisonerType,
          createBy: store.userInfo?.oort_name || '',
          planId: talkForm.value.planId
        }

        // 调用开始谈话API
        const response = await startTalk(params)
        // 模拟API响应
        //  const response = { code: 200, data: '01d3402c595787ca5c498aca54243032' }

        if (response.code === 200) {
          ElMessage.success('开始谈话!')
          emit('startTalk', response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
  })
}

if (props.data) {
  policeNameOptions.value = [{ oort_name: props.data.policeName, oort_code: props.data.policeNo }]
  policeNameSelected.value = props.data.policeNo
  talkTargetOptions.value = [{ oort_name: props.data.prisonerName, oort_code: props.data.prisonerNo }]
  talkTargetSelected.value = { oort_name: props.data.prisonerName, oort_code: props.data.prisonerNo }
  talkForm.value.talkTarget = props.data.prisonerName

  talkForm.value.prisonerCode = props.data.prisonerNo
  talkForm.value.policeName = props.data.policeName
  talkForm.value.policeCode = props.data.policeNo

  talkForm.value.policeNo = props.data.prisonerName
  talkForm.value.planId = props.data.id
  talkForm.value.department = props.data.oortDepname
  talkForm.value.departmentCode = props.data.oortDepcode
}

onMounted(async() => {
  await fetchDepartmentOptions()
  // 获取谈话类型
  await fetchTalkTypes()
})

</script>
<style lang="scss" scoped>
.dialog-content {
  padding: 20px;
}

.dialog_buttons {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 20px;
  .el-button {
    margin-left: 10px;
  }
}
</style>
