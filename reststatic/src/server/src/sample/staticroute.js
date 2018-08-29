/*

sample extended Route

*/

const fs = require('fs')
const path = require('path')
const Route = require('../classes/route')
const { ip } = require('../classes/requtils')

const STATICROOT = './'
const DEFAULTFILE = 'index.html'

module.exports = class StaticRoute extends Route {

  constructor (logger, roles, groups, root = STATICROOT, defaultfile = DEFAULTFILE) {

    super(logger, roles, groups)
    this.root = root
    this.default = defaultfile

    this.get = async (log, user, req, res) => {
      const result = await new Promise( (resolve) => {
        let pe = path.parse(decodeURIComponent(req.url))
        // if dir is / then use default
        if (pe.dir === '/' && this.default) pe.base = this.default
        // chop route from req path
        pe.dir = pe.dir.replace('/'+this.route,'')

        const filename = path.join(this.path, pe.dir, pe.base)
        fs.readFile(filename, (err,content) => {
          if (err) {
            log.log_warning({notexists:filename})
            res.writeHead(404)
            res.end()
            resolve(false)
          } else {
            log.log_notice({access:filename})
            res.write(content)
            res.end()
            resolve(true)
          }
        })
      })
      return result
    }

  }

  get default () { return this._default }
  set default (filename) { this._default = filename}

  get root () { return this._root }
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

  async ping () {
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

}
