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
  async test (fn) {
    const a = await auth.test()
    const r = await router.test()
    fn(a && r)

  }


}

process.alias = 'test server'

const Logger = require('./logger')
const logger = new Logger()
const Auth = require('./authfreeipa')
const auth = new Auth(logger)
const Router = require('./router')
const router = new Router(logger)
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
if ((args.length === 1) && args[0].includes('test')) {
    server.test((ok)=>{
      server.log_info({ok})
      process.exit(0)
    })
}
