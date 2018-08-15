const ldap = require('ldapjs')
const AuthBase = require('./authbase')
const User = require('./user')

const SIZELIMIT = 1024
const PROTO = 'ldap'
const PORT = 389

function fetch_ldap(url,dn,password,base,filter,attributes = [],sizeLimit = SIZELIMIT,rejectUnauthorized) {
  //console.log(url,dn,password,base,filter,attributes,sizeLimit)
  const results = []
  return new Promise((resolve, reject) => {
    try {
    const client = ldap.createClient({
      url: url,
      tlsOptions: {rejectUnauthorized: rejectUnauthorized}
    })
    client.on('error',function(err){
         //console.log('on',err.message)
         resolve(err)
       })
    client.bind(dn, password, (err)  => {
      //console.log('dn',dn)
      //console.log('password',password)
      if (err) {
        //console.log('bind',err)
        client.unbind()
        resolve(err)
      } else {
        try {
          const options = {
            filter: filter,
            scope: 'sub',
            attributes: attributes,
            sizeLimit: sizeLimit
          }
          client.search(base, options,(err, res) => {
               //console.log('base',base)
              if (err) {
                //console.log('search',err)
                client.unbind()
                resolve(err)
              } else {
                res.on('searchEntry', function (entry) {
                  results.push(entry.object)
                  //console.log(entry.object)
                })
                res.on('error', function (err) {
                  client.unbind()
                  resolve(err)
                })
                res.on('end', function (result) {
                  client.unbind()
                  resolve(results)
                })
              }
            }
          )
        } catch (err) {
          //console.log('catch search',err)
          client.unbind()
          reject(err)
        }
      }
    })
    } catch (e) {
      //console.log('catch client',e)
      client.unbind()
      reject(e)
    }
  })
}

