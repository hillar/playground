process.alias = 'test AuthBase'
let L = require('../logger')
let l = new L()

let A = require('./authbase')
let a = new A(l)
console.log(a.setters)
a.verify('a','b')
//a.verify('a','')
//a.verify('','')


l.debug('dummy')

class AuthDummy extends A {
  constructor (logger,directory,filename,) {
    super(logger,directory,filename)
  }
}
a = new AuthDummy(l)
a.cachetime = -1
console.log(a.setters)
try {
  a.verify('aa','bb')
} catch (e) {
  console.log('gut',e)
}
//a.verify('a','')
//a.verify('','')
