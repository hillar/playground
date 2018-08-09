const METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete'
]

const Check = require('./check')
const AG = require('./rolesandgroups')

module.exports = class Route extends AG {

  constructor (logger, roles, groups) {
    super(logger,roles, groups)
    this._methods = {}
    for (const method of METHODS){
      this._methods[method] = {}
    }
  }

  get methods () {
    const _methods = []
    for (const method of METHODS){
      if (this._methods[method] && Object.prototype.toString.call(this._methods[method].fn) === '[object Function]') _methods.push(method)
    }
    return _methods
  }

  setMethod (name, fn, roles, groups, test ) {
    //console.log('fn',name,Object.prototype.toString.call(fn.fn))
    let kind
    console.log('FN.FN',Object.prototype.toString.call(fn.fn))
    // [object AsyncFunction] or [object Function]
    if (fn && fn.fn && (Object.prototype.toString.call(fn.fn) === '[object Function]' || Object.prototype.toString.call(fn.fn) === '[object AsyncFunction]')) {
      roles = fn.roles
      groups = fn.groups
      test = fn.test
      kind = Object.prototype.toString.call(fn.fn)
      fn = fn.fn
    } else {
        if (fn.fn) throw new Error(name+' not a boject with fn function: ' + Object.prototype.toString.call(fn.fn))
        if (fn && (Object.prototype.toString.call(fn) === '[object Function]' || Object.prototype.toString.call(fn) === '[object AsyncFunction]')) {
          kind = Object.prototype.toString.call(fn)
        } else throw new Error(name + ' not a function: ' + Object.prototype.toString.call(fn))

    }
    // if not set, use current route
    if (!roles) roles = this.roles
    if (!groups) groups = this.groups
    //console.log('route roles',roles)
    this._methods[name].check = new AG(this.logger, roles, groups)
    this._methods[name].fn = (logger, user, req, res) => {
      return new Promise(async (resolve) => {
        if (this._methods[name].check.isinroles(user.roles)) {
          if (this._methods[name].check.isingroups(user.groups)) {
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
          } else {
            this.log_warning('not in groups',{method:name,user})
            resolve(false)
          }
        } else  {
          this.log_warning('not in role',{method:name,user})
          resolve(false)
        }
      })
    }
  }

  set get (fn) { this.setMethod('get',fn) }
  set post (fn) { this.setMethod('post',fn) }
  set put (fn) { this.setMethod('put',fn) }
  set patch (fn) { this.setMethod('patch',fn) }
  set delete (fn) { this.setMethod('delete',fn) }

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

  async test (user) {
    let result = true
    if (!this.methods || !this.methods.length > 0 ) {
      this.log_err('no methods')
      return false
    }
    for (const method of this.methods){
      this.log_info({'testing':method})
      if ( this._methods[method].test ) {
          this.log_info({'custom test':method})
      } else {
        this.log_info({'default test':method})
        const r = await this[method](this._logger,user,{},{})
        console.log('method result',method,r)
      }
    }
    return result
  }

}
/*
process.alias = 'test Route'
let L = require('../logger')
let l = new L()


const t = 'kala'
let q,w,e
let R = require('./route')
let a = '*'
let g = [q,w,e]
let r = new R(l,a,g)
r.get = () => {}
r.patch = {fn:() => {},roles:'admin',groups:'any'}
let roles = '*'
let groups = '*'
const fn = (logger,user,req,res) => {
  console.log(logger,user,req,res)
  console.log('-----')
  logger.info('uhuuuuuu...', user)
  console.log('-----')
  throw new Error('ba baaa')

}
r.post = {roles, groups, fn}
r.post({username:'kala',memberof:['maja']},{},{})
console.log(r.methods)
console.log(r.setters)
console.log(r.roles)
console.log(JSON.stringify(r.config,null,2))

*/
