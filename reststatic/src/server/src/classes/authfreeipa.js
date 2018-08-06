const ldap = require('ldapjs')
const AuthBase = require('./authbase')

const SIZELIMIT = 1024
const PROTO = 'ldaps'
const PORT = 389

function fetch_ldap(url,dn,password,base,filter,attributes,sizeLimit=SIZELIMIT) {
  const client = ldap.createClient({
    url: url
  })
  const results = []
  return new Promise((resolve, reject) => {
    client.bind(dn, password, function (err) {
      if (err) {
        console.log(err)
        client.unbind()
        reject(err)
      } else {
        client.search(
          base, {
            filter: filter,
            scope: 'sub',
            attributes: attributes,
            sizeLimit: sizeLimit
          },
          function (err, res) {
            if (err) {
              console.log(err)
              client.unbind()
              reject(err)
            } else {
              res.on('searchEntry', function (entry) {
                results.push(entry.object)
              })
              res.on('error', function (err) {
                client.unbind()
                reject(err)
              })
              res.on('end', function (result) {
                client.unbind()
                resolve(results)
              })
            }
          }
        )
      }
    })
  })
}

module.exports = class AuthFreeIPA extends AuthBase {
  constructor (logger,directory,filename,server='localhost',base='cn=accounts,dc=example,dc=org',binduser='bu',bindpass='bp',field='uid',rejectUnauthorized=true) {
    super(logger,directory,filename)
    //for i in server base binduser bindpass user pass field do echo "this._$i = $i" done
    this.server = server
    this.base = base
    this.binduser = binduser
    this.bindpass = bindpass
    this.field = field
    this.rejectUnauthorized = rejectUnauthorized
    // this.bind()
  }
  //for i in server base binduser bindpass user pass field do echo "get $i () { return  this._$i }" done
  get server () { return  this._server }
  get base () { return  this._base }
  get binduser () { return  this._binduser }
  get bindpass () { return  this._bindpass }
  get field () { return  this._field }

  //for i in server base binduser bindpass user pass field do echo -en "set $i ($i) { \n\tif (\!(Object.prototype.toString.call($i) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: $i not string  ' + typeof $i)\n\tif (\!$i) this.log_warning({empty:'$i'})\n\telse this._$i = $i \n}\n" done | sed 's/\\//'
  set server (server) {
  	if (!(Object.prototype.toString.call(server) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: server not string  ' + typeof server)
  	if (!server) this.log_warning({empty:'server'})
  	else this._server = `${PROTO}://${server}:${PORT}`
  }
  set base (base) {
  	if (!(Object.prototype.toString.call(base) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: base not string  ' + typeof base)
  	if (!base) this.log_warning({empty:'base'})
  	else this._base = base
  }
  set binduser (binduser) {
  	if (!(Object.prototype.toString.call(binduser) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: binduser not string  ' + typeof binduser)
  	if (!binduser) this.log_warning({empty:'binduser'})
  	else this._binduser = binduser
  }
  set bindpass (bindpass) {
  	if (!(Object.prototype.toString.call(bindpass) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: bindpass not string  ' + typeof bindpass)
  	if (!bindpass) this.log_warning({empty:'bindpass'})
  	else this._bindpass = bindpass
  }

  set field (field) {
  	if (!(Object.prototype.toString.call(field) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: field not string  ' + typeof field)
  	if (!field) this.log_warning({empty:'field'})
  	else this._field = field
  }

  async reallyVerify (username,password) {
    const filter = ''
    const attributes = ''
    const u = await fetch_ldap(this.server,this.binduser,this.bindpass,this.base,filter,attributes)
    // exists and not expired ...
    return {username, ipa:1}
  }


  /*
  reallyVerify () {

  }
  */
}

/*

process.alias = 'test AuthFreeIPA'
let L = require('../logger')
let l = new L()

let AFI = require('./authFreeIPA')
let afi = new AFI(l)
//console.log(afi.setters)

a.verify('a','')
a.verify('','b')
a.verify('a','b')
*/
