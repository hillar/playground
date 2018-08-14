const Logger = require('./src/classes/logger')
const logger = new Logger()

const Auth = require('./src/classes/authfreeipa')
const auth = new Auth(logger)

const StaticRoute = require('./src/classes/staticroute')
const Router = require('./src/classes/router')
const router = new Router(logger,null,null,{
  'files2': new StaticRoute(logger,null,undefined,'./src/classes/static')
})

const Server = require('./src/classes/server')
const server = new Server(logger, 'null1',['null2','asd'], auth, router)

server.listen()
