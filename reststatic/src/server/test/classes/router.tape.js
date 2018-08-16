
    process.alias = 'test src/server/src/classes/router.js'
    test = require('tape')
    test('src/server/src/classes/router.js', function (t) {
      //t.fail('no tests for src/server/src/classes/router.js')
      let L = require('../../src/classes/logger')
      let l = new L()
      let R = require('../../src/classes/route')
      let B = require('../../src/classes/router')
      let b
      b = new B(null,null,null,{kala:{get:()=>{},post:()=>{}}})
      t.deepEqual(b.kala.methods,[ 'get', 'post' ])
      b = new B(null,null,null,{maja:new R()})
      t.deepEqual(b.maja.methods,[])
      t.end()
    })
