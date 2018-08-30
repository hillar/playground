const StaticRoute = require('./src/sample/staticroute')
const Router = require('./src/classes/router')
const router = new Router(null,null,null,
  { 'dist': new StaticRoute(null,null,null,'./somestaticcontentdirecory')}

  )
router.default = 'dist'
router.roles = '*'
router.groups = '*'

const server = require('./src')
const myserver = server.createServer({router})
myserver.listen()
