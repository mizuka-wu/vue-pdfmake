// // 待抽取字体的汉字
// var text = '精简字体';

// // 引入font-carrier.js
// var fontCarrier = require('font-carrier');

// // 加载字体，查看了下这个字体文件大小3M左右
// var transFont = fontCarrier.transfer('fonts/方正胖头鱼简体.ttf');

// // 创建目标字体
// var font = fontCarrier.create();

// // 向字体中写入抽取的字形信息
// if (text.length === 1)
//     font.setGlyph(text, transFont.getGlyph(text));
// else
//     font.setGlyph(transFont.getGlyph(text));

// // 将字体写入文件
// font.output({
//    path:'./font-min.ttf'
// });
