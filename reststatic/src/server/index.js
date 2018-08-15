/*
auth takes username and password and returns user object

user object has to have:
uid (string)
roles (array)
groups (array)

*/
const auth = async (username,password) => {
  return {uid:username,roles:[],groups:[]}
}

const { params } = require('./src/classes/requtils')
const router = {}
router.test = { get: (logger,user,req,res) => {
  const p = params(req)
  logger.log_info(p)
  res.write('TEST '+JSON.stringify({params:p}))
  }
}

const Server = require('./src/classes/server')
const server = new Server(null, 'maja','kala', auth, router)

server.listen()
