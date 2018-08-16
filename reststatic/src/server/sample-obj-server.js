/*
auth takes username and password and returns user object

user object has to have:
uid (string)
roles (array)
groups (array)

however, better use

const Auth = require('./src/classes/authfreeipa')
const auth = new Auth(logger)

*/

const auth = async (username,password) => {
  const getuserfromsomewhere = await new Promise((resolve,reject) => {
    resolve({uid:username,roles:[],groups:[]})
  })
  return getuserfromsomewhere
}

const { params } = require('./src/classes/requtils')

const router = {}
router.test = { get: (logger,user,req,res) => {
  const p = params(req)
  logger.log_info(p)
  res.write('TEST '+JSON.stringify({params:p}))
  }
}

router.test2 = {}
router.test2.get = (logger,user,req,res) => {
  logger.log_info('dummy get')
  res.write('dummy get')
}
router.test2.post = (logger,user,req,res) => {
  logger.log_info('dummy post')
  res.write('dummy post')
}



const Server = require('./src/classes/server')
const server = new Server(auth, router,null,'role','group')

server.listen()
