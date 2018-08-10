/*

const method = req.method.toLowerCase()
const route = decodeURIComponent(req.url).split('/')[1].toLowerCase()
if (router[route] && router[route][method]) {
  await router[route][method](this._logger, user, req, res)
  if (!res.finished) res.end()
} else {
  this.log_warning({username,remoteip:req.socket.remoteAddress,notexist:{method,route}})
  res.writeHead(404)
  res.end()
}

*/

const AG = require('./rolesandgroups')

module.exports = class Router extends AG {

  constructor (logger, roles, groups, ...routes) {
    super(logger,roles, groups)
    for (const route of routes) {
      const name = Object.keys(route)[0]
      /*
      if (!route[name].config) throw new Error('not a route')
      if (!route[name].roles)  {
        route[name].roles = this.roles
        this.log_notice({'inherit roles from router':name})

      }
      if (!route[name].groups)  {
        route[name].groups = this.groups
        this.log_notice({'inherit groups from router':name})
      }*/
      this[name] = route[name]
    }
    //this._routes = ...routes

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
