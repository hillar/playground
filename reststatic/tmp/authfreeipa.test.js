process.alias = 'test AuthFreeIPA'
let L = require('../logger')
let l = new L()

let AFI = require('./authFreeIPA')
let afi = new AFI(l)
afi.verify('','')
afi.verify('a','')
