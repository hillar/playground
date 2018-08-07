
    process.alias = 'test src/server/src/classes/route.js'
    test = require('tape')
    test('src/server/src/classes/route.js', async function (t) {
      let L = require('../../src/classes/logger')
      t.equal(typeof L, 'function')
      let l = new L()
      t.equal(typeof l, 'object')

      let B = require('../../src/classes/route')
      t.equal(typeof B, 'function')
      let b = new B(l,'test')
      t.equal(typeof b, 'object')
      t.deepEqual(b.roles,['test'])
      t.equal(b.groups,'*')
      t.deepEqual(b.methods,[])
      t.throws(()=>{b.setMethod('test')},'Error: method name not in METHODS: test')
      t.throws(()=>{b.setMethod('get')},'Error: get not a function: undefined')
      b.get = () => {}
      t.equal(typeof b.get, 'function')
      t.equal(await b.get(l,{roles:['test'],groups:'testasdasdas'}),true)

      let fn = (l,u,rq,rp) => { /*console.log('route fn',l,u,rq,rp)*/}
      b.post = {fn, roles:'test', groups:['test']}
      t.equal(typeof b.post, 'function')
      t.deepEqual(b.methods,['get','post'])
      t.equal(await b.post(l,{roles:['test'],groups:'test'}),true)
      t.equal(await b.post(l,{roles:['test1'],groups:'test'}),false)
      t.equal(await b.post(l,{roles:['test'],groups:'test1'}),false)

      t.deepEqual(b.config,{ roles: [ 'test' ], groups: '*', get: { roles: [ 'test' ], groups: '*' }, post: { roles: [ 'test' ], groups: [ 'test' ] } })

      t.end()
    })
