const fs = require( 'fs')
const Route = require('./route')
const Method = require('./method')

/*

sample extended Route
allows * to get files from static dir of current working dir

*/

const STATICROOT = './'
const STATICROUTE = 'static'


module.exports = class StaticRoute extends Route {

  constructor (logger, allowed = '*', root = STATICROOT, route = STATICROUTE) {
    super(logger,allowed)
    this._root = root
    this._route = route
    this._path = this.root + '/' + this.route
    // die if path does not exists
    fs.open(this._path, 'r', async (err) => {
      if (err) {
        this.logger.emerg(err)
        process.exit(1)
      }
    })
  }

  get path () {
    return this._path
  }

  get root () { return this._root }
  set root (root) {
    this._root = root
    this._path = this.root + '/' + this.route
  }

  get route () { return this._route}
  set route (route) {
    this._route = route
    this._path = this.root + '/' + this.route
  }

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

}
