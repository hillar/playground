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
    super(logger, allowed, groups)
  }

  get methods () {
    const _methods = []
    for (const method of METHODS){
      if (this[method] && Object.prototype.toString.call(this[method]) === '[object Function]') _methods.push(method)
    }
    return _methods
  }

  setMethod (name, optionsorfn, allowed, groups) {
    console.log(name, optionsorfn)
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
    this['_'+name].allowed = a
    this['_'+name].groups = g
    this.add2Allowed(a)
  }
  get get() {return this.__get}
  set get(options) {
    console.dir(options)
    console.log(Object.prototype.toString.call(options))
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
