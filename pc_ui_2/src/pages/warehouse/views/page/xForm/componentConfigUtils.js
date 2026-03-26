/**
 Created by  lanjian   on 2022/1/5  9:42
 Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
 */

// import { format } from 'date-fns'
// 组件配置的js

const componentsConfig = {
  'text': {
    type: 'text',
    name: '文本',
    icon: 'text.png',
    width: 80, // 初始高度,宽度   px
    height: 32,
    containerStyle: {
      zIndex: 10,
      background: '#fff'
    },
    style: {
      color: '#000'
    },
    other: {
      content: '文本内容', // 文本内容
      field: '', // 绑定的主表字段
      fieldValue: '' // 填的主表字段值
    } // 保存组件用到的一些内容
  },
  'rancgle': {
    type: 'rancgle',
    name: '方框',
    icon: 'rancgle.png',
    width: 50, // 初始高度,宽度  px
    height: 50,
    containerStyle: {
      zIndex: 10,
      background: '#f4f4f400',
      border: '1px solid #666;'
    }, // 容器的样式
    style: {
      borderWidth: 0.5,
      borderColor: '#333',
      borderStyle: 'solid'
    },
    other: {}
  },
  'line': {
    type: 'line',
    name: '直线',
    icon: 'line.png',
    width: 20, // 初始高度,宽度  px
    height: 120,
    containerStyle: {
      zIndex: 10,
      background: '#ffffff00'
    },
    style: {
      strokeWidth: 3,
      stroke: 'black',
      strokeDasharray: ''
    },
    other: {}
  },
  'input': {
    type: 'input',
    name: '输入框',
    width: 200, // 初始高度,宽度   px
    height: 40,
    icon: 'input.png',
    containerStyle: {
      zIndex: 10,
      backgroundColor: '#fff'
    },
    style: {
      color: '#000',
      labelWidth: 100
    },
    other: {
      fieldValue: '', //
      type: 1 // 1 单行输入  2 多行输入
    }
  },
  // 'selectbox': {
  //   type: 'select',
  //   name: '选择框',
  //   width: 200, // 初始高度,宽度   px
  //   height: 40,
  //   icon: 'selectbox.png',
  //   containerStyle: {
  //     zIndex: 10,
  //     backgroundColor: '#fff'
  //   },
  //   style: {
  //   },
  //   other: {
  //     placeholder: '请选择',
  //     isShowDefault: true,
  //     options: []
  //   }
  // },
  'radio': {
    type: 'radio',
    name: '单选框',
    icon: 'radio.png',
    width: 260, // 初始高度,宽度   px
    height: 40,
    style: {
      color: '#000'
    },
    containerStyle: {
      zIndex: 10,
      backgroundColor: '#fff'
    },
    other: {
      options: [{ label: '选项一', value: '1' }, { label: '选项二', value: '2' }]
    }
  },
  'checkbox': {
    type: 'checkbox',
    name: '多选框',
    width: 260, // 初始高度,宽度   px
    height: 40,
    containerStyle: {
      zIndex: 10,
      backgroundColor: '#fff'
    },
    icon: 'checkbox.png',
    style: {
      color: '#000'
    },
    other: {
      options: [{ label: '选项一', value: '1' }, { label: '选项一', value: '2' }]
    }
  },
  // 'file': {
  //   type: 'file',
  //   name: '文件',
  //   icon: 'file.png',
  //   width: 260, // 初始高度,宽度   px
  //   height: 40,
  //   style: {},
  //   other: {}
  // },
  'image': {
    type: 'image',
    name: '图片',
    width: 100, // 初始高度,宽度   px
    height: 100,
    icon: 'bacode.png',
    style: {},
    other: {}
  },
  // 'date': {
  //   type: 'date',
  //   name: '日期',
  //   width: 200, // 初始高度,宽度   px
  //   height: 40,
  //   icon: 'selectbox.png',
  //   style: {},
  //   other: {
  //     nowDate: format(new Date(), 'yyyy-MM-dd'),
  //     valueFormat: 'yyyy-MM-dd'
  //   }
  // }
  'upload': {
    type: 'upload',
    name: '上传',
    width: 200, // 初始高度,宽度   px
    height: 40,
    icon: 'file.png',
    containerStyle: {
      zIndex: 10,
      backgroundColor: '#fff'
    },
    style: {
      color: '#000',
      labelWidth: 100
    },
    other: {
      fieldValue: '', //
      type: 1 // 1 单行输入  2 多行输入
    }
  }
}

export default componentsConfig

