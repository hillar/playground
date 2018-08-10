/*

sample extended Route

*/

const fs = require('fs')
const path = require('path')
const Route = require('./route')
const { ip } = require('./requtils')

const STATICROOT = './'
const STATICROUTE = 'static'

module.exports = class StaticRoute extends Route {

  constructor (logger, roles, groups, root = STATICROOT, route = STATICROUTE) {

    super(logger, roles, groups)
    this.root = root
    this.route = route

    const getstaticfiles = (logger, user, req, res) => {
      return new Promise( (resolve) => {
        let pe = path.parse(decodeURIComponent(req.url))
        pe.dir = pe.dir.replace('/'+route,'')
        const filename = path.join(this.path, pe.dir, pe.base)
        fs.readFile(filename, (err,content) => {
          if (err) {
            logger.warning({'staticfiles':{user:user.uid,remoteip:ip(req),notexists:filename}})
            res.writeHead(404)
            res.end()
            resolve(false)
          } else {
            logger.notice({'staticfiles':{user:user.uid,remoteip:ip(req),access:filename}})
            res.write(content)
            res.end()
            resolve(true)
          }
        })
      })
    }

    const ping = async (u) => {
      const result = await new Promise((resolve)=>{
        fs.access(this.path, fs.constants.R_OK, (err) => {
          if (err) {
            this.log_err({ping:'failed',notexist:this.path})
            resolve(false)
          } else {
            this.log_info({ping:'ok',readable:this.path})
            resolve(true)
          }
        })
      })
      return result
    }

    this.setMethod('get',getstaticfiles, roles, groups, ping)

  }

  get root () { return this._root }
  get route () { return this._route}
  get path () {
    if (this.root && this.route) {
      return path.join(this.root)
    } else {
      if (!this.root) throw new Error('no root directory')
      if (!this.route) throw new Error('no route')
    }
  }

  set root (root) {
    if (!(Object.prototype.toString.call(root) === '[object String]')) throw new Error('root not a string ' + typeof root)
    if (root === '/') throw new Error('can not serve /')
    if (!root) throw new Error('can not serve empty')
    try {
      this._root = fs.realpathSync(root)
      if (this._root === '/') throw new Error('can not serve /')
    } catch (err) {
      this._root = root
      this.log_warning({notexists:root})
    }
  }

  set route (route) {
    if (!(Object.prototype.toString.call(route) === '[object String]')) throw new Error('root not a string ' + typeof route)
    if (!route) throw new Error('can not route empty')
    this._route = route
  }

}
