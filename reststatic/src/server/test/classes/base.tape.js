process.alias = 'test Base'

const LOGMETHODS  =  require('../../src/classes/logmethods')

test = require('tape')
test('base class', function (t) {

  let L = require('../../src/classes/logger')
  t.equal(typeof L, 'function')
  let l = new L()
  t.equal(typeof l, 'object')


  let B = require('../../src/classes/base')
  t.equal(typeof B, 'function')
  t.throws(() => {const x = new B({})})
  t.throws(() => {const y = new B()})
  let b = new B(l)
  t.equal(typeof b, 'object')
  t.deepEqual(b.setters, [])
  for (const method of LOGMETHODS) {
    t.equal(typeof b['log_'+method], 'function')
  }
  // test list of setters
  class BB extends B {
    constructor(...params) {
      super(...params)
    }
    set test (t) { this._test = t}
  }

  let bb = new BB(l)
  t.deepEqual(bb.setters, ['test'])

  for (const method of LOGMETHODS) {
    t.equal(typeof bb['log_'+method], 'function')
  }
  //bb.logger = ''
  t.throws(() => {bb.logger = ''},'Error: BB :: no logger')

  t.throws(() => {const q = new BB({})},'Error: BB :: logger has no method ' + LOGMETHODS[0])
  t.throws(() => {const w = new BB()})





  t.end()
})