module.exports = class AuthFreeIPA extends AuthBase {
  constructor (logger,directory,filename,server='localhost',base='cn=accounts,dc=example,dc=org',binduser='user',bindpass='password',field='uid',rejectUnauthorized=false) {
    super(logger,directory,filename)
    //for i in server base binduser bindpass user pass field do echo "this._$i = $i" done
    this.server = server
    this.proto = PROTO
    this.port = PORT
    this.base = base
    this.binduser = binduser
    this.bindpass = bindpass
    this.field = field
    this.rejectUnauthorized = rejectUnauthorized

    // this.bind()
  }
  //for i in server base binduser bindpass user pass field do echo "get $i () { return  this._$i }" done
  get url () {return  `${PROTO}://${this._server}:${PORT}`}
  get server () { return  this._server }
  get base () { return  this._base }
  get binduser () { return  this._binduser }
  // TODO check FREEIPA & AD doc's for cn=users
  get binddn () { return  `${this.field}=${this.binduser},cn=users,${this.base}` }
  get bindpass () { return  this._bindpass }
  get field () { return  this._field }

  set proto (proto) {
    if (!(Object.prototype.toString.call(proto) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: proto not string  ' + typeof proto)
    this._proto = proto
  }
  set port (port) {
    if (isNaN(port)) throw new Error(Object.getPrototypeOf(this).constructor.name + 'port not a number')
    this._port = port
  }
  get proto () {return this._proto}
  get port () {return this._port}

  //for i in server base binduser bindpass user pass field do echo -en "set $i ($i) { \n\tif (\!(Object.prototype.toString.call($i) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: $i not string  ' + typeof $i)\n\tif (\!$i) this.log_warning({empty:'$i'})\n\telse this._$i = $i \n}\n" done | sed 's/\\//'
  set server (server) {
  	if (!(Object.prototype.toString.call(server) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: server not string  ' + typeof server)
  	if (!server) this.log_warning({empty:'server'})
  	else this._server = server
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
    let filter = `(&(${this.field}=${username})(memberof=cn=ipausers,cn=groups,${this.base}))`
    let attributes = 'krbPasswordExpiration'
    let u
    try {
      u = await fetch_ldap(this.url,this.binddn,this.bindpass,this.base,filter,attributes)
      //u = await fetch_ldap(this.url,this.binddn,this.bindpass,this.base,'uid=hillar',attributes)
      if (u instanceof Error) {
        if (u.message === 'No Such Object') {
          this.log_alert({'binddn':this.binddn,error:u})
          return new Error('wrong bind user')
        }
        if (u.message === 'Invalid Credentials') {
          this.log_alert({'binddn':this.binddn,error:u})
          return new Error('wrong bind password')
        }
        if (u.errno === 'ECONNREFUSED') {
          this.log_alert({'url':this.url,error:u})
          return new Error('no auth backend')
        }
        // something went very wrong ;(
        this.log_emerg({BindError1:u})
        console.log(u)
        return u
      }
    } catch (e) {
      // something went very wrong ;(
      this.log_emerg({CatchBindError:e})
      console.log(e)
      return e
    }
    if (!(u.length === 1)) {
      this.log_notice({'notuser':username})
      return new Error('not found')
    }
    u = u[0]
    // see https://github.com/freeipa/freeipa/blob/master/install/ui/src/freeipa/datetime.js
    const e = u.krbPasswordExpiration
    const ed = e.slice(0,4)+'-'+e.slice(4,6)+'-'+e.slice(6,8)+'T'+e.slice(8,10)+':'+e.slice(10,12)+':'+e.slice(12,14)+'Z'
    const passwordExpiration = new Date(ed)
    if (!(passwordExpiration instanceof Date) || isNaN(passwordExpiration)) {
      this.log_emerg({user:{username,msg:'krbPasswordExpiration not date',krbPasswordExpiration:e}})
      return new Error('krbPasswordExpiration not date ')
    }
    if (passwordExpiration < Date.now()){
      //this.log_notice({user:{username,msg:'password expired',krbPasswordExpiration:e}})
      return new Error('password expired')
    }
    // OK to check password
    let ru
    try {
      ru = await fetch_ldap(this.url,u.dn,password,this.base,filter)
      if (ru instanceof Error) {
        if (ru.message === 'Invalid Credentials') {
          //this.log_alert({'binddn':this.binddn,error:ru})
          return new Error('wrong user password')
        }
        if (ru.errno === 'ECONNREFUSED') {
          this.log_alert({'url':this.url,error:ru})
          return new Error('no auth backend')
        }
        // something went very wrong ;(
        this.log_emerg({BindError:ru,e:ru.message})
        console.log(ru)
        return ru
      }
    } catch (e) {
      // something went very wrong ;(
      this.log_emerg({CatchBindError:e})
      console.log(e)
      return e
    }
    if (!(ru.length === 1)) {
      this.log_alert({user:'to many' + username, users:ru})
      return new Error('to many users')
    }
    // password ok
    //copy out groups and roles
    ru = ru[0]
    ru.roles = []
    ru.groups = []
    for (const memberof of ru.memberOf) {
      if (memberof.endsWith(this.base)) {

        const tmp = memberof.split(',')
        const what = tmp[1]
        switch (tmp[1].split('=')[1]) {
          case 'roles':
                        ru.roles.push(tmp[0].split('=')[1])
                        break
          case 'groups':
                        ru.groups.push(tmp[0].split('=')[1])
                        break
          default:
                  this.log_alert({ERROR:{shouldnothappen:tmp}})
        }
        //console.log('memberof',tmp)
      }
    }
    delete ru.memberOf
    //console.log('ru',  ru)
    const ssn = ru.employeeNumber || ''
    const  ou = ru.ou || ''
    const manager = ru.manager || ''
    const emails = ru.mail || []
    const phones = ru.mobile || []

    const fu = new User(this._logger,ru.uid,ssn,ru.givenName,ru.sn,ou,manager,emails,phones,ru.roles,ru.groups)
    //console.log(fu.toObj())

    return fu.toObj()
  }

  async ping () {

    //this.log_info({bind:{server:this.url,bind:{dn:this.binddn}}})
    const user = await this.verify(this.binduser,this.bindpass)
    if (user && user.uid && user.uid === this.binduser) {
      this.log_info({ping:'ok', server:this.url,bind:{dn:this.binddn}})
    } else {
      this.log_info({ping:'failed', server:this.url,bind:{dn:this.binddn}})
    }
    return user
  }

}
