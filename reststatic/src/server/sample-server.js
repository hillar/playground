const Logger = require('./logger')
const logger = new Logger()
const Auth = require('./authfreeipa')
const auth = new Auth(logger)
const StaticRoute = require('./staticroute')
const Router = require('./router')
const router = new Router(logger,'routerRole','routerGroup',{
  files: new StaticRoute(logger,'*','*','./static','files')
})
const  configFile = './config.js'
const config = require(configFile)
const Server = require('./server')
const server = new Server(logger,auth,router,config)

const args = process.argv.slice(2)
// print out sample consfig
if ((args.length === 1) && args[0].includes('config')) {
  console.log('/* sample config */\nmodule.exports = ',JSON.stringify(server.config,null,4))
  process.exit(0)
}
// ping endpoints
if ((args.length === 1) && args[0].includes('ping')) {
    server.ping((ok) => {
      server.log_info({ping:ok})
      process.exit(0)
    })
}

server.listen()
