<template>
    <iframe
        v-if="preview"
        :src="preview"
        style="height: 100%;"
        frameborder="0"
    ></iframe>
</template>

<script>
import debounce from 'debounce'
import * as pdfMake from 'pdfmake-support-chinese-fonts/pdfmake.min'
import * as pdfFonts from 'pdfmake-support-chinese-fonts/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs
pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Regular.ttf',
        italics: 'Roboto-Regular.ttf',
        bolditalics: 'Roboto-Regular.ttf',
    },
    fangzhen: {
        normal: 'fzhei-jt.TTF',
        bold: 'fzhei-jt.TTF',
        italics: 'fzhei-jt.TTF',
        bolditalics: 'fzhei-jt.TTF',
    },
}

const DEBOUNCE_TIME = 1000

/**
 * 默认字体修改
 */
const DOC_DEFINITION = {
    defaultStyle: {
        font: 'fangzhen',
    },
}

export default {
    data() {
        return {
            preview: null,
        }
    },
    computed: {
        docDefinition() {
            return {
                ...DOC_DEFINITION,
                content: ['你好'],
            }
        },
    },
    watch: {
        docDefinition: {
            immediate: true,
            handler: debounce(function(docDefinition) {
                const pdfDocGenerator = pdfMake.createPdf(docDefinition)
                pdfDocGenerator.getDataUrl(dataUrl => {
                    this.preview = dataUrl
                })
            }, DEBOUNCE_TIME),
        },
    },
}
</script>
