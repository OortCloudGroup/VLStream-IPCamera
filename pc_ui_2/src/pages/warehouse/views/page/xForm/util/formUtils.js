
/**
 * @param {Array} tableField  主表字段列表
 * @description: 根据主表字段来生成录入界面和搜索界面
 */
export const generateInterfaceJSON = (tableField) => {
  let formArr = []
  if (tableField.length > 0) {
    let item = tableField[0]
    formArr.push(generateInput(item.field, item.name, 20, 20, 640, 58, 2))
  }
  for (let i = 1; i < tableField.length; i = i + 2) {
    let item1 = tableField[i]
    formArr.push(generateInput(item1.field, item1.name, 20, 30 * i + 58, 300, 40, 1))
    if (tableField.length > i + 1) {
      let item2 = tableField[i + 1]
      formArr.push(generateInput(item2.field, item2.name, 360, 30 * i + 58, 300, 40, 1))
    }
  }
  return formArr
}

/**
 * @param {Array} tableField  主表字段列表
 * @description: 根据主表字段来生成 浏览界面
 */
export const generateBrowerInterfaceJSON = (tableField) => {
  let browserFieldList = []
  tableField.forEach(item => {
    browserFieldList.push({
      field: item.field,
      name: item.name,
      isShow: true,
      width: 80 // 默认宽度
    })
  })
  return browserFieldList
}

/**
 * @param {String} field  主表字段
 * @param {String} text - 主表字段描述
 * @param {Number} left - 组件left值
 * @param {Number} top - 组件top值
 * @param {Number} width - 组件宽度值
 * @param {Number} height - 组件高度值
 * @return {Object} text - 返回组件的对象结构
 * @description: 生成一个text 组件的对象
 */
export const generateText = (field, text, left, top, width, height) => {
  let textJ = {
    type: 'text',
    name: '文本',
    icon: 'text.png',
    width: width || 80, // 初始高度,宽度   px
    height: height || 32,
    left: left,
    top: top,
    id: 'text' + generateUUID(),
    containerStyle: {
      zIndex: 10,
      background: '#fff'
    },
    style: {},
    other: {
      name: text,
      field: field,
      content: text // 文本内容
    }
  }
  return textJ
}

/**
 * @param {String} field  主表字段
 * @param {String} text - 主表字段描述
 * @param {Number} left - 组件left值
 * @param {Number} top - 组件top值
 * @param {Number} width - 组件宽度值
 * @param {Number} height - 组件高度值
 * @return {Object} text - 返回组件的对象结构
 * @return {Number} type - 输入框类型  多选还是单选
 * @description: 生成一个input 组件的对象
 */
export const generateInput = (field, text, left, top, width, height, type) => {
  let inputJ = {
    type: 'input',
    name: '输入框',
    icon: 'text.png',
    width: width || 200, // 初始高度,宽度   px
    height: height || 40,
    left: left,
    top: top,
    id: 'input' + generateUUID(),
    containerStyle: {
      zIndex: 10,
      background: '#fff'
    },
    style: {
      color: '#333'
    },
    other: {
      value: '',
      field: field,
      name: text,
      content: text, // 文本内容
      type: 1 || type
    }
  }
  return inputJ
}

/**
 * 获取线条元素路径字符串
 * @param element 线条元素
 * @param element 是否直线 true， 曲线false
 */
export const getLineElementPath = (element, broken = true) => {
  const start = element.start.join(',')
  const end = element.end.join(',')
  if (broken) {
    // const mid = element.mid.join(',')
    return `M${start}  L${end}`
  } else {
    // const mid = element.mid.join(',')
    return `M${start}  ${end}`
  }
}

/**
 * 生成UUID
 * @returns {string}
 */
export const generateUUID = () => {
  let d = new Date().getTime()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function(c) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16)
    }
  )
  return uuid
}

/**
 * 判断当前网络环境
 */
export const isWifi = () => {
  try {
    let wifi = true
    let ua = window.navigator.userAgent
    let con = window.navigator.connection
    // 如果是微信
    if (/MicroMessenger/.test(ua)) {
      if (ua.indexOf('WIFI') >= 0) {
        return true
      } else {
        wifi = false
      }
      // 如果支持navigator.connection
    } else if (con) {
      let network = con.type
      if (
        network !== 'wifi' &&
                network !== '2' &&
                network !== 'unknown'
      ) {
        wifi = false
      }
    }
    return wifi
  } catch (e) {
    return false
  }
}

/**
 * 首字母大写
 * @param str
 * @returns {string}
 */
