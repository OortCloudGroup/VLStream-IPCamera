<template>
  <div class="dictionary-container">
    <!-- 搜索表单：优化字段，匹配后端 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="姓名">
        <el-input v-model="searchForm.xm" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="所属监狱">
        <el-select v-model="searchForm.sysOrgCode" placeholder="请选择所属监狱">
          <el-option label="第一监狱" value="JY001" />
          <el-option label="第二监狱" value="JY002" />
        </el-select>
      </el-form-item>
      <el-form-item label="罪名">
        <el-input v-model="searchForm.accusalNames" placeholder="请输入罪名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          查询
        </el-button>
        <el-button @click="resetSearch">
          重置
        </el-button>
        <el-button type="primary" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格：补充后端核心字段 -->
    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="zfbh" label="罪犯编号" align="center" min-width="120" />
        <el-table-column prop="xm" label="姓名" align="center" />
        <el-table-column prop="sexName" label="性别" align="center" width="80" />
        <el-table-column prop="sysOrgName" label="所属监狱" align="center" min-width="100" />
        <el-table-column prop="sysPermName" label="所属监区" align="center" min-width="100" />
        <el-table-column prop="accusalNames" label="罪名" align="center" min-width="120" />
        <el-table-column prop="dqxq" label="当前刑期" align="center" width="100" />
        <el-table-column prop="createTime" label="创建时间" align="center" min-width="180" />
        <el-table-column label="操作" width="280" align="center">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页：保留原有逻辑 -->
      <div class="pagination">
        <el-pagination
          :current-page="pagination.current"
          :page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 新增/编辑对话框：全面匹配后端字段 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
      :close-on-click-modal="false"
      destroy-on-close
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="150px"
        class="dialog-form"
        size="default"
      >
        <!-- 第一行：核心标识 -->
        <div class="form-row">
          <el-form-item label="姓名" prop="xm">
            <el-input v-model="form.xm" placeholder="请输入姓名" maxlength="20" />
          </el-form-item>
        </div>

        <!-- 第二行：基础信息 -->
        <div class="form-row">
          <el-form-item label="性别" prop="sexCode">
            <el-select v-model="form.sexCode" placeholder="请选择性别" @change="handleSexChange">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="prisonerAge">
            <el-input-number v-model="form.prisonerAge" :min="18" :max="100" placeholder="请输入年龄" />
          </el-form-item>
        </div>

        <!-- 第三行：证件信息 -->
        <div class="form-row">
          <el-form-item label="证件类型" prop="zjlxCode">
            <el-select v-model="form.zjlxCode" placeholder="请选择证件类型" @change="handleZjlxChange">
              <el-option label="身份证" value="01" />
              <el-option label="护照" value="02" />
              <el-option label="其他" value="99" />
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码" prop="zjhm">
            <el-input v-model="form.zjhm" placeholder="请输入证件号码" maxlength="30" />
          </el-form-item>
        </div>

        <!-- 第四行：所属机构 -->
        <div class="form-row">
          <el-form-item label="所属监狱" prop="sysOrgCode">
            <el-select v-model="form.sysOrgCode" placeholder="请选择所属监狱" @change="handleSysOrgChange">
              <el-option label="第一监狱" value="JY001" />
              <el-option label="第二监狱" value="JY002" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属监区" prop="sysPermCode">
            <el-select v-model="form.sysPermCode" placeholder="请选择所属监区" @change="handleSysPermChange">
              <el-option label="一监区" value="JQ001" />
              <el-option label="二监区" value="JQ002" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 第五行：民族+国籍 -->
        <div class="form-row">
          <el-form-item label="民族" prop="mzCode">
            <el-select v-model="form.mzCode" placeholder="请选择民族" @change="handleMzChange">
              <el-option label="汉族" value="01" />
              <el-option label="回族" value="02" />
              <el-option label="满族" value="03" />
            </el-select>
          </el-form-item>
          <el-form-item label="国籍" prop="gjCode">
            <el-select v-model="form.gjCode" placeholder="请选择国籍" @change="handleGjChange">
              <el-option label="中国" value="01" />
              <el-option label="外国" value="02" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 第六行：刑期信息 -->
        <div class="form-row">
          <el-form-item label="当前刑期" prop="dqxq">
            <el-input v-model="form.dqxq" placeholder="如：10年" maxlength="20" />
          </el-form-item>
          <el-form-item label="剩余刑期" prop="yx">
            <el-input v-model="form.yx" placeholder="如：5年6个月" maxlength="20" />
          </el-form-item>
        </div>

        <!-- 第七行：刑期日期 -->
        <div class="form-row">
          <el-form-item label="刑期起日" prop="dqxqqr">
            <el-date-picker
              v-model="form.dqxqqr"
              type="date"
              placeholder="请选择刑期起日"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="刑期止日" prop="dqxqzr">
            <el-date-picker
              v-model="form.dqxqzr"
              type="date"
              placeholder="请选择刑期止日"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </div>

        <!-- 第八行：入监日期+在押现状 -->
        <div class="form-row">
          <el-form-item label="入监日期" prop="rjrq">
            <el-date-picker
              v-model="form.rjrq"
              type="date"
              placeholder="请选择入监日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="在押现状" prop="zyxzCode">
            <el-select v-model="form.zyxzCode" placeholder="请选择在押现状" @change="handleZyxzChange">
              <el-option label="在押" value="01" />
              <el-option label="暂离" value="02" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 第九行：罪名+处遇等级 -->
        <div class="form-row">
          <el-form-item label="罪名" prop="accusalCodes">
            <el-select v-model="form.accusalCodes" placeholder="请选择罪名" multiple @change="handleAccusalChange">
              <el-option label="盗窃罪" value="01" />
              <el-option label="故意伤害罪" value="02" />
              <el-option label="抢劫罪" value="03" />
            </el-select>
          </el-form-item>
          <el-form-item label="处遇等级" prop="cydjCode">
            <el-select v-model="form.cydjCode" placeholder="请选择处遇等级" @change="handleCydjChange">
              <el-option label="A级" value="01" />
              <el-option label="B级" value="02" />
              <el-option label="C级" value="03" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 第十行：户籍+监舍床位 -->
        <div class="form-row">
          <el-form-item label="户籍所在地" prop="hjProvincecode">
            <el-select v-model="form.hjProvincecode" placeholder="请选择户籍所在地" @change="handleHjChange">
              <el-option label="北京市" value="110000" />
              <el-option label="上海市" value="310000" />
              <el-option label="广东省" value="440000" />
            </el-select>
          </el-form-item>
          <el-form-item label="监舍/床位号" prop="jsh">
            <el-input v-model="form.jsh" placeholder="监舍号" maxlength="10" style="width: 48%" />
            <el-input v-model="form.cwh" placeholder="床位号" maxlength="5" style="width: 48%; margin-left: 4%" />
          </el-form-item>
        </div>

        <!-- 第十一行：民警信息+重点罪犯 -->
        <div class="form-row">
          <el-form-item label="主管民警" prop="zgmjxm">
            <el-input v-model="form.zgmjxm" placeholder="姓名" maxlength="20" style="width: 48%" />
            <el-input v-model="form.zgmjjh" placeholder="编号" maxlength="20" style="width: 48%; margin-left: 4%" />
          </el-form-item>
          <el-form-item label="重点罪犯标识" prop="zdzfCode">
            <el-select v-model="form.zdzfCode" placeholder="请选择" @change="handleZdzfChange">
              <el-option label="重点罪犯" value="01" />
              <el-option label="普通罪犯" value="02" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 第十二行：照片+排序 -->
        <div class="form-row">
          <el-form-item label="罪犯照片" prop="prisonerImg">
            <el-upload
              v-model:file-list="fileList"
              action="/api/upload"
              list-type="picture-card"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
            >
              <div><el-icon><Plus /></el-icon></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="排序" prop="sortOrder">
            <el-input-number v-model="form.sortOrder" :min="0" placeholder="请输入排序值" />
          </el-form-item>
        </div>
      </el-form>

      <!-- 底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElUpload } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, UploadFile, UploadProps } from 'element-plus'
