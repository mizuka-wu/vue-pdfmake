<template>
  <div v-show="show" class="vue-pdfmake-container">
    <slot name="background" />
    <slot name="header" :currentPage="1" :pageCount="1" :pageSize="1" />
    <slot />
    <slot name="footer" :currentPage="1" :pageCount="1" />
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
      background: [],
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
        background: this.background,
        header: this.header,
        content: this.content,
        footer: this.footer,
        ...DOC_DEFINITION,
      }
    },
  },
  methods: {
    createPdf: debounce(function() {
      this.content = vnodes2content(this.$slots.default || []) // 正文
    }, DEBOUNCE_TIME),
  },
  watch: {
    docDefinition: {
      immediate: true,
      handler: debounce(function(docDefinition) {
        const pdfDocGenerator = pdfMake.createPdf(docDefinition)
        pdfDocGenerator.getDataUrl(dataUrl => {
          this.$emit('change', dataUrl)
        })
      }, DEBOUNCE_TIME),
    },
  },
  mounted() {
    this.createPdf()
  },
}
</script>
<style>
.vue-pdfmake-container * {
  display: block;
  color: #000000;
  padding: 0 !important;
  margin: 0;
}

.vue-pdfmake-container a {
  text-decoration: none;
}
</style>
