<template>
    <div></div>
</template>

<script>
import pdfMake from 'pdfmake'
// import pdfFonts from 'pdfmake-chinese/vfs_fonts'
// pdfMake.vfs = pdfFonts.pdfMake.vfs
// pdfMake.fonts = {
//     Roboto: {
//         normal: 'fonts/Roboto-Regular.ttf',
//         bold: 'fonts/Roboto-Medium.ttf',
//         italics: 'fonts/Roboto-Italic.ttf',
//         bolditalics: 'fonts/Roboto-MediumItalic.ttf',
//     },

//     方正黑体简体: {
//         normal: '方正黑体简体.TTF',
//         bold: '方正黑体简体.TTF',
//         italics: '方正黑体简体.TTF',
//         bolditalics: '方正黑体简体.TTF',
//     },
// }

const DOC_DEFINITION = {
    defaultStyle: {
        // font: '方正黑体简体'
    },
}

export default {
    computed: {
        docDefinition() {
            return {
                ...DOC_DEFINITION,
                content: ['你好'],
            }
        },
    },
}
</script>