import {
  prisonerInfoSave, prisonerInfoUpdate, prisonerInfoRemove, prisonerInfoList
} from '@/api/mobileeducationplatform/case'

// ===================== 核心修改1：完善表单模型（匹配后端所有字段） =====================
// 搜索表单（优化字段）
const searchForm = reactive({
  xm: '', // 姓名
  sysOrgCode: '', // 所属监狱code
  accusalNames: '' // 罪名
})

// 核心表单（1:1匹配后端Java实体类）
const form = reactive({
  // 主键/基础字段
  id: undefined, // 主键id
  zfbh: '', // 罪犯编号（主键）
  xm: '', // 姓名
  // 关联code/name字段
  sexCode: '', // 性别code
  sexName: '', // 性别名称
  mzCode: '', // 民族code
  mzName: '', // 民族名称
  zjlxCode: '', // 证件类型code
  zjlxName: '', // 证件类型名称
  sysOrgCode: '', // 所属监狱code
  sysOrgName: '', // 所属监狱名称
  sysPermCode: '', // 所属监区code
  sysPermName: '', // 所属监区名称
  zyxzCode: '', // 在押现状code
  zyxzName: '', // 在押现状名称
  cydjCode: '', // 处遇等级code
  cydjName: '', // 处遇等级名称
  hjProvincecode: '', // 户籍所在地code
  hjProvincename: '', // 户籍所在地名称
  gjCode: '', // 国籍code
  gjName: '', // 国籍名称
  zdzfCode: '', // 重点罪犯标识code
  zdzfName: '', // 重点罪犯名称
  // 基础信息
  prisonerAge: undefined, // 罪犯年龄（Integer）
  zjhm: '', // 证件号码
  csrq: '', // 出生日期（LocalDate）
  // 刑期信息
  dqxq: '', // 当前刑期
  yx: '', // 剩余刑期
  dqxqqr: '', // 当前刑期起日（LocalDate）
  dqxqzr: '', // 当前刑期止日（LocalDate）
  rjrq: '', // 入监日期（LocalDate）
  // 罪名
  accusalCodes: [], // 罪名code（多选）
  accusalNames: '', // 罪名名称
  // 监舍/床位
  jsh: '', // 监舍号
  cwh: '', // 床位号
  // 民警信息
  zgmjxm: '', // 主管民警姓名
  zgmjjh: '', // 主管民警编号
  // 照片
  prisonerImg: '', // 罪犯照片路径
  zpUpdateTime: '', // 罪犯照片更新时间
  // 系统字段（后端自动生成）
  createTime: '', // 创建时间
  createBy: '', // 创建人
  updateTime: '', // 更新时间
  updateBy: '', // 更新人
  isDeleted: false, // 是否删除
  // 排序
  sortOrder: 0 // 排序
})

