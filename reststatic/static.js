const fs = require( 'fs')
const Handler = require('./handler')

const STATICROOT = './'
const STATICROUTE = 'static'


module.exports = class StaticHandler extends Handler {
  constructor (logger, allowed = '*', root = STATICROOT, route = STATICROUTE) {
    super(logger,allowed)
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
  //@before ... waitng for decorators,now called in restatic
  get (req,res) {
    const filename = this.root + decodeURIComponent(req.url)
    fs.readFile(filename, (err,content) => {
      if (err) {
        this.logger.warning({user:this.user(req),remoteip:this.ip(req),notexists:{static:filename}})
        res.writeHead(404)
        res.end()
      } else {
        this.logger.notice({user:this.user(req),remoteip:this.ip(req),access:filename,})
        res.write(content)
        res.end()
      }
    })
  }
  //@after ...
}
