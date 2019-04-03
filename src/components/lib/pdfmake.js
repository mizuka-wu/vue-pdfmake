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

export default pdfMake