// ===================== 核心修改2：补充响应式变量 =====================
// 表格数据
const tableData = ref([])
// 分页配置
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})
// 对话框控制
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
// 上传文件列表
const fileList = ref<UploadFile[]>([])

// ===================== 核心修改3：完善表单校验规则 =====================
const rules = reactive({
  xm: [{ required: true, message: '请输入姓名', trigger: 'blur' }, { max: 20, message: '姓名长度不超过20字符', trigger: 'blur' }],
  sexCode: [{ required: true, message: '请选择性别', trigger: 'change' }],
  prisonerAge: [{ type: 'number', min: 18, max: 100, message: '年龄需在18-100之间', trigger: 'blur' }],
  zjlxCode: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  zjhm: [{ required: true, message: '请输入证件号码', trigger: 'blur' }, { max: 30, message: '证件号码长度不超过30字符', trigger: 'blur' }],
  sysOrgCode: [{ required: true, message: '请选择所属监狱', trigger: 'change' }],
  sysPermCode: [{ required: true, message: '请选择所属监区', trigger: 'change' }],
  dqxqqr: [{ required: true, message: '请选择刑期起日', trigger: 'change' }],
  dqxqzr: [{ required: true, message: '请选择刑期止日', trigger: 'change' }],
  accusalCodes: [{ required: true, message: '请选择至少一个罪名', trigger: 'change' }]
})

// ===================== 核心修改4：完善方法逻辑 =====================
// 初始化数据
onMounted(async() => {
  await loadTableData()
})

