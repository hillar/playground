/*


$ node src/server/sample-now-server.js
2018-08-30T07:35:45.844Z kala.local [ sample-now-server.js : 60566 ] INFO : {"AuthBase":{"loaded users cache from ":".//users.json"}}
2018-08-30T07:35:45.854Z kala.local [ sample-now-server.js : 60566 ] INFO : {"Server":{"STARTING":{"ip":"127.0.0.1","port":4444}}}
2018-08-30T07:35:45.863Z kala.local [ sample-now-server.js : 60566 ] INFO : {"Server":"waiting for requests ..."}
2018-08-30T07:35:53.830Z kala.local [ sample-now-server.js : 60566 ] INFO : {"Route":{"now":{"get":{"user":"guest","ip":"127.0.0.1","now":1535614553830}}}}

-------

$ curl -s http://guest:guest@localhost:4444/now
{"hello":{"uid":"guest","roles":[],"groups":[],"lastVerify":1535614494393,"firstVerify":1535614494393},"now":1535614553830}

*/


const server = require('./src')

const myserver = server.createServer({

  roles: '*',

  groups: '*',

  // by default freeipa is used as Identity server
  // for now just dummy auth

  auth: async (username,password) => {
    const getuserfromsomewhere = await new Promise((resolve,reject) => {
      resolve({uid:username,roles:[],groups:[]})
    })
    return getuserfromsomewhere
  },

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
