const METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete'
]


/*

## allowed
  default deny all
  string
  array of strings
  '*' allow all
*/

const Base = require('./base')

module.exports = class Route  extends Base {

  constructor (logger,allowed,groups) {
    super(logger, allowed)
    this._groups = '*'
    this['isingroup'] = () => {return true}
    this.groups = groups
  }
  get groups () { return this._groups}
  set groups (groups) {
    console.log('set groups', groups)
    if (groups) {
      if (groups === '*') return
      if (!Array.isArray(groups)) groups = [groups]
      if (Array.isArray(groups)){
        this._groups = [...(new Set([...groups]))]
      }
      if (Array.isArray(this._groups)){
        this['isingroup'] = (memberOf) => {
          return this._groups.some(function (v) {
              return memberOf.indexOf(v) >= 0
          })
        }
      }
    }
  }

  get methods () {
    const _methods = []
    for (const method of METHODS){
      if (this[method] && Object.prototype.toString.call(this[method]) === '[object Function]') _methods.push(method)
    }
    return _methods
  }

  setMethod (name, optionsorfn, allowed, groups) {
    let fn
    let a
    let g
    if (Object.prototype.toString.call(optionsorfn) === '[object Function]') {
      fn = optionsorfn
      a = allowed || this._allowed
      g = groups || this._groups
    } else {
      fn = optionsorfn.fn
      a = optionsorfn.allowed
      g = optionsorfn.groups
    }
    if (!METHODS.includes(name)) throw new Error('method name not allowed: ' + name)
    if (Object.prototype.toString.call(fn) !== '[object Function]') throw new Error('not a function: ' + name)
    this['__'+name] = (req,res) => {return new Promise((resolve) => {
      try {
        fn(req,res)
      } catch (e) {
        logger.error(e,name)
      }
      resolve(true)
      })
    }
    // ? this['__'+name].bind(this)
    this['_'+name] = {}
    // TODO ....
    this['_'+name].allowed = a
    this['_'+name].groups = g
    this.add2Allowed(a)
  }
  get get() {return this.__get}
  set get(options) {
    this.setMethod ('get', options)
  }

  user (req) { return req.user}
  ip (req) {
    return '1234'
  }
  after (req,res) {
      if (!res.finished) res.end()
  }

}
