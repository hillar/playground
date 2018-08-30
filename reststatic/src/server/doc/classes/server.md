
# server

see [source](../../src/classes/server.js)

Server holds [logger](logger.md), [auth](auth.md) and [router](router.md)

## createServer

see helper [createServer](../../src/index.js) function

If *logger* is undefined, then [default logger](../../src/classes/logger.js) is used.

If *auth* is undefined, then [default auth](../../src/classes/authfreeipa.js) is used.

*Router* can be defined as simple object

```javascript
const server = require('./src')

const myserver = server.createServer({

  roles: '*',

  groups: '*',

  //logger:

  //auth:

  router:  {
          now:  {
                  // here is method function for http://localhost/now
                  get: (logger,user,req,res) => {
                    const now = Date.now()
                    logger.log_info({now})
                    res.write(JSON.stringify({hello:user,now}))
                  }
                }
  }

})

myserver.listen()

```

or as "new Router"


```javascript
const StaticRoute = require('./src/sample/staticroute')
const Router = require('./src/classes/router')
const router = new Router(null, null, null, { 'dist': new StaticRoute(null,null,null,'./some/static/content/direcory/created/by/webpack/or/rollup/or/whatever')})
router.default = 'dist'
router.roles = '*'
router.groups = '*'

const server = require('./src')
const myserver = server.createServer({router})
myserver.listen()

```
