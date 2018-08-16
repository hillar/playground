
    process.alias = 'test src/server/src/test.js'
    test = require('tape')
    test('src/server/src/test.js', function (t) {
      t.end()
    })
