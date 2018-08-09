const Base = require('./base')
const Check = require('./check')

module.exports = class RolesAndGroups extends Base {

  constructor (logger, roles, groups ) {
    super(logger)
    //  add roles & groups non enumerable
    Object.defineProperty(this, '_roles', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: new Check(logger, roles)
    })

    Object.defineProperty(this, '_groups', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: new Check(logger, groups)
    })
  }

  get roles () { return this._roles.checklist }
  set roles (roles) { this._roles.checklist = roles }
  isinroles (t) {return this._roles.inlist(t)}

  get groups () { return this._groups.checklist }
  set groups (groups) {
    this._groups.checklist = groups
  }
  isingroups (t) {return this._groups.inlist(t)}

  allowed (t) { return (this.isinroles(t) && this.isingroups(t)) }

  get isdefined () { return this._roles.isdefined || this._groups.isdefined }

}
