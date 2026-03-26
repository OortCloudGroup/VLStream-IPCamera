<template>
  <div class="info-setting">
    <div class="form-section">
      <div class="section-title">
        <span class="line" />
        <span>个人信息</span>
      </div>
      <el-form :model="userL" class="custom-form">
        <el-form-item label="头像">
          <div class="box_l">
            <oort-img :src="userL.avatar" class="avatar" default-img="tx" />
          </div>
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showAvatar" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('avatar', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userL.name" placeholder="输入姓名" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showName" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('name', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="userL.idCard" placeholder="输入身份证" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showIdCard" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('idCard', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userL.gender" class="box_l" disabled>
            <el-radio label="男">
              男
            </el-radio>
            <el-radio label="女">
              女
            </el-radio>
            <el-radio label="">
              未知
            </el-radio>
          </el-radio-group>
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showGender" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('gender', falg)" />
          </div>
        </el-form-item>
      </el-form>
      <!-- 基本信息部分的自定义字段 -->
      <el-form v-if="basicInfoCustomFields.length > 0" :model="userL" class="custom-form">
        <draggable
          tag="div"
          :list="basicInfoCustomFields"
          item-key="field_key"
          ghost-class="ghost"
          @end="onBasicInfoCustomFieldDragEnd"
        >
          <template #item="{ element: field }">
            <div class="row_col">
              <el-form-item v-if="field.data_type==='boolean'">
                <template #label>
                  <div class="label-wrapper">
                    <el-tooltip content="该字段为自定义字段，可拖拽排序" placement="top">
                      <div
                        class="drag-handle"
                        draggable="true"
                        @dragstart="handleDragStart"
                        @dragend="handleDragEnd"
                      >
                        <oort-svg-icon
                          color="#666"
                          width="20"
                          height="20"
                          name="container1"
                          class="container_svg"
                        />
                      </div>
                    </el-tooltip>
                    <span class="field-label">{{ field.label }}</span>
                    <el-tooltip content="该字段为自定义字段，可按需启用或删除" placement="top">
                      <el-icon class="info-icon">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-switch
                  v-model="userL[field.field_key]"
                  :placeholder="`请输入${field.label}`"
                  class="input box_l"
                  disabled
                  :active-value="true"
                  :inactive-value="false"
                />
                <div class="box_r">
                  <span class="switch-text">终端显示</span>
                  <el-switch v-model="field.is_show" :active-value="1" :inactive-value="0" active-color="#1976FF" class="switch-label" @change="falg => { handleCustomFieldShowChange(field.field_key, falg === 1); emit('update-custom-fields', getAllCustomFields()) }" />
                </div>
              </el-form-item>
              <el-form-item v-else>
                <template #label>
                  <div class="label-wrapper">
                    <el-tooltip content="该字段为自定义字段，可拖拽排序" placement="top">
                      <div
                        class="drag-handle"
                        draggable="true"
                        @dragstart="handleDragStart"
                        @dragend="handleDragEnd"
                      >
                        <oort-svg-icon
                          color="#666"
                          width="20"
                          height="20"
                          name="container1"
                          class="container_svg"
                        />
                      </div>
                    </el-tooltip>
                    <span class="field-label">{{ field.label }}</span>
                    <el-tooltip content="该字段为自定义字段，可按需启用或删除" placement="top">
                      <el-icon class="info-icon">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-input v-model="userL[field.field_key]" :placeholder="`请输入${field.label}`" class="input box_l" disabled />
                <div class="box_r">
                  <span class="switch-text">终端显示</span>
                  <el-switch v-model="field.is_show" :active-value="1" :inactive-value="0" active-color="#1976FF" class="switch-label" @change="falg => { handleCustomFieldShowChange(field.field_key, falg === 1); emit('update-custom-fields', getAllCustomFields()) }" />
                </div>
              </el-form-item>
              <oort-svg-icon
                name="table_edit"
                width="16"
                height="16"
                class="btn_icon"
                @click="handle(field)"
              />
              <oort-svg-icon
                name="delete"
                width="16"
                height="16"
                class="btn_icon"
                @click="del(field)"
              />
            </div>
          </template>
        </draggable>
      </el-form>
      <div class="add-custom-field-btn" @click="handle('', 'basicInfo')">
        <oort-svg-icon name="table_add" width="16" height="16" class="add-icon" />
        <span>添加自定义字段</span>
      </div>
      <div class="section-title">
        <span class="line" />
        <span>账号信息</span>
      </div>
      <el-form :model="userL" label-width="120px" class="custom-form">
        <el-form-item label="登陆账号">
          <el-input v-model="userL.loginAccount" placeholder="请输入登陆账号" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showLoginAccount" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('loginAccount', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="userL.oort_phone" placeholder="请输入手机号码" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showPhone" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_phone', falg)" />
          </div>
        </el-form-item>
        <!--        <el-form-item label="用户名">-->
        <!--          <el-input v-model="userL.oort_username" placeholder="请输入用户名" class="input box_l" disabled />-->
        <!--          <div class="box_r">-->
        <!--            <span class="switch-text">终端显示</span>-->
        <!--            <el-switch v-model="userL.showUserName" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_username', falg)" />-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <el-form-item label="用户编号">
          <el-input v-model="userL.userId" placeholder="请输入用户编号" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showUserId" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('userId', falg)" />
          </div>
        </el-form-item>
        <!--        <el-form-item label="用户状态">-->
        <!--          <el-radio-group v-model="userL.oort_status" class="box_l" disabled>-->
        <!--            <el-radio label="启用">-->
        <!--              启用-->
        <!--            </el-radio>-->
        <!--            <el-radio label="禁用">-->
        <!--              禁用-->
        <!--            </el-radio>-->
        <!--          </el-radio-group>-->
        <!--          <div class="box_r">-->
        <!--            <span class="switch-text">终端显示</span>-->
        <!--            <el-switch v-model="userL.showStatus" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_status', falg)" />-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <el-form-item label="所属部门">
          <el-input v-model="userL.dept" placeholder="请输入所属部门" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showDept" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('dept', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="部门编号">
          <el-input v-model="userL.deptId" placeholder="请输入部门编号" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showDeptId" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('deptId', falg)" />
          </div>
        </el-form-item>
      </el-form>
      <!-- 账号信息部分的自定义字段 -->
      <el-form v-if="accountInfoCustomFields.length > 0" :model="userL" label-width="120px" class="custom-form">
        <draggable
          tag="div"
          :list="accountInfoCustomFields"
          item-key="field_key"
          ghost-class="ghost"
          @end="onAccountInfoCustomFieldDragEnd"
        >
          <template #item="{ element: field }">
            <div class="row_col">
              <el-form-item v-if="field.data_type==='boolean'">
                <template #label>
                  <div class="label-wrapper">
                    <el-tooltip content="该字段为自定义字段，可拖拽排序" placement="top">
                      <div
                        class="drag-handle"
                        draggable="true"
                        @dragstart="handleDragStart"
                        @dragend="handleDragEnd"
                      >
                        <oort-svg-icon
                          color="#666"
                          width="20"
                          height="20"
                          name="container1"
                          class="container_svg"
                        />
                      </div>
                    </el-tooltip>
                    <span class="field-label">{{ field.label }}</span>
                    <el-tooltip content="该字段为自定义字段，可按需启用或删除" placement="top">
                      <el-icon class="info-icon">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-switch
                  v-model="userL[field.field_key]"
                  :placeholder="`请输入${field.label}`"
                  class="input box_l"
                  disabled
                  :active-value="true"
                  :inactive-value="false"
                />
                <div class="box_r">
                  <span class="switch-text">终端显示</span>
                  <el-switch v-model="field.is_show" :active-value="1" :inactive-value="0" active-color="#1976FF" class="switch-label" @change="falg => { handleCustomFieldShowChange(field.field_key, falg === 1); emit('update-custom-fields', getAllCustomFields()) }" />
                </div>
              </el-form-item>
              <el-form-item v-else>
                <template #label>
                  <div class="label-wrapper">
                    <el-tooltip content="该字段为自定义字段，可拖拽排序" placement="top">
                      <div
                        class="drag-handle"
                        draggable="true"
                        @dragstart="handleDragStart"
                        @dragend="handleDragEnd"
                      >
                        <oort-svg-icon
                          color="#666"
                          width="20"
                          height="20"
                          name="container1"
                          class="container_svg"
                        />
                      </div>
                    </el-tooltip>
                    <span class="field-label">{{ field.label }}</span>
                    <el-tooltip content="该字段为自定义字段，可按需启用或删除" placement="top">
                      <el-icon class="info-icon">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-input v-model="userL[field.field_key]" :placeholder="`请输入${field.label}`" class="input box_l" disabled />
                <div class="box_r">
                  <span class="switch-text">终端显示</span>
                  <el-switch v-model="field.is_show" :active-value="1" :inactive-value="0" active-color="#1976FF" class="switch-label" @change="falg => { handleCustomFieldShowChange(field.field_key, falg === 1); emit('update-custom-fields', getAllCustomFields()) }" />
                </div>
              </el-form-item>
              <oort-svg-icon
                name="table_edit"
                width="16"
                height="16"
                class="btn_icon"
                @click="handle(field)"
              />
              <oort-svg-icon
                name="delete"
                width="16"
                height="16"
                class="btn_icon"
                @click="del(field)"
              />
            </div>
          </template>
        </draggable>
      </el-form>
      <div class="add-custom-field-btn" @click="handle('', 'accountInfo')">
        <oort-svg-icon name="table_add" width="16" height="16" class="add-icon" />
        <span>添加自定义字段</span>
      </div>
      <div class="section-title">
        <span class="line" />
        <span>联系信息</span>
      </div>
      <el-form :model="userL" label-width="120px" class="custom-form">
        <el-form-item label="用户邮箱">
          <el-input v-model="userL.oort_email" placeholder="请输入用户邮箱" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showEmail" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_email', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="办公室门号">
          <el-input v-model="userL.oort_office" placeholder="请输入办公室门号" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showOffice" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_office', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="办公号码">
          <el-input v-model="userL.officePhone" placeholder="请输入办公号码" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showOfficePhone" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('officePhone', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="私有号码">
          <el-input v-model="userL.privatePhone" placeholder="请输入私有号码" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showPrivatePhone" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('privatePhone', falg)" />
          </div>
        </el-form-item>
        <!--        <el-form-item label="钉钉">-->
        <!--          <el-input v-model="userL.oort_dingding" placeholder="请输入钉钉" class="input box_l" disabled />-->
        <!--          <div class="box_r">-->
        <!--            <span class="switch-text">终端显示</span>-->
        <!--            <el-switch v-model="userL.showDingding" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_dingding', falg)" />-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="微信">-->
        <!--          <el-input v-model="userL.oort_weixin" placeholder="请输入微信" class="input box_l" disabled />-->
        <!--          <div class="box_r">-->
        <!--            <span class="switch-text">终端显示</span>-->
        <!--            <el-switch v-model="userL.showWeixin" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_weixin', falg)" />-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="区域">-->
        <!--          <el-input v-model="userL.oort_area" placeholder="请输入区域" class="input box_l" disabled />-->
        <!--          <div class="box_r">-->
        <!--            <span class="switch-text">终端显示</span>-->
        <!--            <el-switch v-model="userL.showArea" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_area', falg)" />-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="地址">-->
        <!--          <el-input v-model="userL.oort_address" placeholder="请输入地址" class="input box_l" disabled />-->
        <!--          <div class="box_r">-->
        <!--            <span class="switch-text">终端显示</span>-->
        <!--            <el-switch v-model="userL.showAddress" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_address', falg)" />-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="邮编">-->
        <!--          <el-input v-model="userL.oort_postcode" placeholder="请输入邮编" class="input box_l" disabled />-->
        <!--          <div class="box_r">-->
        <!--            <span class="switch-text">终端显示</span>-->
        <!--            <el-switch v-model="userL.showPostCode" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_postcode', falg)" />-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <el-form-item label="岗位">
          <el-input v-model="userL.position" placeholder="请输入岗位" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showPosition" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('position', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="userL.job" placeholder="请输入职位" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showJob" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('job', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="userL.oort_remark" placeholder="请输入备注" class="input box_l" type="textarea" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showRemark" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_remark', falg)" />
          </div>
        </el-form-item>
      </el-form>
      <!-- 联系信息部分的自定义字段 -->
      <el-form v-if="contactInfoCustomFields.length > 0" :model="userL" label-width="120px" class="custom-form">
        <draggable
          tag="div"
          :list="contactInfoCustomFields"
          item-key="field_key"
          ghost-class="ghost"
          @end="onContactInfoCustomFieldDragEnd"
        >
          <template #item="{ element: field }">
            <div class="row_col">
              <el-form-item v-if="field.data_type==='boolean'">
                <template #label>
                  <div class="label-wrapper">
                    <el-tooltip content="该字段为自定义字段，可拖拽排序" placement="top">
                      <div
                        class="drag-handle"
                        draggable="true"
                        @dragstart="handleDragStart"
                        @dragend="handleDragEnd"
                      >
                        <oort-svg-icon
                          color="#666"
                          width="20"
                          height="20"
                          name="container1"
                          class="container_svg"
                        />
                      </div>
                    </el-tooltip>
                    <span class="field-label">{{ field.label }}</span>
                    <el-tooltip content="该字段为自定义字段，可按需启用或删除" placement="top">
                      <el-icon class="info-icon">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-switch
                  v-model="userL[field.field_key]"
                  :placeholder="`请输入${field.label}`"
                  class="input box_l"
                  disabled
                  :active-value="true"
                  :inactive-value="false"
                />
                <div class="box_r">
                  <span class="switch-text">终端显示</span>
                  <el-switch v-model="field.is_show" :active-value="1" :inactive-value="0" active-color="#1976FF" class="switch-label" @change="falg => { handleCustomFieldShowChange(field.field_key, falg === 1); emit('update-custom-fields', getAllCustomFields()) }" />
                </div>
              </el-form-item>
              <el-form-item v-else>
                <template #label>
                  <div class="label-wrapper">
                    <el-tooltip content="该字段为自定义字段，可拖拽排序" placement="top">
                      <div
                        class="drag-handle"
                        draggable="true"
                        @dragstart="handleDragStart"
                        @dragend="handleDragEnd"
                      >
                        <oort-svg-icon
                          color="#666"
                          width="20"
                          height="20"
                          name="container1"
                          class="container_svg"
                        />
                      </div>
                    </el-tooltip>
                    <span class="field-label">{{ field.label }}</span>
                    <el-tooltip content="该字段为自定义字段，可按需启用或删除" placement="top">
                      <el-icon class="info-icon">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-input v-model="userL[field.field_key]" :placeholder="`请输入${field.label}`" class="input box_l" disabled />
                <div class="box_r">
                  <span class="switch-text">终端显示</span>
                  <el-switch v-model="field.is_show" :active-value="1" :inactive-value="0" active-color="#1976FF" class="switch-label" @change="falg => { handleCustomFieldShowChange(field.field_key, falg === 1); emit('update-custom-fields', getAllCustomFields()) }" />
                </div>
              </el-form-item>
              <oort-svg-icon
                name="table_edit"
                width="16"
                height="16"
                class="btn_icon"
                @click="handle(field)"
              />
              <oort-svg-icon
                name="delete"
                width="16"
                height="16"
                class="btn_icon"
                @click="del(field)"
              />
            </div>
          </template>
        </draggable>
      </el-form>
      <div class="add-custom-field-btn" @click="handle('', 'contactInfo')">
        <oort-svg-icon name="table_add" width="16" height="16" class="add-icon" />
        <span>添加自定义字段</span>
      </div>
      <div class="section-title">
        <span class="line" />
        <span>其他</span>
      </div>
      <el-form :model="userL" label-width="120px" class="custom-form">
        <el-form-item label="姓名首字母">
          <el-input v-model="userL.oort_namefl" placeholder="请输入姓名首字母" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showUserNameFPY" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_namefl', falg)" />
          </div>
        </el-form-item>
        <el-form-item label="姓名拼音">
          <el-input v-model="userL.oort_namepy" placeholder="请输入姓名拼音" class="input box_l" disabled />
          <div class="box_r">
            <span class="switch-text">终端显示</span>
            <el-switch v-model="userL.showUserNamePY" active-color="#1976FF" class="switch-label" @change="falg => handleShowChange('oort_namepy', falg)" />
          </div>
        </el-form-item>
      </el-form>
      <!-- 所属组织信息部分的自定义字段 -->
      <el-form v-if="orgInfoCustomFields.length > 0" :model="userL" label-width="120px" class="custom-form">
        <draggable
          tag="div"
          :list="orgInfoCustomFields"
          item-key="field_key"
          ghost-class="ghost"
          @end="onOrgInfoCustomFieldDragEnd"
        >
          <template #item="{ element: field }">
            <div class="row_col">
              <el-form-item v-if="field.data_type==='boolean'">
                <template #label>
                  <div class="label-wrapper">
                    <el-tooltip content="该字段为自定义字段，可拖拽排序" placement="top">
                      <div
                        class="drag-handle"
                        draggable="true"
                        @dragstart="handleDragStart"
                        @dragend="handleDragEnd"
                      >
                        <oort-svg-icon
                          color="#666"
                          width="20"
                          height="20"
                          name="container1"
                          class="container_svg"
                        />
                      </div>
                    </el-tooltip>
                    <span class="field-label">{{ field.label }}</span>
                    <el-tooltip content="该字段为自定义字段，可按需启用或删除" placement="top">
                      <el-icon class="info-icon">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-switch
                  v-model="userL[field.field_key]"
                  :placeholder="`请输入${field.label}`"
                  class="input box_l"
                  disabled
                  :active-value="true"
                  :inactive-value="false"
                />
                <div class="box_r">
                  <span class="switch-text">终端显示</span>
                  <el-switch v-model="field.is_show" :active-value="1" :inactive-value="0" active-color="#1976FF" class="switch-label" @change="falg => { handleCustomFieldShowChange(field.field_key, falg === 1); emit('update-custom-fields', getAllCustomFields()) }" />
                </div>
              </el-form-item>
              <el-form-item v-else>
                <template #label>
                  <div class="label-wrapper">
                    <el-tooltip content="该字段为自定义字段，可拖拽排序" placement="top">
                      <div
                        class="drag-handle"
                        draggable="true"
                        @dragstart="handleDragStart"
                        @dragend="handleDragEnd"
                      >
                        <oort-svg-icon
                          color="#666"
                          width="20"
                          height="20"
                          name="container1"
                          class="container_svg"
                        />
                      </div>
                    </el-tooltip>
                    <span class="field-label">{{ field.label }}</span>
                    <el-tooltip content="该字段为自定义字段，可按需启用或删除" placement="top">
                      <el-icon class="info-icon">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-input v-model="userL[field.field_key]" :placeholder="`请输入${field.label}`" class="input box_l" disabled />
                <div class="box_r">
                  <span class="switch-text">终端显示</span>
                  <el-switch v-model="field.is_show" :active-value="1" :inactive-value="0" active-color="#1976FF" class="switch-label" @change="falg => { handleCustomFieldShowChange(field.field_key, falg === 1); emit('update-custom-fields', getAllCustomFields()) }" />
                </div>
              </el-form-item>
              <oort-svg-icon
                name="table_edit"
                width="16"
                height="16"
                class="btn_icon"
                @click="handle(field)"
              />
              <oort-svg-icon
                name="delete"
                width="16"
                height="16"
                class="btn_icon"
                @click="del(field)"
              />
            </div>
          </template>
        </draggable>
      </el-form>
      <div class="add-custom-field-btn" @click="handle('', 'orgInfo')">
        <oort-svg-icon name="table_add" width="16" height="16" class="add-icon" />
        <span>添加自定义字段</span>
      </div>
      <div class="section-title">
        <span class="line" />
        <span>扩展字段</span>
        <oort-svg-icon
          name="table_add"
          width="16"
          height="16"
          style="cursor: pointer"
          @click="handle('')"
        />
      </div>
      <el-form :model="userL" label-width="120px" class="custom-form">
        <draggable
          tag="div"
          :list="customFields"
          item-key="field_key"
          ghost-class="ghost"
          @end="onCustomFieldDragEnd"
        >
          <template #item="{ element: field }">
            <div class="row_col">
              <el-form-item v-if="field.data_type==='boolean'">
                <template #label>
                  <div class="label-wrapper">
                    <el-tooltip content="该字段为自定义字段，可拖拽排序" placement="top">
                      <div
                        class="drag-handle"
                        draggable="true"
                        @dragstart="handleDragStart"
                        @dragend="handleDragEnd"
                      >
                        <oort-svg-icon
                          color="#666"
                          width="20"
                          height="20"
                          name="container1"
                          class="container_svg"
                        />
                      </div>
                    </el-tooltip>
                    <span class="field-label">{{ field.label }}</span>
                    <el-tooltip content="该字段为自定义字段，可按需启用或删除" placement="top">
                      <el-icon class="info-icon">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-switch
                  v-model="userL[field.field_key]"
                  :placeholder="`请输入${field.label}`"
                  class="input box_l"
                  disabled
                  :active-value="true"
                  :inactive-value="false"
                />
                <div class="box_r">
                  <span class="switch-text">终端显示</span>
                  <el-switch v-model="field.is_show" :active-value="1" :inactive-value="0" active-color="#1976FF" class="switch-label" @change="falg => { handleCustomFieldShowChange(field.field_key, falg === 1); emit('update-custom-fields', customFields) }" />
                </div>
              </el-form-item>
              <el-form-item v-else>
                <template #label>
                  <div class="label-wrapper">
                    <el-tooltip content="该字段为自定义字段，可拖拽排序" placement="top">
                      <div
                        class="drag-handle"
                        draggable="true"
                        @dragstart="handleDragStart"
                        @dragend="handleDragEnd"
                      >
                        <oort-svg-icon
                          color="#666"
                          width="20"
                          height="20"
                          name="container1"
                          class="container_svg"
                        />
                      </div>
                    </el-tooltip>
                    <span class="field-label">{{ field.label }}</span>
                    <el-tooltip content="该字段为自定义字段，可按需启用或删除" placement="top">
                      <el-icon class="info-icon">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-input v-model="userL[field.field_key]" :placeholder="`请输入${field.label}`" class="input box_l" disabled />
                <div class="box_r">
                  <span class="switch-text">终端显示</span>
                  <el-switch v-model="field.is_show" :active-value="1" :inactive-value="0" active-color="#1976FF" class="switch-label" @change="falg => { handleCustomFieldShowChange(field.field_key, falg === 1); emit('update-custom-fields', customFields) }" />
                </div>
              </el-form-item>
              <oort-svg-icon
                name="table_edit"
                width="16"
                height="16"
                class="btn_icon"
                @click="handle(field)"
              />
              <oort-svg-icon
                name="delete"
                width="16"
                height="16"
                class="btn_icon"
                @click="del(field)"
              />
            </div>
          </template>
        </draggable>
      </el-form>
      <div class="add-custom-field-btn" @click="handle('', 'extended')">
        <oort-svg-icon name="table_add" width="16" height="16" class="add-icon" />
        <span>添加自定义字段</span>
      </div>
    </div>
    <div class="form-section">
      <div class="section-title">
        <span class="line" />
        <span>展示预览</span>
      </div>
      <div class="desc_bg">
        <div class="preview-card">
          <div class="preview-header">
            <div v-if="userL.showAvatar">
              <oort-img :src="userL.avatar" class="preview-avatar" default-img="tx" />
            </div>
            <div style="display: flex;flex-direction: column;gap: 5px">
              <span v-if="userL.showName" class="preview-name">{{ userL.name }}</span>
              <div v-if="userL.showPosition" class="preview-title">
                {{ userL.position }}
              </div>
            </div>
          </div>
          <div class="preview-info">
            <div v-for="(item, index) in visibleFields" :key="index" class="preview-row">
              <span class="p_l">{{ getLabel(item.ky) }}：</span>
              <span class="p_r">{{ userL[item.ky] }}</span>
            </div>
            <div v-for="(item, index) in visibleCustomFields" :key="index" class="preview-row">
              <span class="p_l">{{ item.label }}：</span>
              <span class="p_r">{{ userL[item.field_key] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="curTitle"
      width="35%"
      :close-on-click-modal="false"
    >
      <div class="custom-param-form">
        <el-form ref="customFormRef" :model="customParam" :rules="customFormRules" class="custom-form">
          <el-form-item label="字段类型" prop="data_type" required>
            <el-select v-model="customParam.data_type" placeholder="请选择字段类型">
              <el-option
                v-for="item in dataTypeOptions"
                :key="item.value"
                :label="`${item.label}(${item.description})`"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span
                  style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
                >
                  {{ item.description }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段标签" prop="label" required>
            <el-input v-model="customParam.label" placeholder="如：用户名" />
          </el-form-item>
          <!-- 枚举类型配置 -->
          <template v-if="customParam.data_type === 'enum'">
            <el-form-item label="单选/多选" required>
              <el-radio-group v-model="customParam.enum_type">
                <el-radio :label="false">
                  单选
                </el-radio>
                <el-radio :label="true">
                  多选
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="选项内容" required>
              <div class="enum-options-container">
                <div v-for="(option, index) in customParam.options" :key="index" class="enum-option-item">
                  <el-input
                    v-model="customParam.options[index]"
                    placeholder="请输入选项内容"
                    class="enum-option-input"
                  />
                  <div
                    class="enum-option-delete"
                    @click="removeEnumOption(index)"
                  >
                    删除
                  </div>
                </div>
                <div
                  class="enum-option-add"
                  @click="addEnumOption"
                >
                  + 添加选项
                </div>
              </div>
            </el-form-item>
          </template>
          <el-form-item label="是否必填" prop="is_required" required>
            <el-switch v-model="customParam.is_required" />
          </el-form-item>
          <el-form-item label="是否显示" prop="is_show" required>
            <el-switch v-model="customParam.is_show" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: right;">
        <el-button @click="handleClose">
          取 消
        </el-button>
        <el-button type="primary" @click="submitForm">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Config from '@/config'
import { getUserInfoByUserId, modelDel } from '@/api/address_book/index'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import draggable from 'vuedraggable'
import { InfoFilled } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const curTitle = ref()
const customFormRef = ref<FormInstance>()
const customParam = ref({
  data_type: 'string',
  field_key: '',
  is_required: false,
  is_show: 1 as number,
  label: '',
  sort: 0,
  id: '', // 扩展字段的 id，用于区分是否为已保存的字段
  enum_type: false, // 枚举类型：false=单选，true=多选
  options: [] as string[] // 枚举选项列表
})

// 字段类型选项配置
const dataTypeOptions = [
  { value: 'string', label: 'string', description: '字符串' },
  { value: 'integer', label: 'integer', description: '整数' },
  { value: 'float', label: 'float', description: '小数' },
  { value: 'boolean', label: 'boolean', description: '布尔类型' },
  { value: 'date', label: 'date', description: '日期格式(yyyy-mm-dd)' },
  { value: 'datetime', label: 'datetime', description: '日期时间格式(2025-11-12 12:14:00)' },
  { value: 'enum', label: 'enum', description: '枚举文本' },
  { value: 'json', label: 'json', description: '键值对格式' }
]

// 表单校验规则
const customFormRules = ref<FormRules>({
  data_type: [
    { required: true, message: '请选择字段类型', trigger: 'change' }
  ],
  label: [
    { required: true, message: '请输入字段标签', trigger: 'blur' }
  ]
})
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  basicList: {
    type: Array,
    default: () => []
  },
  // 自定义字段列表
  customFieldList: {
    type: Array,
    default: () => []
  },
  // 标识是否为用户设置页面
  isUserSetting: {
    type: Boolean,
    default: false
  },
  // 用户ID，当isUserSetting为true时传入
  userId: {
    type: [String, Number],
    default: null
  },
  // 当前用户所在的部门ID
  deptId: {
    type: String,
    default: ''
  },
  // 用户数据
  userData: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['update-basic-list', 'update-custom-fields'])
const store = useUserStore()
const upfileURL = ref('') // 上传图片
let minDept = ref()
const onCustomFieldDragEnd = () => {
  // 更新排序字段，不调用后端接口
  customFields.value.forEach((item, index) => {
    item.sort = index + 1
  })
  // 通知父组件扩展字段已更新
  emit('update-custom-fields', getAllCustomFields())
}

// 基本信息部分拖拽结束
const onBasicInfoCustomFieldDragEnd = () => {
  basicInfoCustomFields.value.forEach((item, index) => {
    item.sort = index + 1
  })
  emit('update-custom-fields', getAllCustomFields())
}

// 账号信息部分拖拽结束
const onAccountInfoCustomFieldDragEnd = () => {
  accountInfoCustomFields.value.forEach((item, index) => {
    item.sort = index + 1
  })
  emit('update-custom-fields', getAllCustomFields())
}

// 联系信息部分拖拽结束
const onContactInfoCustomFieldDragEnd = () => {
  contactInfoCustomFields.value.forEach((item, index) => {
    item.sort = index + 1
  })
  emit('update-custom-fields', getAllCustomFields())
}

// 所属组织信息部分拖拽结束
const onOrgInfoCustomFieldDragEnd = () => {
  orgInfoCustomFields.value.forEach((item, index) => {
    item.sort = index + 1
  })
  emit('update-custom-fields', getAllCustomFields())
}

type FieldItem = {
  data_type: string
  field_key: string
  label: string
  is_required: boolean
  is_show: number
  sort: number
  id?: string // 可选的 id 字段，用于区分是否为已保存的字段
  section?: string // 字段所属的部分：basicInfo, accountInfo, contactInfo, orgInfo, extended
  group_id?: number // 所属分组 0:默认 1:基本信息 2:账号信息 3:联系信息 4:所属组织信息
  enum_type?: boolean // 枚举类型：false=单选，true=多选
  options?: string[] // 枚举选项列表
}

const customFields = ref<FieldItem[]>([])
// 不同部分的字段列表
const basicInfoCustomFields = ref<FieldItem[]>([])
const accountInfoCustomFields = ref<FieldItem[]>([])
const contactInfoCustomFields = ref<FieldItem[]>([])
const orgInfoCustomFields = ref<FieldItem[]>([])

// 当前添加字段所属的部分
const currentSection = ref<string>('')

// 按 sort 从小到大排序字段列表（如果 sort 为空则按原顺序）
const sortFieldList = (list: FieldItem[]) => {
  list.sort((a, b) => {
    const sa = a.sort ?? 0
    const sb = b.sort ?? 0
    return sa - sb
  })
}

// 将 section 映射到 group_id
const getGroupIdBySection = (section: string): number => {
  switch (section) {
    case 'basicInfo':
      return 1
    case 'accountInfo':
      return 2
    case 'contactInfo':
      return 3
    case 'orgInfo':
      return 4
    default:
      return 0 // extended 或其他情况默认为 0
  }
}

// 将 group_id 映射到 section
const getSectionByGroupId = (group_id: number): string => {
  switch (group_id) {
    case 1:
      return 'basicInfo'
    case 2:
      return 'accountInfo'
    case 3:
      return 'contactInfo'
    case 4:
      return 'orgInfo'
    default:
      return 'extended'
  }
}

// 获取所有自定义字段（合并所有部分），并添加 group_id
const getAllCustomFields = () => {
  const allFields = [
    ...basicInfoCustomFields.value.map((field, index) => {
      const fieldData: any = {
        ...field,
        sort: index + 1,
        group_id: field.group_id !== undefined ? field.group_id : 1,
        section: field.section || 'basicInfo'
      }
      // 如果不是枚举类型，删除 enum_type 和 options
      if (fieldData.data_type !== 'enum') {
        delete fieldData.enum_type
        delete fieldData.options
      }
      // 如果是枚举类型且 options 是字符串，解析为数组
      if (fieldData.data_type === 'enum' && fieldData.options && typeof fieldData.options === 'string') {
        try {
          fieldData.options = JSON.parse(fieldData.options)
        } catch (e) {
          fieldData.options = []
        }
      }
      return fieldData
    }),
    ...accountInfoCustomFields.value.map((field, index) => {
      const fieldData: any = {
        ...field,
        sort: index + 1,
        group_id: field.group_id !== undefined ? field.group_id : 2,
        section: field.section || 'accountInfo'
      }
      if (fieldData.data_type !== 'enum') {
        delete fieldData.enum_type
        delete fieldData.options
      }
      if (fieldData.data_type === 'enum' && fieldData.options && typeof fieldData.options === 'string') {
        try {
          fieldData.options = JSON.parse(fieldData.options)
        } catch (e) {
          fieldData.options = []
        }
      }
      return fieldData
    }),
    ...contactInfoCustomFields.value.map((field, index) => {
      const fieldData: any = {
        ...field,
        sort: index + 1,
        group_id: field.group_id !== undefined ? field.group_id : 3,
        section: field.section || 'contactInfo'
      }
      if (fieldData.data_type !== 'enum') {
        delete fieldData.enum_type
        delete fieldData.options
      }
      if (fieldData.data_type === 'enum' && fieldData.options && typeof fieldData.options === 'string') {
        try {
          fieldData.options = JSON.parse(fieldData.options)
        } catch (e) {
          fieldData.options = []
        }
      }
      return fieldData
    }),
    ...orgInfoCustomFields.value.map((field, index) => {
      const fieldData: any = {
        ...field,
        sort: index + 1,
        group_id: field.group_id !== undefined ? field.group_id : 4,
        section: field.section || 'orgInfo'
      }
      if (fieldData.data_type !== 'enum') {
        delete fieldData.enum_type
        delete fieldData.options
      }
      if (fieldData.data_type === 'enum' && fieldData.options && typeof fieldData.options === 'string') {
        try {
          fieldData.options = JSON.parse(fieldData.options)
        } catch (e) {
          fieldData.options = []
        }
      }
      return fieldData
    }),
    ...customFields.value.map((field, index) => {
      const fieldData: any = {
        ...field,
        sort: index + 1,
        group_id: field.group_id !== undefined ? field.group_id : 0,
        section: field.section || 'extended'
      }
      if (fieldData.data_type !== 'enum') {
        delete fieldData.enum_type
        delete fieldData.options
      }
      if (fieldData.data_type === 'enum' && fieldData.options && typeof fieldData.options === 'string') {
        try {
          fieldData.options = JSON.parse(fieldData.options)
        } catch (e) {
          fieldData.options = []
        }
      }
      return fieldData
    })
  ]
  return allFields
}

// 监听父组件传入的自定义字段数据，根据 group_id 分配到对应的列表
watch(() => props.customFieldList, (newCustomFields) => {
  // 清空所有列表
  basicInfoCustomFields.value = []
  accountInfoCustomFields.value = []
  contactInfoCustomFields.value = []
  orgInfoCustomFields.value = []
  customFields.value = []

  if (newCustomFields && Array.isArray(newCustomFields) && newCustomFields.length > 0) {
    newCustomFields.forEach((field: any, index: number) => {
      // 处理 options：如果是字符串则解析为数组，如果是数组则直接使用
      let optionsArray: string[] = []
      if (field.options) {
        if (typeof field.options === 'string') {
          try {
            optionsArray = JSON.parse(field.options)
          } catch (e) {
            optionsArray = []
          }
        } else if (Array.isArray(field.options)) {
          optionsArray = [...field.options]
        }
      }

      const fieldItem: FieldItem = {
        data_type: field.data_type || 'string',
        field_key: field.field_key,
        label: field.label,
        is_required: field.is_required || false,
        is_show: field.is_show !== undefined ? field.is_show : 0,
        sort: field.sort !== undefined ? field.sort : index,
        id: field.id || '',
        group_id: field.group_id !== undefined ? field.group_id : 0,
        section: getSectionByGroupId(field.group_id !== undefined ? field.group_id : 0),
        enum_type: field.enum_type !== undefined ? field.enum_type : false, // 保留枚举类型
        options: optionsArray // 保留选项列表
      }

      // 根据 group_id 分配到对应的列表
      switch (field.group_id) {
        case 1:
          basicInfoCustomFields.value.push(fieldItem)
          break
        case 2:
          accountInfoCustomFields.value.push(fieldItem)
          break
        case 3:
          contactInfoCustomFields.value.push(fieldItem)
          break
        case 4:
          orgInfoCustomFields.value.push(fieldItem)
          break
        default:
          // group_id === 0 或 undefined 的字段放入扩展字段列表
          customFields.value.push(fieldItem)
      }
    })
    // 按 sort 排序各分组，确保显示顺序从小到大
    sortFieldList(basicInfoCustomFields.value)
    sortFieldList(accountInfoCustomFields.value)
    sortFieldList(contactInfoCustomFields.value)
    sortFieldList(orgInfoCustomFields.value)
    sortFieldList(customFields.value)
  }
}, { immediate: true })

upfileURL.value = Config.URL + Config.gateWay + 'apaas-fastdfsservice/fastdfs/v1/uploadFile'
let userL = ref({
  avatar: '',
  showAvatar: false,
  name: '张三',
  showName: false,
  idCard: '11010119900101****',
  showIdCard: false,
  gender: '',
  showGender: false,
  loginAccount: 'zhangsan',
  showLoginAccount: false,
  oort_phone: '138****8888',
  showPhone: false,
  oort_username: 'zhangsan',
  showUserName: false,
  oort_namefl: 'ZS',
  showUserNameFPY: false,
  oort_namepy: 'zhangsan',
  showUserNamePY: false,
  userId: 'U001',
  showUserId: false,
  oort_status: '启用',
  showStatus: false,
  dept: '技术部',
  showDept: false,
  deptId: 'D001',
  showDeptId: false,
  oort_email: 'zhangsan@example.com',
  showEmail: false,
  oort_office: 'A座101',
  showOffice: false,
  officePhone: '010-12345678',
  showOfficePhone: false,
  privatePhone: '139****9999',
  showPrivatePhone: false,
  position: '软件工程师',
  showPosition: false,
  job: '高级工程师',
  showJob: false,
  oort_remark: '技术骨干，负责核心系统开发',
  showRemark: false,
  oort_address: '北京市朝阳区建国路88号SOHO现代城A座',
  showAddress: false,
  oort_area: '北京市朝阳区',
  showArea: false,
  oort_postcode: '100000',
  showPostCode: false,
  oort_dingding: '13800138000',
  showDingding: false,
  oort_weixin: 'wx_zhangsan',
  showWeixin: false
})
const userR = ref<{ ky: string; fl: boolean }[]>([
  { ky: 'idCard', fl: false },
  { ky: 'gender', fl: false },
  { ky: 'loginAccount', fl: false },
  { ky: 'oort_phone', fl: false },
  { ky: 'oort_username', fl: false },
  { ky: 'oort_namefl', fl: false },
  { ky: 'oort_namepy', fl: false },
  { ky: 'userId', fl: false },
  { ky: 'oort_status', fl: false },
  { ky: 'dept', fl: false },
  { ky: 'deptId', fl: false },
  { ky: 'oort_email', fl: false },
  { ky: 'oort_office', fl: false },
  { ky: 'officePhone', fl: false },
  { ky: 'privatePhone', fl: false },
  { ky: 'position', fl: false },
  { ky: 'job', fl: false },
  { ky: 'oort_remark', fl: false },
  { ky: 'oort_address', fl: false },
  { ky: 'oort_area', fl: false },
  { ky: 'oort_postcode', fl: false },
  { ky: 'oort_dingding', fl: false },
  { ky: 'oort_weixin', fl: false }
])

// 获取用户实际信息
const fetchUserInfo = async() => {
  if (!props.isUserSetting || !props.userId) {
    return
  }

  if (props.userData) {
    const userData = props.userData
    userL.value.avatar = userData?.oort_photo || ''
    userL.value.name = userData?.oort_name || ''
    userL.value.idCard = userData?.oort_idcard || ''
    userL.value.gender = userData?.oort_sex === 1 ? '男' : (userData?.oort_sex === 2 ? '女' : '')
    userL.value.loginAccount = userData?.oort_loginid || ''
    userL.value.oort_phone = userData?.oort_phone || ''
    userL.value.oort_username = userData?.oort_name || ''
    userL.value.oort_namefl = userData?.oort_namefl || ''
    userL.value.oort_namepy = userData?.oort_namepy || ''
    userL.value.userId = userData?.oort_code || ''
    userL.value.oort_status = userData?.oort_status === 1 ? '启用' : '禁用'
    userL.value.dept = userData?.oort_depname || ''
    userL.value.deptId = userData?.oort_depcode || ''
    userL.value.oort_email = userData?.oort_email || ''
    userL.value.oort_office = userData?.oort_office || ''
    userL.value.officePhone = userData?.oort_tel || ''
    userL.value.privatePhone = userData?.oort_pphone || ''
    userL.value.position = userData?.oort_jobname || ''
    userL.value.job = userData?.oort_postname || ''
    userL.value.oort_remark = userData?.oort_remark || ''
    userL.value.oort_address = userData?.oort_address || ''
    userL.value.oort_area = userData?.oort_area || ''
    userL.value.oort_postcode = userData?.oort_postcode || ''
    userL.value.oort_dingding = userData?.oort_dingding || ''
    userL.value.oort_weixin = userData?.oort_weixin || ''
    return
  }

  const params = {
    accessToken: store.userInfo?.accessToken,
    desensitize: true,
    oort_uuid: props.userId
  }
  const res = await getUserInfoByUserId(params) as any

  if (res.code === 200 && res.data) {
    const userData = res.data

    // 更新userL中的实际值
    userL.value.avatar = userData?.oort_photo
    userL.value.name = userData.user_detail?.ex_data?.realName
    userL.value.idCard = userData?.user_detail?.ex_data?.idcard ?? ''
    userL.value.gender = userData?.user_detail?.ex_data?.sex || ''
    userL.value.loginAccount = userData?.unique_login_id?.oort_loginid
    userL.value.oort_phone = userData?.user_detail?.ex_data?.oort_phone ?? ''
    userL.value.oort_username = userData?.oort_name
    userL.value.oort_namefl = userData?.user_name_fpy || ''
    userL.value.oort_namepy = userData?.user_name_py || ''
    userL.value.userId = userData?.user_detail?.ex_data?.userCode || ''
    userL.value.oort_status = userData?.oort_status === 1 ? '启用' : '禁用'
    const userDeptList = Array.isArray(userData?.user_dept) ? userData?.user_dept : []
    // 优先使用传入的 deptId 匹配；否则按主部门；再否则取第一条
    minDept.value = userDeptList.find((item) => item?.oort_dcode === props.deptId) ||
      userDeptList.find((item) => item.is_main) ||
      userDeptList[0]

    if (minDept.value?.dept) {
      userL.value.dept = minDept.value.dept.oort_dname
      userL.value.deptId = minDept.value.dept.dept_code
    } else {
      userL.value.dept = ''
      userL.value.deptId = ''
    }
    userL.value.oort_email = userData?.user_detail?.ex_data?.oort_email ?? ''
    const deptExData = minDept.value?.ex_data || {}
    userL.value.oort_office = deptExData.oort_office ?? ''
    userL.value.officePhone = deptExData.tel ?? ''
    userL.value.privatePhone = userData?.unique_phone?.oort_phone ?? ''
    userL.value.position = minDept.value?.job?.[0]?.name ?? ''
    userL.value.job = minDept.value?.post?.[0]?.name ?? ''
    userL.value.oort_remark = userData?.user_detail?.ex_data?.mark ?? ''
    userL.value.oort_address = userData?.user_detail?.ex_data?.oort_address ?? ''
    userL.value.oort_area = Array.isArray(userData?.user_detail?.ex_data?.oort_area)
      ? userData.user_detail.ex_data.oort_area.join('')
      : (userData?.user_detail?.ex_data?.oort_area ?? '')
    userL.value.oort_postcode = userData?.user_detail?.ex_data?.oort_postcode ?? ''
    userL.value.oort_dingding = userData?.user_detail?.ex_data?.oort_dingding ?? ''
    userL.value.oort_weixin = userData?.user_detail?.ex_data?.oort_weixin ?? ''

    // 扩展字段：值和显示控制来自接口返回的 custom_field
    const apiCustomFields = Array.isArray(userData?.custom_field) ? userData.custom_field : []
    // 清空所有列表
    basicInfoCustomFields.value = []
    accountInfoCustomFields.value = []
    contactInfoCustomFields.value = []
    orgInfoCustomFields.value = []
    customFields.value = []

    apiCustomFields.forEach((field, index) => {
      // 处理 options：如果是字符串则解析为数组，如果是数组则直接使用
      let optionsArray: string[] = []
      if (field.options) {
        if (typeof field.options === 'string') {
          try {
            optionsArray = JSON.parse(field.options)
          } catch (e) {
            optionsArray = []
          }
        } else if (Array.isArray(field.options)) {
          optionsArray = [...field.options]
        }
      }

      const fieldItem: FieldItem = {
        data_type: field.data_type || 'string',
        field_key: field.field_key,
        label: field.label,
        is_required: field.is_required || false,
        is_show: field.is_show ?? 0,
        sort: field.sort ?? index,
        id: field.id || '',
        group_id: field.group_id !== undefined ? field.group_id : 0,
        section: getSectionByGroupId(field.group_id !== undefined ? field.group_id : 0),
        enum_type: field.enum_type !== undefined ? field.enum_type : false, // 保留枚举类型
        options: optionsArray // 保留选项列表
      }

      // 根据 group_id 分配到对应的列表
      switch (field.group_id) {
        case 1:
          basicInfoCustomFields.value.push(fieldItem)
          break
        case 2:
          accountInfoCustomFields.value.push(fieldItem)
          break
        case 3:
          contactInfoCustomFields.value.push(fieldItem)
          break
        case 4:
          orgInfoCustomFields.value.push(fieldItem)
          break
        default:
          customFields.value.push(fieldItem)
      }

      // 设置字段值
      userL.value[field.field_key] = field.field_value ?? ''
    })

    // 接口返回后按 sort 排序各分组
    sortFieldList(basicInfoCustomFields.value)
    sortFieldList(accountInfoCustomFields.value)
    sortFieldList(contactInfoCustomFields.value)
    sortFieldList(orgInfoCustomFields.value)
    sortFieldList(customFields.value)
  }
}

// 监听 userId 变化，自动获取用户信息
watch(() => props.userId, (newUserId) => {
  if (props.isUserSetting && newUserId) {
    fetchUserInfo()
  }
}, { immediate: true })

// 根据props.data.basic赋值user
watch(() => props.data, (val) => {
  if (val && Array.isArray(val.basic_field)) {
    // 清空旧数据
    userR.value = []
    val.basic_field.forEach(item => {
      // 只处理常用字段，未定义的可按需补充
      switch (item.field_key) {
        case 'oort_photo':
          userL.value.showAvatar = item.is_show === 1
          break
        case 'oort_name':
          userL.value.showName = item.is_show === 1
          break
        case 'oort_idcard':
          userL.value.showIdCard = item.is_show === 1
          userR.value.push({ ky: 'idCard', fl: userL.value.showIdCard })
          break
        case 'oort_sex':
          userL.value.showGender = item.is_show === 1
          userR.value.push({ ky: 'gender', fl: userL.value.showGender })
          break
        case 'oort_loginid':
          userL.value.showLoginAccount = item.is_show === 1
          userR.value.push({ ky: 'loginAccount', fl: userL.value.showLoginAccount })
          break
        case 'oort_phone':
          userL.value.showPhone = item.is_show === 1
          userR.value.push({ ky: 'oort_phone', fl: userL.value.showPhone })
          break
        case 'oort_code':
          userL.value.showUserId = item.is_show === 1
          userR.value.push({ ky: 'userId', fl: userL.value.showUserId })
          break
        case 'oort_username':
          userL.value.showUserName = item.is_show === 1
          userR.value.push({ ky: 'oort_username', fl: userL.value.showUserName })
          break
        case 'oort_namefl':
          userL.value.showUserNameFPY = item.is_show === 1
          userR.value.push({ ky: 'oort_namefl', fl: userL.value.showUserNameFPY })
          break
        case 'oort_namepy':
          userL.value.showUserNamePY = item.is_show === 1
          userR.value.push({ ky: 'oort_namepy', fl: userL.value.showUserNamePY })
          break
        case 'oort_status':
          userL.value.showStatus = item.is_show === 1
          userR.value.push({ ky: 'oort_status', fl: userL.value.showStatus })
          break
        case 'oort_depname':
          userL.value.showDept = item.is_show === 1
          userR.value.push({ ky: 'dept', fl: userL.value.showDept })
          break
        case 'oort_depcode':
          userL.value.showDeptId = item.is_show === 1
          userR.value.push({ ky: 'deptId', fl: userL.value.showDeptId })
          break
        // 账号类型、用户类型
        case 'oort_email':
          userL.value.showEmail = item.is_show === 1
          userR.value.push({ ky: 'oort_email', fl: userL.value.showEmail })
          break
        case 'oort_office':
          userL.value.showOffice = item.is_show === 1
          userR.value.push({ ky: 'oort_office', fl: userL.value.showOffice })
          break
        case 'oort_tel':
          userL.value.showOfficePhone = item.is_show === 1
          userR.value.push({ ky: 'officePhone', fl: userL.value.showOfficePhone })
          break
        case 'oort_pphone':
          userL.value.showPrivatePhone = item.is_show === 1
          userR.value.push({ ky: 'privatePhone', fl: userL.value.showPrivatePhone })
          break
        case 'oort_jobname':
          userL.value.showPosition = item.is_show === 1
          userR.value.push({ ky: 'position', fl: userL.value.showPosition })
          break
        case 'oort_postname':
          userL.value.showJob = item.is_show === 1
          userR.value.push({ ky: 'job', fl: userL.value.showJob })
          break
        case 'oort_remark':
          userL.value.showRemark = item.is_show === 1
          userR.value.push({ ky: 'oort_remark', fl: userL.value.showRemark })
          break
        case 'oort_address':
          userL.value.showAddress = item.is_show === 1
          userR.value.push({ ky: 'oort_address', fl: userL.value.showAddress })
          break
        case 'oort_area':
          userL.value.showArea = item.is_show === 1
          userR.value.push({ ky: 'oort_area', fl: userL.value.showArea })
          break
        case 'oort_postcode':
          userL.value.showPostCode = item.is_show === 1
          userR.value.push({ ky: 'oort_postcode', fl: userL.value.showPostCode })
          break
        case 'oort_dingding':
          userL.value.showDingding = item.is_show === 1
          userR.value.push({ ky: 'oort_dingding', fl: userL.value.showDingding })
          break
        case 'oort_weixin':
          userL.value.showWeixin = item.is_show === 1
          userR.value.push({ ky: 'oort_weixin', fl: userL.value.showWeixin })
          break
      }
    })
  }

  // 处理扩展字段
  if (val && Array.isArray(val.custom_field)) {
    // 清空所有列表
    basicInfoCustomFields.value = []
    accountInfoCustomFields.value = []
    contactInfoCustomFields.value = []
    orgInfoCustomFields.value = []
    customFields.value = []

    val.custom_field.forEach((field, index) => {
      // 处理 options：如果是字符串则解析为数组，如果是数组则直接使用
      let optionsArray: string[] = []
      if (field.options) {
        if (typeof field.options === 'string') {
          try {
            optionsArray = JSON.parse(field.options)
          } catch (e) {
            optionsArray = []
          }
        } else if (Array.isArray(field.options)) {
          optionsArray = [...field.options]
        }
      }

      const fieldItem: FieldItem = {
        data_type: field.data_type || 'string',
        field_key: field.field_key,
        label: field.label,
        is_required: field.is_required || false,
        is_show: field.is_show || 0,
        sort: field.sort !== undefined ? field.sort : index,
        id: field.id || '',
        group_id: field.group_id !== undefined ? field.group_id : 0,
        section: getSectionByGroupId(field.group_id !== undefined ? field.group_id : 0),
        enum_type: field.enum_type !== undefined ? field.enum_type : false, // 保留枚举类型
        options: optionsArray // 保留选项列表
      }

      // 根据 group_id 分配到对应的列表
      switch (field.group_id) {
        case 1:
          basicInfoCustomFields.value.push(fieldItem)
          break
        case 2:
          accountInfoCustomFields.value.push(fieldItem)
          break
        case 3:
          contactInfoCustomFields.value.push(fieldItem)
          break
        case 4:
          orgInfoCustomFields.value.push(fieldItem)
          break
        default:
          customFields.value.push(fieldItem)
      }
    })

    // 默认配置加载时，按 sort 排序各分组
    sortFieldList(basicInfoCustomFields.value)
    sortFieldList(accountInfoCustomFields.value)
    sortFieldList(contactInfoCustomFields.value)
    sortFieldList(orgInfoCustomFields.value)
    sortFieldList(customFields.value)
  }
}, { immediate: true })

const labelMap: Record<string, string> = {
  idCard: '身份证号',
  gender: '性别',
  loginAccount: '登陆账号',
  oort_phone: '手机号码',
  oort_username: '用户名',
  oort_namefl: '姓名首字母',
  oort_namepy: '姓名拼音',
  userId: '用户编号',
  oort_status: '用户状态',
  dept: '所属部门',
  deptId: '部门编号',
  oort_email: '用户邮箱',
  oort_office: '办公室门号',
  officePhone: '办公号码',
  privatePhone: '私有号码',
  position: '岗位',
  job: '职位',
  oort_remark: '备注',
  oort_address: '地址',
  oort_area: '区域',
  oort_postcode: '邮编',
  oort_dingding: '钉钉',
  oort_weixin: '微信'
}

function getLabel(key: string) {
  return labelMap[key] || key
}

const handleShowChange = (field: string, flag: boolean) => {
  if (field !== 'avatar' && field !== 'name') {
    let idx = userR.value.findIndex(item => item.ky === field)

    if (idx === -1) {
      userR.value.push({ ky: field, fl: flag })
      idx = userR.value.length - 1
    }

    userR.value[idx].fl = flag
  }

  // 根据field映射到对应的field_key，并通知父组件更新basicList
  // 映射值必须是接口返回的 basic_field 中的 field_key
  const fieldKeyMap: Record<string, string> = {
    avatar: 'oort_photo',
    name: 'oort_name',
    idCard: 'oort_idcard',
    gender: 'oort_sex',
    loginAccount: 'oort_loginid',
    oort_phone: 'oort_phone',
    oort_username: 'oort_username',
    oort_namefl: 'oort_namefl',
    oort_namepy: 'oort_namepy',
    userId: 'oort_code',
    oort_status: 'oort_status',
    dept: 'oort_depname',
    deptId: 'oort_depcode',
    oort_email: 'oort_email',
    oort_office: 'oort_office',
    officePhone: 'oort_tel',
    privatePhone: 'oort_pphone',
    position: 'oort_jobname',
    job: 'oort_postname',
    oort_remark: 'oort_remark',
    oort_address: 'oort_address',
    oort_area: 'oort_area',
    oort_postcode: 'oort_postcode',
    oort_dingding: 'oort_dingding',
    oort_weixin: 'oort_weixin'
  }

  const fieldKey = fieldKeyMap[field]
  if (fieldKey) {
    emit('update-basic-list', fieldKey, flag)
  }
}

// 处理扩展字段的显示状态变化
const handleCustomFieldShowChange = (fieldKey: string, flag: boolean) => {
  // 在所有列表中查找字段
  const found = findFieldInAllLists(fieldKey)
  if (found) {
    found.list[found.index].is_show = flag ? 1 : 0

    // 同步更新userL中对应字段的显示状态
    if (Object.prototype.hasOwnProperty.call(userL.value, `show${fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}`)) {
      userL.value[`show${fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}`] = flag
    }
  }
}

const visibleFields = computed(() =>
  userR.value.filter(item => item.fl)
)

const visibleCustomFields = computed(() =>
  getAllCustomFields().filter(item => item.is_show === 1)
)

// 重置表单数据
const resetForm = () => {
  customParam.value = {
    data_type: 'string',
    field_key: '',
    is_required: false,
    is_show: 1 as number,
    label: '',
    sort: 0,
    id: '', // 重置 id 字段
    enum_type: false, // 重置枚举类型为单选（false=单选，true=多选）
    options: [] // 重置选项列表
  }
  // 清除表单验证
  if (customFormRef.value) {
    customFormRef.value.clearValidate()
  }
}

// 添加枚举选项
const addEnumOption = () => {
  if (!customParam.value.options) {
    customParam.value.options = []
  }
  customParam.value.options.push('')
}

// 删除枚举选项
const removeEnumOption = (index: number) => {
  if (customParam.value.options && customParam.value.options.length > 0) {
    customParam.value.options.splice(index, 1)
  }
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

// 根据部分获取对应的字段列表
const getFieldListBySection = (section: string) => {
  switch (section) {
    case 'basicInfo':
      return basicInfoCustomFields
    case 'accountInfo':
      return accountInfoCustomFields
    case 'contactInfo':
      return contactInfoCustomFields
    case 'orgInfo':
      return orgInfoCustomFields
    default:
      return customFields
  }
}

// 在所有字段列表中查找字段
const findFieldInAllLists = (fieldKey: string) => {
  const allLists = [
    { list: basicInfoCustomFields, section: 'basicInfo' },
    { list: accountInfoCustomFields, section: 'accountInfo' },
    { list: contactInfoCustomFields, section: 'contactInfo' },
    { list: orgInfoCustomFields, section: 'orgInfo' },
    { list: customFields, section: 'extended' }
  ]

  for (const { list, section } of allLists) {
    const index = list.value.findIndex(item => item.field_key === fieldKey)
    if (index !== -1) {
      return { list: list.value, index, section }
    }
  }
  return null
}

// 当前正在编辑的字段引用（用于未保存到后端、field_key 为空的情况）
const editingFieldRef = ref<FieldItem | null>(null)

const submitForm = async() => {
  // 表单验证
  if (!customFormRef.value) return

  try {
    await customFormRef.value.validate()
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
    return
  }

  const submitData: any = {
    ...customParam.value
  }

  if (submitData.data_type !== 'enum') {
    delete submitData.enum_type
    delete submitData.options
  }

  if (curTitle.value === '编辑字段') {
    // 编辑模式
    if (editingFieldRef.value) {
      // 直接更新当前编辑的字段引用，避免依赖 field_key/id
      const target = editingFieldRef.value
      target.data_type = submitData.data_type
      target.is_required = submitData.is_required
      target.is_show = submitData.is_show
      target.label = submitData.label
      target.sort = submitData.sort
      target.enum_type = submitData.enum_type
      target.options = submitData.options
    } else {
      // 兜底：通过 field_key 在列表中查找
      const found = findFieldInAllLists(customParam.value.field_key)
      if (found) {
        const existingField = found.list[found.index]
        const updatedField: FieldItem = {
          ...submitData,
          section: found.section,
          group_id: existingField.group_id !== undefined ? existingField.group_id : getGroupIdBySection(found.section)
        }
        found.list[found.index] = updatedField
      }
    }
  } else {
    // 新增模式：根据当前部分添加到对应列表
    const targetList = getFieldListBySection(currentSection.value)
    const section = currentSection.value || 'extended'
    const groupId = getGroupIdBySection(section)
    const newField: FieldItem = {
      ...submitData,
      sort: targetList.value.length,
      section: section,
      group_id: groupId
    }
    targetList.value.push(newField)
  }

  // 关闭对话框并重置表单
  dialogVisible.value = false
  resetForm()
  currentSection.value = ''
  editingFieldRef.value = null
  // 通知父组件扩展字段已更新
  emit('update-custom-fields', getAllCustomFields())
}

const handle = (field, section = '') => {
  if (field && typeof field === 'object') {
    // 编辑模式：预填充表单数据
    curTitle.value = '编辑字段'
    customParam.value = {
      data_type: field.data_type || 'string',
      field_key: field.field_key,
      is_required: field.is_required || false,
      is_show: field.is_show,
      label: field.label,
      sort: field.sort || 0,
      id: field.id || '', // 保存字段的 id
      enum_type: field.enum_type !== undefined ? field.enum_type : false, // 编辑时保留枚举类型（false=单选，true=多选）
      options: field.options && Array.isArray(field.options) ? [...field.options] : [] // 编辑时保留选项列表
    }
    currentSection.value = field.section || section
    editingFieldRef.value = field
  } else {
    // 新增模式：重置表单
    curTitle.value = '新建字段'
    resetForm()
    currentSection.value = section
    editingFieldRef.value = null
  }
  dialogVisible.value = true
}

const del = async(field) => {
  await ElMessageBox.confirm('是否确定删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  // 根据是否有 id 来决定删除方式
  if (field.id) {
    // 已保存的字段，调用 modelDel 接口删除服务器端数据
    const deleteParams = {
      accessToken: store.userInfo?.accessToken,
      entity_id: props.data?.entity_id,
      entity_type: props.data?.entity_type,
      field_key: [field.field_key],
      module_id: props.data?.id || ''
    }

    const res = await modelDel(deleteParams) as any
    if (res.code === 200) {
      // 从对应的列表中删除字段
      const found = findFieldInAllLists(field.field_key)
      if (found) {
        found.list.splice(found.index, 1)
        // 重新更新排序
        found.list.forEach((item, idx) => {
          item.sort = idx
        })
        ElMessage.success('删除成功')
        // 通知父组件扩展字段已更新
        emit('update-custom-fields', getAllCustomFields())
      }
    }
  } else {
    // 未保存的字段，直接从对应的列表中删除
    const found = findFieldInAllLists(field.field_key)
    if (found) {
      found.list.splice(found.index, 1)
      // 重新更新排序
      found.list.forEach((item, idx) => {
        item.sort = idx
      })
      ElMessage.success('删除成功')
      // 通知父组件扩展字段已更新
      emit('update-custom-fields', getAllCustomFields())
    }
  }
}

// 拖拽开始处理
const handleDragStart = () => {
}

// 拖拽结束处理
const handleDragEnd = () => {
}

</script>
<style scoped lang="scss">
.info-setting {
  display: flex;
  gap: 48px;
  .form-section {
    flex: 1;
    .section-title {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 24px;
      span {
        font-size: 16px;
        color: #333333;
        line-height: 22px;
      }
      .line {
        width: 4px;
        height: 18px;
        background-color: var(--el-color-primary);
      }
    }
    :deep(.custom-form.el-form) {
      max-width: 700px;
      .el-form-item {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
        .el-form-item__label{
          min-width: unset;
          width: 90px;
          font-size: 14px;
          color: #333333;
          position: relative;
        }
        .avatar {
          width: 44px;
          height: 44px;
        }
        .input {
          height: 40px;
          border-radius: 2px;
        }
        .switch-label {
          margin-left: 16px;
        }
        .switch-text {
          font-size: 14px;
          color: #333333;
          white-space: nowrap;
        }
      }
    }
  }
  .desc_bg{
    display: flex;
    background-image: url("@/assets/img/address_book/sjmx.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 380px;
    height: 669px;
    overflow-y: hidden;
  }
  .preview-card {
    width: 75%;
    height: 75%;
    margin: 70px auto 0;
    padding: 0 20px 20px 20px;
    overflow-y: scroll;
    scrollbar-width: none;
    .preview-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
      .preview-avatar {
        width: 46px;
        height: 46px;
        border-radius: 50%;
      }
      .preview-name {
        font-size: 14px;
        color: #333333;
      }
      .preview-title {
        font-size: 10px;
        color: #666666;
      }
    }
    .preview-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      .preview-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        justify-content: space-between;
        .p_l {
          font-size: 12px;
          color: #333333;
        }
        .p_r{
          font-size: 10px;
          color: #333333;
        }
      }
    }
  }
}
:deep(.box_l){
  width: 360px !important;
}
.box_r{
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin-left: 8px;
}
:deep(.el-form-item__content){
  flex-wrap: nowrap;
}
.row_col{
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: move;
  .btn_icon{
    cursor: pointer;
    margin-bottom: 13px;
  }
  // 覆盖禁用状态的样式，让表单看起来可以拖拽
  :deep(.el-input.is-disabled .el-input__inner),
  :deep(.el-switch.is-disabled) {
    cursor: move;
  }
  &:hover {
    :deep(.el-input.is-disabled .el-input__inner) {
      background-color: #f5f7fa;
      border-color: #dcdfe6;
    }
    :deep(.el-switch.is-disabled) {
      opacity: 0.8;
    }
  }
}
.info-icon {
  color: #909399;
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
}

.label-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  width: 100%;
  padding-right: 15px;

  .field-label {
    flex-shrink: 0;
  }

  .info-icon {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.drag-handle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  flex-shrink: 0;

  .container_svg {
    cursor: move;
  }

  &:hover {
    opacity: 0.8;
  }
}

.add-custom-field-btn {
  width: 360px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 60px;
  cursor: pointer;
  margin-bottom: 24px;
  margin-top: 8px;
  margin-left: 110px;

  .add-icon {
    color: var(--el-color-primary);
  }

  span {
    font-size: 14px;
    color: var(--el-color-primary);
  }
}

.enum-options-container {
  width: 100%;

  .enum-option-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .enum-option-input {
      flex: 1;
    }

    .enum-option-delete {
      padding: 0;
      min-width: auto;
      color: #333333;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .enum-option-add {
    padding: 0;
    min-width: auto;
    color: var(--el-color-primary);
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