// 加载表格数据（优化参数，匹配后端）
const loadTableData = async() => {
  try {
    const params = {
      current: pagination.current,
      size: pagination.size,
      xm: searchForm.xm || undefined,
      sysOrgCode: searchForm.sysOrgCode || undefined,
      accusalNames: searchForm.accusalNames || undefined
    }
    const response = await prisonerInfoList(params)
    if (response.code === 200) {
      tableData.value = response.data.records
      pagination.total = response.data.total
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  loadTableData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.xm = ''
  searchForm.sysOrgCode = ''
  searchForm.accusalNames = ''
  handleSearch()
}

// 新增方法（完整重置所有字段）
const handleAdd = () => {
  dialogTitle.value = '新增罪犯信息'
  // 重置所有表单字段
  form.zfbh = ''
  form.xm = ''
  // code/name字段重置
  form.sexCode = ''; form.sexName = ''
  form.mzCode = ''; form.mzName = ''
  form.zjlxCode = ''; form.zjlxName = ''
  form.sysOrgCode = ''; form.sysOrgName = ''
  form.sysPermCode = ''; form.sysPermName = ''
  form.zyxzCode = ''; form.zyxzName = ''
  form.cydjCode = ''; form.cydjName = ''
  form.hjProvincecode = ''; form.hjProvincename = ''
  form.gjCode = ''; form.gjName = ''
  form.zdzfCode = ''; form.zdzfName = ''
  // 基础信息
  form.prisonerAge = undefined
  form.zjhm = ''
  form.csrq = ''
  // 刑期信息
  form.dqxq = ''; form.yx = ''
  form.dqxqqr = ''; form.dqxqzr = ''; form.rjrq = ''
  // 罪名
  form.accusalCodes = []; form.accusalNames = ''
  // 监舍/床位
  form.jsh = ''; form.cwh = ''
  // 民警信息
  form.zgmjxm = ''; form.zgmjjh = ''
  // 照片
  form.prisonerImg = ''; form.zpUpdateTime = ''
  // 系统字段
  form.createTime = ''; form.createBy = ''
  form.updateTime = ''; form.updateBy = ''
  form.isDeleted = false
  // 排序
  form.sortOrder = 0

  // 重置上传文件列表
  fileList.value = []
  // 打开对话框
  nextTick(() => {
    formRef.value?.clearValidate()
    dialogVisible.value = true
  })
}

// 编辑方法（完整赋值，匹配后端字段）
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑罪犯信息'
  // 基础字段
  form.id = row.id
  form.zfbh = row.zfbh || ''
  form.xm = row.xm || ''
  // code/name字段赋值
  form.sexCode = row.sexCode || ''; form.sexName = row.sexName || ''
  form.mzCode = row.mzCode || ''; form.mzName = row.mzName || ''
  form.zjlxCode = row.zjlxCode || ''; form.zjlxName = row.zjlxName || ''
  form.sysOrgCode = row.sysOrgCode || ''; form.sysOrgName = row.sysOrgName || ''
  form.sysPermCode = row.sysPermCode || ''; form.sysPermName = row.sysPermName || ''
  form.zyxzCode = row.zyxzCode || ''; form.zyxzName = row.zyxzName || ''
  form.cydjCode = row.cydjCode || ''; form.cydjName = row.cydjName || ''
  form.hjProvincecode = row.hjProvincecode || ''; form.hjProvincename = row.hjProvincename || ''
  form.gjCode = row.gjCode || ''; form.gjName = row.gjName || ''
  form.zdzfCode = row.zdzfCode || ''; form.zdzfName = row.zdzfName || ''
  // 基础信息
  form.prisonerAge = row.prisonerAge || undefined
  form.zjhm = row.zjhm || ''
  form.csrq = row.csrq || ''
  // 刑期信息
  form.dqxq = row.dqxq || ''; form.yx = row.yx || ''
  form.dqxqqr = row.dqxqqr || ''; form.dqxqzr = row.dqxqzr || ''; form.rjrq = row.rjrq || ''
  // 罪名（字符串转数组）
  form.accusalCodes = row.accusalCodes ? row.accusalCodes.split(',') : []
  form.accusalNames = row.accusalNames || ''
  // 监舍/床位
  form.jsh = row.jsh || ''; form.cwh = row.cwh || ''
  // 民警信息
  form.zgmjxm = row.zgmjxm || ''; form.zgmjjh = row.zgmjjh || ''
  // 照片
  form.prisonerImg = row.prisonerImg || ''; form.zpUpdateTime = row.zpUpdateTime || ''
  // 系统字段
  form.createTime = row.createTime || ''; form.createBy = row.createBy || ''
  form.updateTime = row.updateTime || ''; form.updateBy = row.updateBy || ''
  form.isDeleted = row.isDeleted || false
  // 排序
  form.sortOrder = row.sortOrder || 0

  // 初始化上传文件列表
  if (form.prisonerImg) {
    fileList.value = [{ url: form.prisonerImg, name: '罪犯照片' }]
  } else {
    fileList.value = []
  }

  // 打开对话框
  nextTick(() => {
    formRef.value?.clearValidate()
    dialogVisible.value = true
  })
}

// 对话框关闭事件
const handleDialogClose = () => {
  dialogVisible.value = false
  nextTick(() => {
    formRef.value?.resetFields()
    fileList.value = []
  })
}

// 删除方法（优化提示）
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该罪犯信息吗？此操作不可恢复！',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async() => {
    try {
      let data = {
        ids: row.zfbh // 关键：用params传query参数，且ids是数组格式
      }
      const formD = new FormData()
      for (let key in data) {
        if (data[key]) formD.append(key, data[key])
      }
      const response = await prisonerInfoRemove(formD)
      if (response.code === 200) {
        ElMessage.success('删除成功')
        loadTableData()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 分页事件
const handlePageChange = (page: number) => {
  pagination.current = page
  loadTableData()
}
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  loadTableData()
}

// ===================== 核心修改5：code/name联动方法 =====================
// 性别选择联动
const handleSexChange = (val: string) => {
  form.sexName = val === '1' ? '男' : val === '2' ? '女' : ''
}
// 证件类型联动
const handleZjlxChange = (val: string) => {
  const map = { '01': '身份证', '02': '护照', '99': '其他' }
  form.zjlxName = map[val] || ''
}
// 所属监狱联动
const handleSysOrgChange = (val: string) => {
  const map = { 'JY001': '第一监狱', 'JY002': '第二监狱' }
  form.sysOrgName = map[val] || ''
}
// 所属监区联动
const handleSysPermChange = (val: string) => {
  const map = { 'JQ001': '一监区', 'JQ002': '二监区' }
  form.sysPermName = map[val] || ''
}
// 民族联动
const handleMzChange = (val: string) => {
  const map = { '01': '汉族', '02': '回族', '03': '满族' }
  form.mzName = map[val] || ''
}
// 国籍联动
const handleGjChange = (val: string) => {
  const map = { '01': '中国', '02': '外国' }
  form.gjName = map[val] || ''
}
// 在押现状联动
const handleZyxzChange = (val: string) => {
  const map = { '01': '在押', '02': '暂离' }
  form.zyxzName = map[val] || ''
}
// 处遇等级联动
const handleCydjChange = (val: string) => {
  const map = { '01': 'A级', '02': 'B级', '03': 'C级' }
  form.cydjName = map[val] || ''
}
// 户籍联动
const handleHjChange = (val: string) => {
  const map = { '110000': '北京市', '310000': '上海市', '440000': '广东省' }
  form.hjProvincename = map[val] || ''
}
// 重点罪犯联动
const handleZdzfChange = (val: string) => {
  const map = { '01': '重点罪犯', '02': '普通罪犯' }
  form.zdzfName = map[val] || ''
}
// 罪名联动（多选）
const handleAccusalChange = (vals: string[]) => {
  const map = { '01': '盗窃罪', '02': '故意伤害罪', '03': '抢劫罪' }
  form.accusalNames = vals.map(v => map[v]).join(',')
}

// ===================== 核心修改6：文件上传方法 =====================
// 上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) {
    ElMessage.error('只能上传图片格式！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB！')
    return false
  }
  return true
}
// 上传成功回调
const handleUploadSuccess = (response: any) => {
  if (response.code === 200) {
    form.prisonerImg = response.data.url
    form.zpUpdateTime = new Date().toLocaleString()
    ElMessage.success('照片上传成功')
  } else {
    ElMessage.error('照片上传失败')
  }
}

