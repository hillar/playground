const http = require('http')

/*
createServer:

req options.static.root
req options.rest
opt options.logger defualts ./logger
opt options.auth defaults ./freeipa

const rest = {}
rest.get = {}
rest.get.conctact =  async (req,res) => {
  console.log(req)
  res.end()
}

const server = await restatic.createServer({
  static: {root:'./'},
  rest: rest
})
server.listen(port, ip)

*/


module.exports = {
   createServer: async (options) => {
      return new Promise( async (resolve, reject) => {

        if (!options.logger) {
          const os = require('os')
          const Logger = require('./logger')
          options.logger = new Logger(process.pid,os.hostname())
        }
        const logger = options.logger

        if (!options.rest)  options.rest = {}
        const router = options.rest
        if (!router.static) {
          const Static = require('./static')
          router.static = new Static(logger)
        }

        // check routers ...
        const routes = []
        for (const route of Object.keys(router)){
            const methods = router[route].methods
            const allowed = router[route].allowed
            const groups = router[route].groups
            const setters = router[route].setters
            if (methods.length < 1) throw new Error('no methods for route '+ route)
            if (allowed === null) logger.warning('nobody allowed to '+ route)
            let mm = []
            for (const method of methods) {
                if (router[route]['_'+method]) {
                  let tmp = {}
                    tmp[method] = {allowed:router[route]['_'+method].allowed,groups:router[route]['_'+method].groups}
                  mm.push(tmp)
                }
                else mm.push(method)


            }
            routes.push({route,allowed,groups,setters,methods:mm})
        }
        if (options.generateSampleConfig) {
          console.log(JSON.stringify(routes,null,2))
          process.exit(0)
        }
        console.dir(routes)
        console.log(JSON.stringify(routes,null,2))

        // TODO, 'run' all routers for test

        if (!options.auth) {
          const Auth = require('./auth')
          options.auth = new Auth('example',logger)
        }
        const auth = options.auth

        const server = http.createServer( async (req, res) => {
            // parse login and password from headers
            const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
            const strauth = new Buffer(b64auth, 'base64').toString()
            const splitIndex = strauth.indexOf(':')
            const username = strauth.substring(0, splitIndex)
            const password = strauth.substring(splitIndex + 1)
            if (username && password ) {
              req.user = await auth.verify(username, password)
            }
            if (!req.user){
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
              logger.debug({username,method,route})
              const ok = await router[route].before(req, res, method,route)
              if (ok) await router[route][method](req, res)
              //router[route].after(req, res)
              if (!res.finished) res.end()
            } else {
              logger.warning({username,remoteip:req.socket.remoteAddress,notexist:{method,route}})
              res.writeHead(404)
              res.end()
            }
        })
        server.on('close', () => {
          logger.info('closing')
        })
        server.on('error', (err) => {
          logger.error(err)
        })

        process.on('SIGHUP', function () {
              logger.info('SIGHUP')
              // TODO reload conf
        })

        process.on('SIGINT', function () {
          //  server.close(function () {
              logger.info('SIGINT')
              process.exit(0)
            //})
        })

        process.on('SIGTERM', function () {
            server.close(function () {
              logger.info('SIGTERM')
              process.exit(0)
            })
        })

        resolve(server)
    })
  }
}
