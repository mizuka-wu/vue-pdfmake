<template>
  <div v-show="show">
    <slot></slot>
  </div>
</template>

<script>
import debounce from 'debounce'
import getBase64Image from './lib/image.js'
import pdfMake from './lib/pdfmake.js'
import {
  DEBOUNCE_TIME,
  DEFAULT_IMAGE,
  PAGE_SIZE,
  PAFE_ORIENTATION,
  DOC_DEFINITION,
} from './lib/config.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    pageSize: {
      type: String,
      default: 'A4',
      validator(value) {
        return PAGE_SIZE.includes(value)
      },
    },
    pageOrientation: {
      type: String,
      default: 'portrait',
      validator(value) {
        return PAFE_ORIENTATION.includes(value)
      },
    },
    pageMargins: {
      type: Array,
    },
  },
  data() {
    return {
      content: [],
    }
  },
  computed: {
    docDefinition() {
      return {
        ...DOC_DEFINITION,
        pageSize: this.pageSize,
        pageOrientation: this.pageOrientation,
        pageMargins: this.pageMargins,
        content: this.content,
      }
    },
  },
  methods: {
    createPdf: debounce(function() {
      let vnodes = this.$slots.default || []
      this.content = this.vnodes2content(vnodes)
    }, DEBOUNCE_TIME),
    /**
     * vnode2content的方案
     * @param {vnode} vnode - vnode或者列数
     * @param {object[]} content - 内容
     * @returns {object[]}
     */
    vnode2content(vnode, content) {
      let data = vnode.data || {}

      let { staticStyle } = data

      let style = this.styleGenerater(staticStyle)

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
            .then(base64 => this.$set(node, 'image', base64))
            .then(() => content.push(node))
          break
        }
        case 'a': {
          let linkContent = this.vnodes2content(vnode.children)
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
            ul: this.vnodes2content(vnode.children),
          })
          break
        }
        case 'ol': {
          content.push({
            ul: this.vnodes2content(vnode.children),
          })
          break
        }
        default: {
          if (vnode.children) {
            return this.vnodes2content(vnode.children, content)
          }
        }
      }
      return content
    },
    /**
     * vnode列表转content的方法，reduce的代理
     * @param {vnodes} vnodes
     * @param {objectp[]} targetContent
     * @returns {object[]}
     */
    vnodes2content(vnodes = [], targetContent = []) {
      return vnodes.reduce(
        (content, vnode) => this.vnode2content(vnode, content),
        targetContent
      )
    },
    // style转pdfmake style
    styleGenerater(staticStyle = {}) {
      return Object.keys(staticStyle).reduce((style, attr) => {
        let value = staticStyle[attr]
        switch (attr) {
          case 'font-size':
            style.fontSize = Number((value + '').replace('px', ''))
        }
        return style
      }, {})
    },
  },
  watch: {
    docDefinition: {
      immediate: true,
      deep: true,
      handler(docDefinition) {
        const pdfDocGenerator = pdfMake.createPdf(docDefinition)
        pdfDocGenerator.getDataUrl(dataUrl => {
          this.$emit('change', dataUrl)
        })
      },
    },
  },
  mounted() {
    this.createPdf()
  },
}
</script>
