const fs = require('fs')
const path = require('path')
const { objectType } = require('./helpers')
const AG = require('./rolesandgroups')
const Route = require('./route')
module.exports = class Router extends AG {

  constructor (logger, roles, groups, ...routes) {

    super(logger,roles, groups)

    Object.defineProperty(this, '_root', {
      enumerable: false,
      configurable: true,
      writable: true
    })
    Object.defineProperty(this, '_defaultroute', {
      enumerable: false,
      configurable: true,
      writable: true
    })

    this.htmlroot = './src/html/routes'

    for (const route of routes) {
      const name = Object.keys(route).shift()
      if (name) {
        if (route[name] instanceof Route){
          this[name] = route[name]
          this[name].route = name
          if (route[name].html && !route[name].htmlroot ) this[name].htmlroot = this.htmlroot+'/'+name
        } else {
          const r = new Route(this._logger)
          r.route = route
          for (const method of Object.keys(route[name])){
            r.setMethod(method,route[name][method])
          }
          this[name] = r
        }
      }
    }
  }

  get default () { return this._defaultroute }
  set default (route) {
    if (!this.routes.includes(route)) throw new Error('can not set as default, route not exist: ' + route)
    this._defaultroute = route
  }

  get htmlroot () { return this._root }
  set htmlroot (root) {
    if (!(Object.prototype.toString.call(root) === '[object String]')) throw new Error('router root not a string ' + typeof root)
    if (root === '/') throw new Error('router root must not be /')
    if (!root) throw new Error('router root must not be empty')
    try {
      this._root = fs.realpathSync(root)
      if (this._root === '/') throw new Error('router root must not be /')
    } catch (err) {
      this._root = root
      this.log_warning({notexists:root})
    }
  }

  get routes () { return Object.keys(this)}

  get config () {
    const conf = super.config
    conf.roles = this.roles
    conf.groups = this.groups
    for (const route of this.routes){
      conf[route] = this[route].config
    }
    return conf
  }

  readConfig (conf) {
    super.readConfig(conf)
    for (const route of this.routes){
      if (conf[route]) this[route].readConfig(conf[route])
    }
    return conf
  }

  async ping (user) {
    let result = true
    if (this.root) {
        result = await new Promise((resolve)=>{
          fs.access(this.root, fs.constants.R_OK, (err) => {
            if (err) {
              this.log_err({ping:'failed',notexist:this.root})
              resolve(false)
            } else {
              this.log_info({ping:'ok',readable:this.root})
              resolve(true)
            }
          })
        })
    }
    this.log_info('pinging all routes')
    for (const route of this.routes){
      this.log_info({ping:route})
      if (this[route].ping){
          const r = await this[route].ping(user,route)
          if (!r) result = false
      } else {
        this.log_alert('not a route ' + route)
        throw new Error('not a route ' + route)
        result = false
      }
    }
    return result
  }
}
