const METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete'
]

const http = require('http')
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

  setMethod (name, fn, roles, groups, test ) {
    if (!METHODS.includes(name)) throw new Error('method name not allowed: ' + name)
    let kind
    // [object AsyncFunction] or [object Function]
    if (fn && fn.fn && (Object.prototype.toString.call(fn.fn) === '[object Function]' || Object.prototype.toString.call(fn.fn) === '[object AsyncFunction]')) {
      roles = fn.roles
      groups = fn.groups
      if (fn.test) {
        if (!(Object.prototype.toString.call(fn.test) === '[object AsyncFunction]')) throw new Error(name+' custom test function not async: ' + Object.prototype.toString.call(fn.test))
      }
      test = fn.test
      kind = Object.prototype.toString.call(fn.fn)
      fn = fn.fn
    } else {
        if (fn && fn.fn) throw new Error(name+' not a object with fn function: ' + Object.prototype.toString.call(fn.fn))
        if (fn && (Object.prototype.toString.call(fn) === '[object Function]' || Object.prototype.toString.call(fn) === '[object AsyncFunction]')) {
          kind = Object.prototype.toString.call(fn)
        } else throw new Error(name + ' not a function: ' + Object.prototype.toString.call(fn))
        if (test) {
          if (!(Object.prototype.toString.call(fn) === '[object AsyncFunction]')) throw new Error(name+' custom test function not async: ' + Object.prototype.toString.call(test))
        }
    }
    this._methods[name] = {}
    this._methods[name].check = new RolesAndGroups(this.logger, roles, groups)
    this._methods[name].fn = (logger, user, req, res) => {
      return new Promise(async (resolve) => {
        console.log('defined',name,this._methods[name].check.isdefined)
        if (this._methods[name].check.isdefined || (this._methods[name].check.isinroles(user.roles) && this._methods[name].check.isingroups(user.groups))) {
            let mr
            if (kind === '[object Function]') {
              mr = await new Promise((resolve) => {
                try {
                  const fr = fn(this.logger,user,req,res)
                  resolve(fr)
                } catch (e) {
                  this.log_err(e,name)
                  resolve(false)
                }
              })
            } else {
              try {
                mr = await fn(this.logger,user,req,res)
              } catch (e) {
                mr = false
                this.log_err(e,name)
              }
            }
            resolve(mr)

        } else  {
          this.log_warning('not allowed',{method:name,user})
          resolve(false)
        }
      })
    }
    if (test) {
      this._methods[name].test = test
    }

  }

  set get (fn) { this.setMethod('get',fn,null,null) }
  set post (fn) { this.setMethod('post',fn,null,null) }
  set put (fn) { this.setMethod('put',fn,null,null) }
  set patch (fn) { this.setMethod('patch',fn,null,null) }
  set delete (fn) { this.setMethod('delete',fn,null,null) }

  get get () {return this._methods.get.fn}
  get post () {return this._methods.post.fn}
  get put () {return this._methods.put.fn}
  get patch () {return this._methods.patch.fn}
  get delete () {return this._methods.delete.fn}

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

  async test (user,route) {
    let result = true
    if (!this.methods || !this.methods.length > 0 ) {
      this.log_err('no methods ' + route)
      throw new Error('no methods ' + route)
      return false
    }
    for (const method of this.methods){
      this.log_info({'test start':{route,method}})
      if ( this._methods[method].test ) {
          this.log_notice({'test custom':{route,method}})
          const r = await this._methods[method].test(user)
          if (!r) result = false
      } else {
        //this.log_info({default:{route,method}})
        const req = new http.IncomingMessage()
        const res = {} //new http.ServerResponse()
        const r = await this[method](this._logger,user,req,res)
        if (!r) result = false
        //console.log('method result',method,r)
      }
      this.log_info({'test end':{route,method}})
    }
    return result
  }

}
