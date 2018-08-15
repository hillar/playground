
const http = require('http')
const METHODS = require('./routemethods')
const LOGMETHODS  =  require('./logmethods')
const {ip} = require('./requtils')
const Check = require('./check')
const RolesAndGroups = require('./rolesandgroups')

module.exports = class Route extends RolesAndGroups {

  constructor (logger, roles, groups, ...methods) {
    super(logger,roles, groups)
    this._methods = {}
    for (const method of methods) {
      const name = Object.keys(method)[0]
      if (name) {
        //console.log('method name',name, method[name])
        this.setMethod(name,method[name])
      } else throw new Error('not a method')
    }
  }

  get methods () {
    const _methods = []
    for (const method of METHODS){
      if (this._methods[method] && (Object.prototype.toString.call(this._methods[method].fn) === '[object Function]'||Object.prototype.toString.call(this._methods[method].fn) === '[object AsyncFunction]')) _methods.push(method)
    }
    return _methods
  }

  setMethod (name, fn, roles, groups, ping ) {
    if (!METHODS.includes(name)) throw new Error('method name not allowed: ' + name)
    let kind
    // [object AsyncFunction] or [object Function]
    if (fn && fn.fn && (Object.prototype.toString.call(fn.fn) === '[object Function]' || Object.prototype.toString.call(fn.fn) === '[object AsyncFunction]')) {
      roles = fn.roles
      groups = fn.groups
      if (fn.ping) {
        if (!(Object.prototype.toString.call(fn.ping) === '[object AsyncFunction]')) throw new Error(name+' custom ping function not async: ' + Object.prototype.toString.call(fn.ping))
      }
      ping = fn.ping
      kind = Object.prototype.toString.call(fn.fn)
      fn = fn.fn
    } else {
        if (fn && fn.fn) throw new Error(name+' not a object with fn function: ' + Object.prototype.toString.call(fn.fn))
        if (fn && (Object.prototype.toString.call(fn) === '[object Function]' || Object.prototype.toString.call(fn) === '[object AsyncFunction]')) {
          kind = Object.prototype.toString.call(fn)
        } else throw new Error(name + ' not a function: ' + Object.prototype.toString.call(fn))
        if (ping) {
          if (!(Object.prototype.toString.call(ping) === '[object AsyncFunction]')) throw new Error(name+' custom ping function not async: ' + Object.prototype.toString.call(ping))
        }
    }
    this._methods[name] = {}
    this._methods[name].check = new RolesAndGroups(this.logger, roles, groups)
    this._methods[name].fn = (logger, user, req, res) => {
      return new Promise(async (resolve) => {
        if (this._methods[name].check.isinroles(user.roles) && this._methods[name].check.isingroups(user.groups)) {
            this.log_info({route:this.route,method:name,user:user.uid,ip:ip(req)})
            // call the real method, can be async or normal func
            let mr = 'ok'
            if (kind === '[object Function]') {
              mr = await new Promise((resolve) => {
                let fr = 'ok'
                try {
                  fn(logger,user,req,res)
                } catch (e) {
                  this.log_emerg({route:this.route,method:name,kind,error:e.message})
                  console.log(e)
                  fr = 'FUNCTION ERROR '+ e.message
                }
                resolve(fr)
              })
            } else {
              try {
                await fn(logger,user,req,res)
              } catch (e) {
                this.log_emerg({route:this.route,method:name,kind,error:e.message})
                console.log(e)
                mr = 'ASYNC ERROR '+ e.message
              }
            }
            resolve(mr)
        } else  {
          this.log_warning({'not allowed':{route:this.route,method:name,user:user.uid,ip:ip(req)}})
          res.writeHead(404)
          res.end()
          resolve('ok')
        }
      })
    }
    if (ping) {
      this._methods[name].ping = ping
    }

  }
  // TODO loop METHODS

  set get (fn) { this.setMethod('get',fn,null,null) }
  set post (fn) { this.setMethod('post',fn,null,null) }
  set put (fn) { this.setMethod('put',fn,null,null) }
  set patch (fn) { this.setMethod('patch',fn,null,null) }
  set delete (fn) { this.setMethod('delete',fn,null,null) }
/*
  get get () {return this._methods.get.fn}
  get post () {return this._methods.post.fn}
  get put () {return this._methods.put.fn}
  get patch () {return this._methods.patch.fn}
  get delete () {return this._methods.delete.fn}
*/
  /*
  get route () { return this._route}
  set route (route) {
    if (!(Object.prototype.toString.call(route) === '[object String]')) throw new Error('route not a string ' + typeof route)
    if (!route) throw new Error('can not route empty')
    this._route = route
  }
  */
  get config () {
    const conf = {}
    for (const setting of this.setters){
      conf[setting] = this[setting]
    }
    //conf.methods = {}
    for (const method of this.methods){
      if ( this._methods[method].fn ) {
        const roles = this._methods[method].check.roles
        const groups = this._methods[method].check.groups
        const m = {}
        m[method] = {roles,groups}
        //conf.methods.push(m)
        conf[method] = {roles,groups}
      }
    }
    return conf
  }
  readConfig (conf) {
    super.readConfig(conf)
    for (const method of this.methods){
      if (conf[method]) this._methods[method].check.readConfig(conf[method])
    }
  }

  async ping (user,route) {
    let result = true
    if (!this.methods || !this.methods.length > 0 ) {
      this.log_err('no methods ' + route)
      throw new Error('no methods ' + route)
      return false
    }
    for (const method of this.methods){
      if ( this._methods[method].ping ) {
          //this.log_notice({'custom ping start':{route,method}})
          const r = await this._methods[method].ping(user)
          if (!r) {
            result = false
            this.log_err({ping:'failed',route,method})
          } else {
            this.log_info({ping:'ok',route,method})
          }
      } else {
        //this.log_notice({'ping default start':{route,method}})
        const req = new http.IncomingMessage()
        // naive mock
        const res = {} //new http.ServerResponse()
        res.write = () => {}
        res.writeHead = () => {}
        res.end = () => {}
        let logger = Object.assign(this._logger)
        for (const logmethod of LOGMETHODS){
          logger['log_' + logmethod] = (...messages) => {
            let msg = []
            let ctx = {route,method,user:user.uid,ip:ip(req)}
            for (const m of messages) {
              if (m instanceof Object) {
                ctx = Object.assign(ctx,m)
              } else msg.push(m)
            }
            if (msg.length > 0 ) ctx.messages = msg
            logger[logmethod]({'PING request':ctx})
          }
        }
        try {
          const r = await this._methods[method].fn(logger,user,req,res)
          this.log_info({ping:r,route,method})
          if (!(r === 'ok')) result = false
        } catch (e) {
          this.log_emerg({ping:'failed',note:'default',route,method,error:e.message})
          console.log(e)
          result = false
        }
      }
    }
    return result
  }

}
