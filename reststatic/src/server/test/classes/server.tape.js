
    process.alias = 'test src/server/src/classes/server.js'
    test = require('tape')
    test('src/server/src/classes/server.js', function (t) {
      t.fail('no tests for src/server/src/classes/server.js')
      t.end()
    })

    