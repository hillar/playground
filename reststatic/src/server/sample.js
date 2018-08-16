const server = require('./src')
const myserver = server.createServer({

  roles: '*',

  groups: '*',
  /*
  // by default freeipa is used as Identity server
  // or just write your own simple function

  auth: async (username,password) => {
    const getuserfromsomewhere = await new Promise((resolve,reject) => {
      resolve({uid:username,roles:[],groups:[]})
    })
    return getuserfromsomewhere
  },
  */
  router:  { someroutenameasdas:  { get: (logger,user,req,res) => {
      logger.log_info({returning:user})
      res.write('TEST '+JSON.stringify(user))
      }
    }
  }

})

myserver.listen()
