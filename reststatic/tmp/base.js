const LOGMETHODS = [
  'emerg',
  'alert',
  'crit',
  'err',
  'warning',
  'notice',
  'info',
  'debug',
]

const __ignore_setters___ = [
  'logger',
  'checklist',
  'get',
  'post',
  'put',
  'patch',
  'delete'
]


module.exports = class Base {

  constructor (logger) {
    this.logger = logger
    // add logger funcs
    for (const method of LOGMETHODS){
      this['log_'+method] = (...msgs) => { logger[method](Object.getPrototypeOf(this).constructor.name,...msgs) }
    }
  }

  // everything has to have logging
  get logger () {return this._logger}
  set logger (logger) {
    if (!logger) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: no logger' )
    for (const method of LOGMETHODS){
      if (!logger[method] || !Object.prototype.toString.call(logger[method]) === '[object Function]') throw new Error(Object.getPrototypeOf(this).constructor.name +' :: logger has no method ' + method)
    }
    this._logger = logger
  }

  // list of props what can be set
  get setters () {
    function dive(i){
      let _self = []
      const proto = Object.getPrototypeOf(i)
      for (const key of Object.getOwnPropertyNames(proto)) {
        const desc = Object.getOwnPropertyDescriptor(proto, key)
        if (!key.startsWith('__') && !__ignore_setters___.includes(key) && desc && typeof desc.set === 'function') _self.push(key)
      }
      const parent = Object.getPrototypeOf(i)
      if (parent && parent.constructor.name !== 'Object') return [..._self, ...dive(parent)]
      else return _self
    }
    return dive(this)
  }

}

/*
process.alias = 'test Base'
let L = require('../logger')
let l = new L()

let B = require('./base')
let b = new B(l)
b.setters
for (const method of LOGMETHODS){
  b['log_'+method]('testing ' + method)
}

b = new B({})

b = new B()
*/
