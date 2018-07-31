module.exports = class Handler {
  constructor (logger) {
    if (!logger) throw new Error('no logger')
    this.logger = logger
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
}