// ===================== 核心修改7：提交方法（适配后端字段） =====================
const handleSubmit = async() => {
  if (!formRef.value) return
  try {
    // 表单校验
    await formRef.value.validate()

    // 构造提交数据（适配后端格式）
    const submitData = {
      ...form,
      // 多选罪名转字符串
      accusalCodes: form.accusalCodes.join(','),
      // 年龄转数字
      prisonerAge: form.prisonerAge ? Number(form.prisonerAge) : undefined,
      // isDeleted转数字
      isDeleted: form.isDeleted ? 1 : 0
    }

    // 调用接口
    const api = form.zfbh ? prisonerInfoUpdate : prisonerInfoSave
    const response = await api(submitData)
    if (response.code === 200) {
      ElMessage.success(form.zfbh ? '编辑成功' : '新增成功')
      dialogVisible.value = false
      loadTableData()
    }
  } catch (error) {
    console.error('提交失败：', error)
  }
}
</script>

<style lang="scss" scoped>
.dictionary-container {
  padding: 20px;
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .search-form {
    margin-bottom: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 4px;

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 20px;

      .el-input,
      .el-select {
        width: 220px;
      }
    }

    .el-button {
      margin-left: 10px;
    }
  }

  .table-container {
    padding: 0 20px;

    :deep(.el-table) {
      border-radius: 4px;

      th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 500;
        padding: 12px 0;
      }

      td {
        padding: 12px 0;
      }
    }

    .el-button {
      margin: 0 5px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
  }
}

:deep(.el-dialog) {
  border-radius: 8px;

  .el-dialog__header {
    padding: 20px;
    margin: 0;
    border-bottom: 1px solid #dcdfe6;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }

  .el-dialog__body {
    padding: 30px 20px;
  }

  .dialog-form {
    .el-form-item {
      margin-bottom: 22px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .el-input,
    .el-select,
    :deep(.el-input-number) {
      width: 100%;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 10px;
  }
}
</style>
