const fs = require( 'fs')
const Handler = require('./handler')

const STATICROOT = './'
const STATICROUTE = 'static'

module.exports = class StaticHandler extends Handler {
  constructor (root = STATICROOT,route = STATICROUTE, logger) {
    super(logger)
    this.root = root
    this.path = root + '/' + route
    // die if path does not exists
    fs.open(this.path, 'r', async (err) => {
      if (err) {
        this.logger.emerg(err)
        process.exit(1)
      }
    })
  }
  get (req,res) {
    const filename = this.root + decodeURIComponent(req.url)
    fs.readFile(filename, (err,content) => {
      if (err) {
        this.logger.warning({notexists:filename,user:this.user(req),remoteip:this.ip(req)})
        res.writeHead(404)
        res.end()
      } else {
        this.logger.notice({access:filename,user:this.user(req),remoteip:this.ip(req)})
        res.write(content)
        res.end()
      }
    })
  }
}