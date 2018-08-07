
    process.alias = 'test src/server/src/classes/logmethods.js'
    test = require('tape')
    test('src/server/src/classes/logmethods.js', function (t) {
      //t.fail('no tests for src/server/src/classes/logmethods.js')
      t.skip('only const here')
      t.end()
    })

/*
    let L = require('../logger')
    let l = new L()


    const t = 'kala'
    let C = require('./check')
    let c = new C(l,'*')
    c.checklist
    c.inlist(t)

    c.checklist = t
    c.checklist
    c.inlist(t)

    c = new C(l,t)
    c.checklist
    c.inlist(t)

    c = new C(l,[''])
    console.log(c.checklist)
    console.dir(c)
    console.log(c.inlist(t))
*/
