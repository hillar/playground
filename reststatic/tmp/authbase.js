const fs = require('fs')
const path = require('path')

const USERCACHEFILENAME = 'users.json'
const USERCACHEDIR = './'

const Base = require('./base')

module.exports = class AuthBase extends Base {
  constructor (logger,directory = USERCACHEDIR,filename = USERCACHEFILENAME) {
    super(logger)
      this._cachetime = 1000 * 60
      this.filecache = true
      this.cachedir = directory
      this.cachefile = filename
      this._users = this.loadCache()
    }


  get cachetime () { return this._cachetime }
  set cachetime (ms) { this._cachetime = ms}
  get cachedir () {return this._cachedir}
  set cachedir (cd) {
    if (!fs.existsSync(cd)) {
      this.filecache = false
      this.log_warning({notexists:cd})
    } else this._cachedir = cd
  }
  get cachefile () {return this._cachefile}
  set cachefile (cf) {
    if (this.filecache) {
      if (fs.existsSync(this._cachedir+'/'+cf)) {
        try {
            fs.accessSync(this._cachedir+'/'+cf, fs.constants.W_OK)
          } catch (err) {
            this.filecache = false
            return
          }
      }
      this._cachefile = cf
    }
  }

  verify(username,password) {

    if (this._users[username]) {
      const now = Date.now()
      if (this._users[username].lastVerify + this.cachetime > now) return this._users[username]
    }
    else {
        this._users[username] = this.reallyVerify (username,password)
    }
    this.saveCache()
    return this._users[username]

  }

  reallyVerify (username,password) {
    const realname = 'Firstname Lastname'
    const roles = []
    const groups = []
    const email = ''
    const phone = ''
    const lastVerify = Date.now()
    const user = {lastVerify,username,realname, roles,groups, email,phone}
    return user
  }

  loadCache () {
    if (this.filecache) {
      if (fs.existsSync(this._cachedir+'/'+this._cachefile)){
        let u
        try {
          u = JSON.parse(fs.readFileSync(this._cachedir+'/'+this._cachefile))
        } catch (e) {
          this.log_err(e)
          return {}
        }
        this.log_info('loaded users cache from '+this._cachedir+'/'+this._cachefile)
        return u
      } else return {}
    }
  }
  saveCache () {
    if (this.filecache) {
      try {
        fs.writeFileSync(this.cachedir+'/'+this.cachefile,JSON.stringify(this._users))
      } catch (error) {
        this.log_err(error)
      }
    }
  }

}

process.alias = 'test AuthBase'
let L = require('../logger')
let l = new L()

let A = require('./authbase')
let a = new A(l)
console.log(a.setters)
a.verify('a','')
a.verify('a','')
a.verify('a','')
