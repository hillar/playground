const ldap = require('ldapjs')
const AuthBase = require('./authbase')



module.exports = class AuthFreeIPA extends AuthBase {
  constructor (logger,directory,filename,) {
    super(logger,directory,filename)
  }
  /*
  reallyVerify () {

  }
  */
}



process.alias = 'test AuthFreeIPA'
let L = require('../logger')
let l = new L()

let AFI = require('./authFreeIPA')
let afi = new AFI(l)
//console.log(afi.setters)
/*
a.verify('a','')
a.verify('','b')
a.verify('a','b')
*/
