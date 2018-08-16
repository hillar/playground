
    process.alias = 'test src/server/src/index.js'
    test = require('tape')
    test('src/server/src/index.js', function (t) {
      const server = require('../src')
      /*
      const myserver = server.createServer({
        router: {
          whatever:{
            get:()=>{}
          }
        }
      })
      */

      t.throws(() => { const myserver = server.createServer()})
      t.throws(() => { const myserver = server.createServer({})})
      t.end()
    })
