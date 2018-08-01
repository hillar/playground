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

module.exports = class Base {

  constructor (logger,allowed) {
    // is logger a logger
    if (!logger) throw new Error('no logger')
    for (const method of LOGMETHODS){
      if (!logger[method] || !Object.prototype.toString.call(logger[method]) === '[object Function]') throw new Error('logger has no method ' + method)
    }
    this.logger = logger

    this._allowed = null
    this['isinallowed'] = () => {return false}
    if (allowed) {
      if (Array.isArray(allowed)){
        this._allowed = allowed
      } else {
        if (Object.prototype.toString.call(allowed) === '[object String]') {
          if (allowed === '*' ) {
            this._allowed = allowed
            this['isinallowed'] = () => {return true}
          } else {
            this._allowed = [allowed]
          }

        }
      }
      if (Array.isArray(this._allowed)){
        this['isinallowed'] = (memberOf) => {
          return this._allowed.some(function (v) {
              return memberOf.indexOf(v) >= 0
          })
        }
      }
    }
  }
  get setters () {
    function dive(i){
      let _self = []
      const proto = Object.getPrototypeOf(i)
      for (const key of Object.getOwnPropertyNames(proto)) {
        const desc = Object.getOwnPropertyDescriptor(proto, key)
        if (!key.startsWith('__') && key !== 'get' && desc && typeof desc.set === 'function') _self.push(key)
      }
      const parent = Object.getPrototypeOf(i)
      if (parent && parent.constructor.name !== 'Object') return [..._self, ...dive(parent)]
      else return _self
    }
    return dive(this)
  }

  set allowed (allowed) {
    if (allowed) {
      if (Array.isArray(allowed)){
        this._allowed = allowed
      } else {
        if (Object.prototype.toString.call(allowed) === '[object String]') {
          if (allowed === '*' ) {
            this._allowed = allowed
            this['isinallowed'] = () => {return true}
          } else {
            this._allowed = [allowed]
          }

        }
      }
      if (Array.isArray(this._allowed)){
        this['isinallowed'] = (memberOf) => {
          return this._allowed.some(function (v) {
              return memberOf.indexOf(v) >= 0
          })
        }
      }
    }

  }

  get allowed () { return this._allowed}

  before (req,res) {
    return new Promise((resolve) => {
      if (!req.user || !req.user.memberOf) {
        this.logger.emerg({shoulnothappen:'no req user'})
        res.writeHead(403)
        res.end()
        resolve(false)
      }
      if (!this.isinallowed(req.user.memberOf)) {
        this.logger.warning({notinallowed:req.user})
        res.writeHead(403)
        res.end()
        resolve(false)
      }
      resolve(true)
    })

  }

  after (req,res) {
    //noop
  }

}
