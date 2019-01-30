tre-image-size
---

A small pull-stream wrapper around a couple of image size detectors provided by [image-sise](https://www.npmjs.com/package/image-size).

Currently supported formats:

-  jpg
-  png
-  svg
-  webp

```
const detect = require('.')
const pull = require('pull-stream')
const file = require('pull-file')

pull(
  file('fixtures/bmp_24.png'),
  detect(meta => {
    t.equal(meta.format, 'png')
    t.equal(meta.width, 200)
    t.equal(meta.height, 200)
  }),
  pull.onEnd( err => {
    t.error(err)
  })
)
```

## API

### `detect(onMeta [, opts])`

Options are

- maxBufferSize Don't buffer more than this amout of bytes. If no format was detected, give up.
Defaults to 512 * 1024 (512kb)

---
License: MIT
