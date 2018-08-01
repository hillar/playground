const METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete'
]

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
/*

## allowed
  default deny all
  string
  array of strings
  '*' allow all
*/
module.exports = class Handler {

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

  get methods () {
    const _methods = []
    for (const method of METHODS){
      if (this[method] && Object.prototype.toString.call(this[method]) === '[object Function]') _methods.push(method)
    }
    return _methods
  }

  set allowed (allowed) {

  }

  get allowed () { return this._allowed}

  test () {
    throw new Error('not implemented')
  }

  user (req) {
    return req.user
  }

  ip (req) {
    let ip = req.socket.remoteAddress
    if (req.headers['x-real-ip']) ip = req.headers['x-real-ip']
    if (req.headers['x-public-ip']) ip = req.headers['x-public-ip']
    return ip
  }

  before (req,res) {
    if (!req.user || !req.user.memberOf) {
      this.logger.emerg({shoulnothappen:'no req user'})
      res.writeHead(403)
      res.end()
      return false
    }
    if (!this.isinallowed(req.user.memberOf)) {
      this.logger.warning({notinallowed:req.user})
      res.writeHead(403)
      res.end()
      return false
    }
    return true
  }

  after (req,res) {
  }

}
