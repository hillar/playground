process.alias = 'test Base'

const LOGMETHODS  =  require('../../src/classes/logmethods')

test = require('tape')
test('base class', function (t) {

  let B = require('../../src/classes/base')
  t.equal(typeof B, 'function')
  t.throws(() => {const x = new B({})})
  t.throws(() => {const y = new B('a')})

  let L = require('../../src/classes/logger')
  let l = new L()
  let b = new B(l)
  t.equal(typeof b, 'object')
  t.equal(b.typeof , 'Base')
  t.deepEqual(b.setters, [])
  for (const method of LOGMETHODS) {
    t.equal(typeof b['log_'+method], 'function')
    t.equal(typeof b.logger[method], 'function')
  }
  // test list of setters
  class BB extends B {
    constructor(...params) {
      super(...params)
    }

    set test (testvalue) {
      Object.defineProperty(this, '_test', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: testvalue
      })
    }
    get test () { return this._test }
  }

  let bb = new BB(l)
  t.equal(bb.typeof , 'BB')
  t.deepEqual(bb.setters, ['test'])
  t.deepEqual(Object.keys(bb), [])
  bb.test = 'kala'
  t.deepEqual(Object.keys(bb), [])
  t.equal(bb.test, 'kala')
  bb.kala = 'test'
  t.deepEqual(Object.keys(bb), ['kala'])
  t.equal(bb.kala, 'test')
  t.deepEqual(bb.setters, ['test'])
  for (const method of LOGMETHODS) {
    t.equal(typeof bb['log_'+method], 'function')
  }
  //bb.logger = ''
  t.throws(() => {bb.logger = ''},'Error: BB :: no logger')

  t.throws(() => {const q = new BB({})},'Error: BB :: logger has no method ' + LOGMETHODS[0])
  t.throws(() => {const w = new BB(()=>{})})





  t.end()
})
