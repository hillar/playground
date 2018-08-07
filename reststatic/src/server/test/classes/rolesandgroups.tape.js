
    process.alias = 'test src/server/src/classes/rolesandgroups.js'
    test = require('tape')
    test('src/server/src/classes/rolesandgroups.js', function (t) {
      let L = require('../../src/classes/logger')
      t.equal(typeof L, 'function')
      let l = new L()
      t.equal(typeof l, 'object')


      let B = require('../../src/classes/rolesandgroups')
      t.equal(typeof B, 'function')
      t.throws(() => {const x = new B({})})
      t.throws(() => {const y = new B()})
      let b = new B(l,'*')
      t.equal(typeof b, 'object')

      t.throws(() => {const y = new B(l)})
      for (const chk of [ 10 ,true,{B}]) {
        t.throws(() => {b.roles = chk})
        t.throws(() => {const y = new B(l,chk)})
        t.throws(() => {b.groups = chk})
        t.throws(() => {const y = new B(l,'*',chk)})
      }
      b.roles = ['test','test']
      b.groups = 'test'
      t.deepEqual(b.roles,b.groups)
      b.roles = 'test'
      b.groups = ['test','test']
      t.deepEqual(b.roles,b.groups)
      t.equal(b.isinroles('test'), true)
      t.equal(b.isingroups('test'), true)
      t.equal(b.allowed('test'), true)


      t.end()
    })
