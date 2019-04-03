import getBase64Image from './image.js'
import { DEFAULT_IMAGE } from './config.js'

/**
 * 替换string 或者 value到一个具体数字
 * @param {string, number} value
 */
function value2number(value) {
  return Number((value + '').replace(';', '').replace('px', ''))
}

/**
 * vnode2content的方案
 * @param {vnode} vnode - vnode或者列数
 * @param {object[]} content - 内容
 * @param {object} parentStyle - 继承的style
 * @returns {object[]}
 */
export function vnode2content(vnode, content, parentStyle) {
  let data = vnode.data || {}

  let style = styleAdapter(vnode, parentStyle)

  switch (vnode.tag || '') {
    case '': {
      content.push({
        text: vnode.text,
        ...style,
      })
      break
    }
    /**
     * @todo 追加width height之类的
     */
    case 'img': {
      let node = {
        image: DEFAULT_IMAGE,
        ...style,
      }

      getBase64Image(data.attrs.src)
        .then(base64 => (node.image = base64))
        .then(() => content.push(node))
      break
    }
    case 'a': {
      let linkContent = vnodes2content(vnode.children, [], style)
      // @todo link渲染方案
      content.push({
        text: linkContent[0].text,
        link: data.attrs.href,
        ...style,
      })
      break
    }
    case 'ul': {
      content.push({
        ul: vnodes2content(vnode.children),
      })
      break
    }
    case 'ol': {
      content.push({
        ul: vnodes2content(vnode.children),
      })
      break
    }
    default: {
      if (vnode.children) {
        return vnodes2content(vnode.children, content, style)
      }
    }
  }
  return content
}

/**
 * vnode列表转content的方法，reduce的代理
 * @param {vnodes} vnodes
 * @param {object[]} [targetContent]
 * @param {object} [parentStyle] - 继承的style
 * @returns {object[]}
 */
export function vnodes2content(vnodes = [], targetContent = [], parentStyle) {
  return vnodes.reduce(
    (content, vnode) => vnode2content(vnode, content, parentStyle),
    targetContent
  )
}

/**
 * vnode的style和vue的适配器
 * @param {vnodeObject} vnode
 * @param {object} parentStyle
 * @return {object} 计算好的样式
 */
export function styleAdapter(vnode, parentStyle = {}) {
  let { data = {} } = vnode
  let { attrs = {}, normalizedStyle, staticStyle } = data
  let originStyle = Object.assign(
    {},
    attrs, // width height 这一类的属性
    staticStyle,
    normalizedStyle
  )

  if (originStyle.margin) {
    let margin = originStyle.margin.replace(';', '').split(' ')
    switch (margin.length) {
      case 1: {
        let value = margin[0]
        margin = [value, value, value]
        break
      }
      case 2: {
        margin = [...margin, ...margin]
        break
      }
    }
    // 赋值系列
    ;['top', 'right', 'bottom', 'left'].forEach((key, index) => {
      let value = margin[index] || 0
      originStyle['margin-' + key] = originStyle['margin-' + key] || value
    })
  }

  return Object.keys(originStyle).reduce(
    (style, attr) => {
      let value = originStyle[attr]
      switch (attr) {
        case 'font-size': {
          style.fontSize = value2number(value)
          break
        }
        case 'font-weight': {
          if (isNaN(value)) {
            style.bold = value.includes('bold')
          } else {
            style.bold = Number(value) >= 500
          }
          break
        }
        case 'font-style': {
          style.italics = value === 'italic'
          break
        }
        case 'text-align': {
          style.alignment = value
          break
        }
        case 'width': {
          style.width = value2number(value)
          break
        }
        case 'height': {
          style.height = value2number(value)
          break
        }
        // margin: [left, top, right, bottom] 需要特殊处理
        case 'margin-left': {
          style.margin[0] = value2number(value)
          break
        }
        case 'margin-top': {
          style.margin[1] = value2number(value)
          break
        }
        case 'margin-right': {
          style.margin[2] = value2number(value)
          break
        }
        case 'margin-bottom': {
          style.margin[3] = value2number(value)
          break
        }
      }
      return style
    },
    Object.assign(
      {
        margin: [0, 0, 0, 0],
      },
      parentStyle
    )
  )
}
