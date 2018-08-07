
    process.alias = 'test src/server/src/classes/authfreeipa.js'
    test = require('tape')
    test('src/server/src/classes/authfreeipa.js', function (t) {
      let L = require('../../src/classes/logger')
      t.equal(typeof L, 'function')
      let l = new L()
      t.equal(typeof l, 'object')

      let B = require('../../src/classes/authfreeipa')
      t.equal(typeof B, 'function')
      t.throws(() => {const x = new B({})})
      t.throws(() => {const y = new B()})
      t.throws(() => {const y = new B(l,1)})
      t.throws(() => {const y = new B(l,'./',1)})
      let b = new B(l)
      t.equal(typeof b, 'object')
      t.deepEqual(b.setters, [ 'server', 'base', 'binduser', 'bindpass', 'field', 'cachetime', 'cachedir', 'cachefile' ])

      t.deepEqual(b.config,{ server: 'localhost', base: 'cn=accounts,dc=example,dc=org', binduser: 'bu', bindpass: 'bp', field: 'uid', cachetime: 60000, cachedir: './', cachefile: 'users.json' })


      t.end()
    })
