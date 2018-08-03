const fs = require('fs')
const path = require('path')

const USERCACHEFILENAME = 'users.json'
const USERCACHEDIR = './'

const Base = require('./base')

module.exports = class AuthBase extends Base {
  constructor (logger,directory = USERCACHEDIR,filename = USERCACHEFILENAME) {
    super(logger)
      this._users  ={}
      this._cachetime = 1000 * 60
      this.filecache = true
      this.cachedir = directory
      this.cachefile = filename
      //this._users = this.loadCache()
    }


  get cachetime () { return this._cachetime }
  set cachetime (ms) { this._cachetime = ms}
  get cachefullname () {if (this.filecache) return this.cachedir + '/' + this.cachefile}
  get cachedir () {return this._cachedir}
  set cachedir (cd) {
    if (!fs.existsSync(cd)) {
      this.filecache = false
      this.log_warning({notexists:cd})
      return
    } else this._cachedir = cd
    if (this.cachefile) {
      this.log_info('new users cache directory ' + this.cachefullname)
      this.saveCache()
    }
  }
  get cachefile () {return this._cachefile}
  set cachefile (cf) {
    console.log('set cachefile',cf)
    if (this.filecache) {
      if (fs.existsSync(this._cachedir+'/'+cf)) {
        try {
            fs.accessSync(this._cachedir+'/'+cf, fs.constants.W_OK)
          } catch (err) {
            this.filecache = false
            return
          }
          this._cachefile = cf
          this.log_info('setting cache file '+ cf + ' loading cache from ' + this.cachefullname)
          this._users = this.loadCache()
          return
      } else {
        this._cachefile = cf
        this.log_info('new users cache ' + this._cachedir+'/'+cf)
        this.saveCache()
      }
    }
  }

  verify(username,password) {
    console.log('verify',username,password)
    if (!username) {
      this.log_alert('no username')
      return {}
    }
    if (!password) {
      this.log_alert('no password for username ', username)
      return {}
    }
    if (this._users[username]) {
      const now = Date.now()
      if (this._users[username].lastVerify + this.cachetime > now) return this._users[username]
    }
    else {
        this._users[username] = this.reallyVerify (username,password)
        this._users[username].firstVerify = Date.now()
    }
    this.saveCache()
    return this._users[username]

  }

  reallyVerify (username,password) {
    console.log('real verify',username,password,Object.getPrototypeOf(this).constructor.name)
    if (!(Object.getPrototypeOf(this).constructor.name === 'AuthBase')) throw new Error('not implemented')
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
    if (this.filecache && this.cachefullname) {
      if (fs.existsSync(this.cachefullname)){
        let u
        try {
          u = JSON.parse(fs.readFileSync(this._cachedir+'/'+this._cachefile))
        } catch (e) {
          this.log_err(e)
          return {}
        }
        this.log_info('loaded users cache from '+this._cachedir+'/'+this._cachefile)
        return u
      } else this.log_emerg({notexists:this.cachefullname})
    }
    return {}
  }
  saveCache () {
    if (this.filecache && this.cachefullname) {
      try {
        fs.writeFileSync(this.cachefullname, JSON.stringify(this._users))
      } catch (error) {
        this.log_err(error)
      }
    }
  }

}

/*
process.alias = 'test AuthBase'
let L = require('../logger')
let l = new L()

let A = require('./authbase')
let a = new A(l)
console.log(a.setters)
a.verify('a','')
a.verify('a','')
a.verify('a','')
*/
