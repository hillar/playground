
    process.alias = 'test src/server/src/classes/check.js'
    test = require('tape')
    test('src/server/src/classes/check.js', function (t) {

      let L = require('../../src/classes/logger')
      t.equal(typeof L, 'function')
      let l = new L()
      t.equal(typeof l, 'object')


      let B = require('../../src/classes/check')
      t.equal(typeof B, 'function')
      t.throws(() => {const x = new B({})})
      //t.throws(() => {const y = new B()})
      t.throws(() => {const x = new B(l,1)})
      let b
      b = new B(l)
      t.equal(b.isdefined,false)
      b = new B(l,'*')
      t.equal(typeof b, 'object')
      t.equal(b.isdefined,true)
      t.equal(b.inlist(''),true)
      t.equal(b.inlist('ascsb sfbs '),true)
      t.equal(b.inlist(['ascsb sfbs ']),true)
      for (const chk of [ 10 ,true,{B}]) {
        t.throws(() => { b.inlist(chk)})
      }
      b.checklist = 'test'
      t.deepEqual(b.checklist, 'test')
      t.equal(b.inlist('test'),true)
      t.equal(b.inlist(['test']),true)
      for (const chk of [ 10 ,true,{B}]) {
        t.throws(() => { b.inlist(chk)})
      }
      b.checklist = ['test']
      t.deepEqual(b.checklist, 'test')
      b.checklist = ['test','test','test']
      t.deepEqual(b.checklist, 'test')
      b.checklist = ['test','test2','test3']
      t.deepEqual(b.checklist, ['test','test2','test3'])

      for (const chk of [ 10 ,true,{B}]) {
        t.throws(() => {const y = new B(l,chk)})
      }

      for (const chk of [ [10], [true], [{B}]]) {
        t.doesNotThrow(() => {const y = new B(l,chk)})
      }

      t.end()
    })