export const fistLetterUpper = str => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 过滤非法字符串
 */
export const illegalFilter = str => {
  let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
  let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im

  if (regEn.test(str) || regCn.test(str)) return false
  return true
}
// 验证邮箱
export function isEmail(val) {
  let myreg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/
  return myreg.test(val)
}
/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()
/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/** *
 * 对象数组去重
 * @param objArray 去重的对象数组
 * @param valueKey 比较的属性值
 * @returns {*}  返回去重后的对象数组
 */
export const getUniqueArr = (objArray, valueKey) => {
  let hash = {}
  objArray = objArray.reduce(function(item, next) {
    hash[next[valueKey]] ? '' : hash[next[valueKey]] = true && item.push(next)// 与func3逻辑相似
    return item
  }, [])
  return objArray
}

/** *
 * 对象数组去重
 * @param objArray 去重的对象数组
 * @param valueKey 比较的属性值
 * @returns {*}  返回去重后的对象数组
 */
export const getExistValueArr = (tempArr, valueKey, value) => {
  if (tempArr && tempArr.length > 0) {
    return tempArr.findIndex(item => {
      return item[valueKey] === value
    })
  }
  return -1
}

// 深拷贝对象
export function deepClone(obj) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags = []
    if (obj.global) { flags.push('g') }
    if (obj.multiline) { flags.push('m') }
    if (obj.ignoreCase) { flags.push('i') }

    return new RegExp(obj.source, flags.join(''))
  }

  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

  for (const key in obj) {
    result[key] = deepClone(obj[key])
  }

  return result
}

// 返回一个全局的唯一id
export function getGlobalId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 是否数字字符串
export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

// 校验ip
export function isValidIP(ip) {
  let reg = /^((\d{1}|[1-9]{1}\d{1}|1\d{2}|2[0-4]\d{1}|25[0-5])(\.(\d{1}|[1-9]{1}\d{1}|1\d{2}|2[0-4]\d{1}|25[0-5])){3})$/
  return reg.test(ip)
}

// 校验域名
export function isValidDomain(ip) {
  let reg = /^([\w\-\._]+)$/
  return reg.test(ip)
}

function ttrim(value) {
  if (Object.prototype.toString.call(value) === '[object String]') {
    value = value.trim()
  }
  return value
}

// isNil
export function isNil(s) {
  return undefined === s || s === 'undefined' || s === null || ttrim(s) === '' || ttrim(s) === 'null'
}

export function getCurrentMilliSeconds() {
  return Math.round(new Date().getTime())
}

// 返回当前字体大小
export function getFontSize(num) {
  // 判断是否在corodav
  return Math.ceil((num / 1920) * window.screen.width)
}

export function createIframe() {
  const iframe = document.createElement('iframe')
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.position = 'absolute'
  iframe.style.right = '0'
  iframe.style.top = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)
  return iframe
}

export const writeContent = (doc, printNode, size) => {
  const docType = '<!DOCTYPE html>'
  let style = ''
  const styleSheets = document.styleSheets
  if (styleSheets) {
    for (const styleSheet of styleSheets) {
      if (!styleSheet.cssRules) continue
      for (const rule of styleSheet.cssRules) {
        style += rule.cssText
      }
    }

    const { width, height, margin } = size
    const head = `
    <head>
      <style type="text/css">
        ${style}
        html, body {
          height: auto;
          overflow: auto;
        }
        @media print {
          @page {
            size: ${width + 2 * margin}mm ${height + 2 * margin}mm;
            margin: ${margin}px;
          }
        }
      </style>
    </head>
  `
    const body = '<body>' + printNode.innerHTML + '</body>'
    doc.open()
    doc.write(`
    ${docType}
    <html>
      ${head}
      ${body}
    </html>
  `)
    doc.close()
  }
}

export const print = (printNode, size) => {
  const iframe = createIframe()
  const iframeContentWindow = iframe.contentWindow

  if (!iframe.contentDocument || !iframeContentWindow) return
  writeContent(iframe.contentDocument, printNode, size)

  const handleLoadIframe = () => {
    iframeContentWindow.focus()
    iframeContentWindow.print()
  }

  const handleAfterprint = () => {
    iframe.removeEventListener('load', handleLoadIframe)
    iframeContentWindow.removeEventListener('afterprint', handleAfterprint)
    document.body.removeChild(iframe)
  }

  iframe.addEventListener('load', handleLoadIframe)
  iframeContentWindow.addEventListener('afterprint', handleAfterprint)
}
