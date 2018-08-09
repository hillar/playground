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
      console.log('route name',name, route[name].methods)
      this[name] = route[name]
    }
    //this._routes = ...routes

  }
  test () {
    this.log_info('test begin ----------------')
    console.log(Object.keys(this))
    this.log_info('test end ------------------')
    return true

  }
}
/*
process.alias = 'test Router'
let L = require('./logger')
let l = new L()

let R = require('./route')
let r = new R(l,'*')
r.get = () => {}

let RR = require('./router')
let rr = new RR(l,'*','*',{static:r},{kala:r})
rr.test()
*/
