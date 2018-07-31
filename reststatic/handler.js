module.exports = class Handler {
  constructor (logger, allowed = '*') {
    if (!logger) throw new Error('no logger')
    this.logger = logger
    if (allowed === '*' ) {
      this['isinallowed'] = () => {return true}
    } else {
      this.allowed = Array.isArray(allowed) ? allowed : [allowed]
      this['isinallowed'] = (memberOf) => {
        return this.allowed.some(function (v) {
            return memberOf.indexOf(v) >= 0
        })
      }
    }

  }
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
  before(req,res){
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
}
