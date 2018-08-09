const Base = require('./base')
const Check = require('./check')

module.exports = class RolesAndGroups extends Base {
  constructor (logger, roles, groups ) {
    super(logger)
    Object.defineProperty(this, '_roles', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: new Check(logger, roles)
    })
    if (typeof groups === 'undefined') groups = '*'
    Object.defineProperty(this, '_groups', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: new Check(logger, groups)
    })
    //this._roles =  new Check(logger, roles)
    //this._groups =  new Check(logger, groups)
  }

  get roles () { return this._roles.checklist }
  set roles (roles) { this._roles.checklist = roles }
  isinroles (t) {return this._roles.inlist(t)}

  get groups () { return this._groups.checklist }
  set groups (groups) {
    if (typeof groups === 'undefined') groups = '*'
    this._groups.checklist = groups
  }
  isingroups (t) {return this._groups.inlist(t)}

  allowed (t) { return (this.isinroles(t) && this.isingroups(t)) }

}

/*

process.alias = 'test rolesAndGroups'
let L = require('../logger')
let l = new L()


const t = 'kala'
let q,w,e
let AG = require('./rolesandgroups')
let a = '*'
let g = [q,w,e]
let ag = new AG(l,a,g)
console.log(ag.isinroles('t'))
console.log(ag.isingroups('t'))
console.log(ag.setters,ag._roles.checklist,ag._groups.checklist)

*/
