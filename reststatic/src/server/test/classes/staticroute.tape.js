
    process.alias = 'test src/server/src/classes/staticroute.js'
    test = require('tape')
    test('src/server/src/classes/staticroute.js', function (t) {
      let L = require('../../src/classes/logger')
      let l = new L()
      let B = require('../../src/classes/staticroute')
      let b
      b = new B(l)
      t.deepEqual(b.methods,[ 'get' ])
      b.root = './sadas'
      b.route = 'kala'
      t.deepEqual(b.path,'sadas/kala')
      b.groups = 'g'
      b.roles = 'r'
      t.deepEqual(b.config,{ root: './sadas', route: 'kala', roles: 'r', groups: 'g', get: { roles: undefined, groups: undefined } })
      t.end()
    })