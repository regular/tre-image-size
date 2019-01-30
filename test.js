const detect = require('.')
const file = require('pull-file')
const pull = require('pull-stream')
const test = require('tape')

// ball-triangle.svg  beaver.jpg  bmp_24.png  exif.jpeg

test('png', t => {
  t.plan(4)
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
})

test('beaver.jpg', t => {
  t.plan(4)
  pull(
    file('fixtures/beaver.jpg'),
    detect(meta => {
      t.equal(meta.format, 'jpg')
      t.equal(meta.width, 320)
      t.equal(meta.height, 212)
    }),
    pull.onEnd( err => {
      t.error(err)
    })
  )
})

test('exif.jpeg', t => {
  t.plan(4)
  pull(
    file('fixtures/exif.jpeg'),
    detect(meta => {
      t.equal(meta.format, 'jpg')
      t.equal(meta.width, 2048)
      t.equal(meta.height, 1536)
    }),
    pull.onEnd( err => {
      t.error(err)
    })
  )
})

test('ball-triagle.svg', t => {
  t.plan(4)
  pull(
    file('fixtures/ball-triangle.svg'),
    detect(meta => {
      t.equal(meta.format, 'svg')
      t.equal(meta.width, 57)
      t.equal(meta.height, 57)
    }),
    pull.onEnd( err => {
      t.error(err)
    })
  )
})

test('4.sm.webp', t => {
  t.plan(4)
  pull(
    file('fixtures/4.sm.webp'),
    detect(meta => {
      t.equal(meta.format, 'webp')
      t.equal(meta.width, 320)
      t.equal(meta.height, 241)
    }),
    pull.onEnd( err => {
      t.error(err)
    })
  )
})
