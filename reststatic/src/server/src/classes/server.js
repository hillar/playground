const Base = require('./base')
const http = require('http')
const {ip} = require('./requtils')

const PORT = 4444
const IP = '127.0.0.1'

module.exports = class Server extends Base {
  constructor (logger, auth, router, config) {
    super(logger)
    if (auth && auth.config && Object.prototype.toString.call(auth.verify) === '[object AsyncFunction]') this.auth = auth
    else throw new Error('no auth')
    if (router && router.config) this.router = router
    else throw new Error('no router')
    this.port = PORT
    this.ip = IP
    this.readConfig(config)

    this._server = http.createServer( async (req, res) => {
      let user
      const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
      const strauth = new Buffer(b64auth, 'base64').toString()
      const splitIndex = strauth.indexOf(':')
      const username = strauth.substring(0, splitIndex)
      const password = strauth.substring(splitIndex + 1)
      if (username && password ) {
        user = await this.auth.verify(username, password)
      }
      if (!user){
        if (username) logger.info({reauth:username})
        const header = `Basic realm=\"${auth.realm}\"`
        res.setHeader("WWW-Authenticate", header);
        res.writeHead(401)
        res.end()
        return
      }

      const method = req.method.toLowerCase()
      const route = decodeURIComponent(req.url).split('/')[1].toLowerCase()

      if (router[route] && router[route][method]) {
        router[route][method](this._logger, user,req, res)
          .then((r)=>{
            if (!res.finished) res.end()
          })
          .catch((err)=>{
            this.log_err({err})
            if (!res.finished) res.end()
          })
      } else {
        logger.warning({user:user.uid,ip:ip(req),notexist:{method,route}})
        res.writeHead(404)
        res.end()
      }
    })

    this._server.on('close', () => {
      this.log_info('closing')
    })

    this._server.on('error', (err) => {
      logger.err({err})
    })

    process.on('SIGHUP', function () {
          logger.info('SIGHUP')
          // TODO reload conf
    })

    process.on('SIGINT', function () {
      //  this._server.close(function () {
          logger.info('SIGINT')
          process.exit(0)
        //})
    })

    process.on('SIGTERM', function () {
        this._server.close(function () {
          this.log_info('SIGTERM')
          process.exit(0)
        })
    })

  }

  set port (port) {
    if (isNaN(port)) throw new Error(Object.getPrototypeOf(this).constructor.name + 'port not a number')
    this._port = port
  }
  get port () {return this._port}

  set ip (ip) {
    if (!(Object.prototype.toString.call(ip) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: ip not string  ' + typeof ip)
    this._ip = ip
  }
  get ip () { return this._ip}

  checkrolesundgroups() {
    return new Promise((resolve) => {
      //throw new Error('asdas');
      resolve()
    })
  }

  listen () {
    this.checkrolesundgroups()
      .then( () => {
        this.log_info({listening:{ip:this.ip,port:this.port}})
        this._server.listen(this.port,this.ip)
      })
      .catch((err)=>{
        this.log_emerg({err})
      })
  }

  get config () {
    const conf = {}
    conf.port = this.port
    conf.ip = this.ip
    conf.auth = auth.config
    conf.router = router.config
    return conf
  }

  readConfig (conf) {
    if (conf) {
      auth.readConfig(conf.auth)
      router.readConfig(conf.router)
    }
  }

  async ping (fn) {
    this.log_info({ping:'---------------------------------------'})
    const user = await auth.ping()
    const r = await router.ping(user)
    fn(user && r)
  }

}


// -----------------------------
process.alias = 'test server'

const Logger = require('./logger')
const logger = new Logger()
const Auth = require('./authfreeipa')
const auth = new Auth(logger)

// mock
const none = null
const justwait = (m,ms=1000) => {
  return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Object.keys(m))
            }, ms)
        })
      }
//
const Route = require('./route')
//simple
const s = new Route(logger)
s.get = () => { console.log('-=GET=-') }
s.post = async () => { console.log('=-POST-='); await justwait({},2); }
// obj
let roles = ['r1','r2']
let groups = ['GROUP']
const fn = async (logger,user,req,res) => {
  //console.log(logger,user,req,res)
  console.log('-----')
  logger.info('start wait')
  const u = await justwait(user)
  logger.info('end wait, got ', JSON.stringify(u))
  console.log('-----')
  //throw new Error('ba baaa')
  return false
}

s.delete = {roles, groups, fn}
// obj + custom test
s.patch = {roles:[], groups:'canPatch', fn, test:async (u)=>{console.log('custom test',u)}}


const StaticRoute = require('./staticroute')

const Router = require('./router')
const router = new Router(logger,'routerRole','routerGroup',{
  src: new StaticRoute(logger,'*','*','./static','src')
})
//const router = new Router(logger,'*','*')
//router.kala = new Route(logger,'b',['a','b'],{get:()=>{return true}})

let configFile = './config.js'
configFile = './delete.me'

const config = require(configFile)
const Server = require('./server')
const server = new Server(logger,auth,router)


const args = process.argv.slice(2)
// print out sample consfig
if ((args.length === 1) && args[0].includes('config')) {
  console.log('/* sample config */\nmodule.exports = ',JSON.stringify(server.config,null,4))
  process.exit(0)
}
// TODO config

//const config = require(configFile)
server.readConfig(config)
// test server
if ((args.length === 1) && args[0].includes('ping')) {
    server.ping((ok) => {
      server.log_info({ping:ok})
      process.exit(0)
    })
}
server.listen()
