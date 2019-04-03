<template>
  <div v-show="show">
    <slot></slot>
  </div>
</template>

<script>
import debounce from 'debounce'
import { vnodes2content } from './lib/vnodeHelper.js'
import pdfMake from './lib/pdfmake.js'
import {
  DEBOUNCE_TIME,
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
    info: {
      type: Object,
      default() {
        return {}
      },
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
        info: this.info,
        pageSize: this.pageSize,
        pageOrientation: this.pageOrientation,
        pageMargins: this.pageMargins,
        content: this.content,
        ...DOC_DEFINITION,
      }
    },
  },
  methods: {
    createPdf: debounce(function() {
      let vnodes = this.$slots.default || []
      this.content = vnodes2content(vnodes)
    }, DEBOUNCE_TIME),
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
