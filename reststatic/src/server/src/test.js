const server = require('./index.js')
const myserver = server.createServer({
  router: {
    whatever:{
      get:(log,user,req,res) => {
        res.write('Hello ' + user.uid)
      }
    }
  },
  roles:'*',
  groups:'*'
})
myserver.listen()
