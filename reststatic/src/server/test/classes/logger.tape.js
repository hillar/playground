process.alias = 'test Logger'

const TESTING = [
  'emerg',
  'alert',
  'crit',
  'err',
  'warning',
  'notice',
  'info',
  'debug',
]

const LOGMETHODS  =  require('../../src/classes/logmethods')

test = require('tape')
test('logger class', function (t) {

  t.deepEqual(LOGMETHODS,TESTING)

  let L = require('../../src/classes/logger')
  t.equal(typeof L, 'function')
  let l = new L()
  t.equal(typeof l, 'object')
  
  for (const method of LOGMETHODS) {
    t.equal(typeof l[method], 'function')
  }

  t.end()
})
