const AG = require('./rolesandgroups')

module.exports = class Router extends AG {

  constructor (logger, roles, groups, ...routes) {

    super(logger,roles, groups)

    for (const route of routes) {
      const name = Object.keys(route)[0]
      this[name] = route[name]
      this[name].route = name
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

  /*
  get permissions () {
    const perm = {}
    perm.roles = this.roles
    perm.groups = this.groups
    for (const route of this.routes){
      conf[route] = this[route].roles
    }
    return perm
  }
  */
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
/*
process.alias = 'test Router'
let L = require('./logger')
let l = new L()

let R = require('./route')
//let r = new R(l)
//r.get = () => {}

let RR = require('./router')
let rr = new RR(l,'abc','1234')
  static: new R(l,null,'qwerty',{get:()=>{}})
})
console.log(rr.config)
//rr.test()
**/
