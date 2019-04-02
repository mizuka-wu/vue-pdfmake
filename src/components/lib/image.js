export default function(src) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.onload = function() {
      let reader = new FileReader()
      reader.onloadend = function() {
        resolve(reader.result)
      }
      reader.readAsDataURL(xhr.response)
    }
    xhr.open('GET', src)
    xhr.responseType = 'blob'
    xhr.send()
    xhr.onerror = function() {
      reject(new Error('图片无法下载'))
    }
  })
}
