const Logger = require('./src/classes/logger')
const logger = new Logger()

const Auth = require('./src/classes/authfreeipa')
const auth = new Auth(logger)

const StaticRoute = require('./src/classes/staticroute')
const { params } = require('./src/classes/requtils')
const Route = require('./src/classes/route')
const Router = require('./src/classes/router')
const router = new Router(logger,null,null,
  { 'html': new StaticRoute(logger,null,null,'./static')},
  { 'search': new Route(logger,null,null,{
    get:(logger,user,req,res) => {
      const p = params(req)
      logger.log_info(p)
      res.write('SEARCH '+JSON.stringify({params:p}))
      }
    })
  }
  )

const Server = require('./src/classes/server')
const server = new Server(logger, '*','*', auth, router)

server.listen()