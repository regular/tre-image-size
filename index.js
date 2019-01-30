const pull = require('pull-stream')
const BufferList = require('bl')
const debug = require('debug')('tre-file-size')

// Note: it's written like this, so it can be browserified
const formats = {
  //bmp: require('image-size/lib/types/bmp'),
  //cur: require('image-size/lib/types/cur'),
  //dds: require('image-size/lib/types/dds'),
  //gif: require('image-size/lib/types/gif'),
  //icns: require('image-size/lib/types/icns'),
  //ico: require('image-size/lib/types/ico'),
  jpeg: require('image-size/lib/types/jpg'),
  png: require('image-size/lib/types/png'),
  //psd: require('image-size/lib/types/psd'),
  svg: require('image-size/lib/types/svg'),
  //tiff: require('image-size/lib/types/tiff'),
  webp: require('image-size/lib/types/webp')
}

formats.jpeg.bufferSizeForDetection = 2
formats.png.bufferSizeForDetection = 32
formats.svg.bufferSizeForDetection = 5
formats.webp.bufferSizeForDetection = 15 

module.exports = function(onMeta, opts) {
  opts = opts || {}
  const maxBufferSize = opts.maxBufferSize || 512 * 1024
  let bl = BufferList()
  let format
  let meta
  return pull.through( buff => {
    if (meta || !bl) return
    bl.append(buff)
    debug('(%d bytes buffered)', bl.length)
    if (!format) {
      for(let f in formats) {
        if (formats[f].bufferSizeForDetection < bl.length) {
          try {
            debug('testing %s', f)
            if (formats[f].detect(bl)) {
              format = f
              debug('detected file format: %s', format)
              break
            }
          } catch(e) {
            debug(
              '%s image format detaction failed %s (%d bytes buffered)',
              format, e.message, bl.length
            )
          }
        }
      }
    }
    if (format) {
      try {
        meta = formats[format].calculate(bl)
        meta.format = formats[format].mime || format
        debug('detected file meta %o', meta)
        bl = null
      } catch(e) {
        debug('%s image size detaction failed %s (%d bytes buffered)', format, e.message, bl.length)
      }
      if (meta) onMeta(Object.assign({format}, meta))
      return
    }
    if (bl.length > maxBufferSize) {
      debug('giving up')
      bl = null
    }
  })
}
