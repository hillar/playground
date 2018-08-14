

const Auth = require('./src/classes/authfreeipa')
const auth = new Auth()

const { params } = require('./src/classes/requtils')
const router = {}
router.test = { get: (logger,user,req,res) => {
  const p = params(req)
  logger.log_info(p)
  res.write('TEST '+JSON.stringify({params:p}))
  }
}

const Server = require('./src/classes/server')
const server = new Server(null, '*','*', auth, router)

server.listen()
