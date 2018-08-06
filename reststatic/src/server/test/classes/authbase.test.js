
    process.alias = 'test src/server/src/classes/authbase.js'
    test = require('tape')
    test('src/server/src/classes/authbase.js', function (t) {
      let L = require('../../src/classes/logger')
      t.equal(typeof L, 'function')
      let l = new L()
      t.equal(typeof l, 'object')


      let B = require('../../src/classes/authbase')
      t.equal(typeof B, 'function')
      //const z = new B(l,1,2)
      t.throws(() => {const x = new B({})})
      t.throws(() => {const y = new B()})
      t.throws(() => {const y = new B(l,1)})
      t.throws(() => {const y = new B(l,'./',1)})
      let b = new B(l)
      t.equal(typeof b, 'object')
      t.throws(() => {b.cachefile = 1})
      t.throws(() => {b.cachedir = 2})
      t.throws(() => {b.verify()}) // no user
      t.throws(() => {b.verify('')}) // no pass
      class BB extends B {
        constructor(...params) {
          super(...params)
        }
      }
      let bb = new BB(l)
      bb.cachetime = -1
      t.equal(bb.cachetime,-1)
      let u = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
      t.throws(()=>{bb.verify(u,u)})
      t.deepEqual(b.config,{ settings: [ 'cachetime', 'cachedir', 'cachefile' ] })

      t.end()
    })
