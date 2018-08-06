const fs = require('fs')
const path = require('path')

const USERCACHEFILENAME = 'users.json'
const USERCACHEDIR = './'

const Base = require('./base')

module.exports = class AuthBase extends Base {
  constructor (logger,directory = USERCACHEDIR,filename = USERCACHEFILENAME) {
    super(logger)
      this._users  = {}
      this._cachetime = 1000 * 60
      this.filecache = true
      this.cachedir = directory
      this.cachefile = filename
      //this._users = this.loadCache()
    }


  get cachetime () { return this._cachetime }
  set cachetime (ms) {
    this._cachetime = ms
  }
  get cachefullname () {if (this.filecache) return this.cachedir + '/' + this.cachefile}
  get cachedir () {return this._cachedir}
  set cachedir (cd) {
    if (!(Object.prototype.toString.call(cd) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: directory not string  ' + typeof cd)
    if (!fs.existsSync(cd)) {
      this.filecache = false
      this.log_warning({notexists:cd})
      return
    } else this._cachedir = cd
    if (this.cachefile) {
      this.log_info({'new users cache directory ': this.cachefullname})
      this.saveCache()
    }
  }
  get cachefile () {return this._cachefile}
  set cachefile (cf) {
    if (!(Object.prototype.toString.call(cf) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: filename not string  ' + typeof cf)

    if (this.filecache) {
      if (fs.existsSync(this._cachedir+'/'+cf)) {
        try {
            fs.accessSync(this._cachedir+'/'+cf, fs.constants.W_OK)
          } catch (err) {
            this.filecache = false
            return
          }
          this._cachefile = cf
          this.log_info({'setting cache file ': cf ,' loading cache from ' : this.cachefullname})
          this._users = this.loadCache()
          return
      } else {
        this._cachefile = cf
        this.log_info({'new users cache ':this._cachedir+'/'+cf})
        this.saveCache()
      }
    }
  }

  verify(username,password) {
    
    if (!(Object.prototype.toString.call(username) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: username not string  ' + typeof username)
    if (!(Object.prototype.toString.call(password) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: password not string  ' + typeof password)

    return new Promise(async (resolve) => {
      if (!username) {
        this.log_alert('no username')
        resolve({})
      } else {
        if (!password) {
          this.log_alert({'no password': username})
          resolve({})
        } else {
          if (this._users[username]) {
            const now = Date.now()
            if (this._users[username].lastVerify + this.cachetime > now) {
              resolve(this._users[username])
            } else {
              try {
                this._users[username] = this.reallyVerify(username,password)
                this._users[username].lastVerify = Date.now()
                this.saveCache()
                resolve(this._users[username])
              } catch (e) {
                this.log_err(e)
                resolve({})
              }

            }
          } else {
              this._users[username] = await new Promise((resolve) => {
                try {
                  this._users[username] = this.reallyVerify(username,password)
                  this._users[username].lastVerify = Date.now()
                  this._users[username].firstVerify = Date.now()
                  this.saveCache()
                  resolve(this._users[username])
                } catch (e) {
                  this.log_err(e)
                  resolve({})
                }
              })
          }
          //resolve(this._users[username])
        }
      }
    })
  }

  reallyVerify (username,password) {
    //console.log('real verify',username,password,Object.getPrototypeOf(this).constructor.name)
    if (!(Object.getPrototypeOf(this).constructor.name === 'AuthBase')) throw new Error('reallyVerify not implemented')
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
          u = JSON.parse(fs.readFileSync(this.cachefullname))
          //console.log('u',u)
        } catch (e) {
          this.log_err(e)
          return {}
        }
        this.log_info({'loaded users cache from ':this.cachefullname})
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
  get config () {
    const conf = {}
    for (const setting of this.setters){
      conf[setting] = this[setting]
    }
    return conf
  }

}

/*
process.alias = 'test AuthBase'
let L = require('./logger')
let l = new L()

let A = require('./authbase')
let a = new A(l)
console.log(a.setters)
let u = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
a.verify('abc',u)
*/