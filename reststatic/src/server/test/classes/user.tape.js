
    process.alias = 'test src/server/src/classes/user.js'
    test = require('tape')
    test('src/server/src/classes/user.js', function (t) {

      let L = require('../../src/classes/logger')
      t.equal(typeof L, 'function')
      let l = new L()
      t.equal(typeof l, 'object')

      let B = require('../../src/classes/user')
      t.equal(typeof B, 'function')
      //let b = new B(l,'uid', 'ssn', 'fn', 'ln', 'ou', 'manager', 'emails', 'phones', 'roles', 'groups')
      let b = new B(l,'', '', 'fn', 'ln', 'ou', 'manager', 'emails', 'phones', 'roles', 'groups')

      t.equal(typeof b, 'object')
      t.deepEqual(b.setters,[ 'uid', 'ssn', 'fn', 'ln', 'ou', 'manager', 'emails', 'phones', 'roles', 'groups' ])
      //for i in uid ssn fn ln ou manager emails phones roles groups; do echo "t.throws(()=>{b.$i = 1})"; done
t.throws(()=>{b.uid = 1})
t.throws(()=>{b.ssn = 1})
t.throws(()=>{b.fn = 1})
t.throws(()=>{b.ln = 1})
t.throws(()=>{b.ou = 1})
t.throws(()=>{b.manager = 1})
t.throws(()=>{b.emails = 1})
t.throws(()=>{b.phones = 1})
t.throws(()=>{b.roles = 1})
t.throws(()=>{b.groups = 1})

//for i in emails phones roles groups; do echo "t.deepEqual(b.$i = ['test','$i'],['test','$i'])"; done
t.deepEqual(b.emails = ['test','emails'],['test','emails'])
t.deepEqual(b.phones = ['test','phones'],['test','phones'])
t.deepEqual(b.roles = ['test','roles'],['test','roles'])
t.deepEqual(b.groups = ['test','groups'],['test','groups'])

      t.end()
    })
