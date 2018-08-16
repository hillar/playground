const { objectType } = require('./helpers')
const AG = require('./rolesandgroups')
const Route = require('./route')
module.exports = class Router extends AG {

  constructor (logger, roles, groups, ...routes) {

    super(logger,roles, groups)

    for (const route of routes) {
      const name = Object.keys(route).shift()
      if (name) {
        if (route[name] instanceof Route){
          this[name] = route[name]
          this[name].route = name
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

  get routes () { return Object.keys(this)}

  get config () {
    const conf = {}
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
    this.log_info('pinging all routes')
    let result = true
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
