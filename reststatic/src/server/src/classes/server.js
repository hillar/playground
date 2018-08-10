const Base = require('./base')


module.exports = class Server extends Base {
  constructor (logger, auth, router) {
    super(logger)
    if (auth && auth.config && Object.prototype.toString.call(auth.verify) === '[object AsyncFunction]') this.auth = auth
    else throw new Error('no auth')
    console.log()
    if (router && router.config) this.router = router
    else throw new Error('no router')
  }
  get config () {
    const conf = {}
    conf.auth = auth.config
    conf.router = router.config
    return conf
  }
  readConfig (conf) {
    auth.readConfig(conf.auth)
    router.readConfig(conf.router)
  }
  async ping (fn) {
    this.log_info({ping:'---------------------------------------'})
    const user = await auth.ping()
    const r = await router.ping(user)
    fn(user && r)

  }


}

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
  src: new StaticRoute(logger,'*','*','./','src')
})
//const router = new Router(logger,'*','*')
//router.kala = new Route(logger,'b',['a','b'],{get:()=>{return true}})


const Server = require('./server')
const server = new Server(logger,auth,router)

let configFile = './config.js'
configFile = './delete.me'
const args = process.argv.slice(2)
// print out sample consfig
if ((args.length === 1) && args[0].includes('config')) {
  console.log('/* sample config */\nmodule.exports = ',JSON.stringify(server.config,null,4))
  process.exit(0)
}
// TODO config

const config = require(configFile)
server.readConfig(config)
// test server
if ((args.length === 1) && args[0].includes('ping')) {
    server.ping((ok)=>{
      server.log_info({ok})
      process.exit(0)
    })
}
