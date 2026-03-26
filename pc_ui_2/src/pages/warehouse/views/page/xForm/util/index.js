/**
 * 创建一个隐藏的iframe元素。
 *
 * 该函数用于动态创建一个iframe元素，并将其样式设置为完全不可见，然后将其添加到文档的body元素中。
 * 这种做法常用于一些需要在后台运行的场景，比如加载外部资源或实现跨域通信等。
 *
 * @returns {HTMLIFrameElement} 返回创建的iframe元素。
 */
export function createIframe() {
  // 创建一个iframe元素
  const iframe = document.createElement('iframe')

  // 设置iframe的样式，使其完全不可见
  // 并将其定位到页面的右上角，避免影响页面布局
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.position = 'absolute'
  iframe.style.right = '0'
  iframe.style.top = '0'
  iframe.style.border = '0'

  // 将iframe元素添加到文档的body中
  document.body.appendChild(iframe)

  // 返回创建的iframe元素
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

