
const fs = require( 'fs')
const http = require('http')

const STATICROUTE = 'static'



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
      if (!options.logger) options.logger = require('./logger')
      const logger = options.logger
      if (!options.static && !options.static.root) {
        logger.fatal('no static dir')
        process.exit(1)
      } else {
        if (!options.static.route) options.static.route = STATICROUTE
        fs.open(options.static.root+'/'+options.static.route, 'r', async (err) => {
          if (err) {
            logger.fatal(err)
            process.exit(1)
          } else {
            if (!options.rest) {
              logger.fatal('no rest router')
              process.exit(1)
            } else {
              const router = options.rest

              if (!options.static.route) options.static.route = 'static'
              if (!router.get) router.get = {}
              if (!router.get.static) router.get.static = (req, res) => {
                // default static file server
                const filename = options.static.root + decodeURIComponent(req.url)
                logger.log('static',decodeURIComponent(req.url),filename)
                fs.readFile(filename, (err,content) => {
                  if (err) {
                    logger.warning('not exists',filename)
                    res.writeHead(403)
                    res.end()
                  } else {
                    logger.access(filename)
                    res.write(content)
                    res.end()
                  }
                })

              }

              // TODO, 'run' all routers for test ...


              if (!options.auth) options.auth = require('./auth')

              const server = http.createServer((req, res) => {
                  // parse login and password from headers
                 const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
                 const strauth = new Buffer(b64auth, 'base64').toString()
                 const splitIndex = strauth.indexOf(':')
                 const login = strauth.substring(0, splitIndex)
                 const password = strauth.substring(splitIndex + 1)
                 // verify login and password are set and correct
                  if (!login || !password || !options.auth(login,password)) {
                    logger.info('sending auth req',login)
                    const header = `Basic realm=\"${options.realm}\"`
                    res.setHeader("WWW-Authenticate", header);
                    res.writeHead(401)
                    res.end()
                    return
                  }
                  const method = req.method.toLowerCase()
                  const route = decodeURIComponent(req.url).split('/')[1].toLowerCase()
                  logger.dir(decodeURIComponent(req.url).split('/'))
                  if (router[method][route]) {
                    logger.access({method,route,url:req.url})
                    router[method][route](req, res)
                  } else {
                    logger.warning('no handler for',method,route)
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
                  server.close(function () {
                    logger.info('SIGINT')
                    process.exit(0)
                  })
              })

              process.on('SIGTERM', function () {
                  server.close(function () {
                    logger.info('SIGTERM')
                    process.exit(0)
                  })
              })

              resolve(server)

            }
          }
        })
      }
    })
  }
}
