
    process.alias = 'test src/server/src/classes/authbase.js'
    test = require('tape')
    test('src/server/src/classes/authbase.js', async function (t) {
      let L = require('../../src/classes/logger')
      t.equal(typeof L, 'function')
      let l = new L()
      t.equal(typeof l, 'object')


      let B = require('../../src/classes/authbase')
      t.equal(typeof B, 'function')
      //const z = new B(l,1,2)
      t.throws(() => {const x = new B({})})
      t.throws(() => {const y = new B()})
      t.throws(() => {const y = new B(l,1)})
      t.throws(() => {const y = new B(l,'./',1)})
      let b = new B(l)
      t.equal(typeof b, 'object')
      t.deepEqual(b.config,{ cachetime: 60000, cachedir: './', cachefile: 'users.json' })
      t.throws(() => {b.cachefile = 1})
      t.throws(() => {b.cachedir = 2})
      b.cachefile = 'delete.me'
      b.cachedir = '/tmp'
      b.cachetime = 3000
      t.deepEqual(b.config,{ cachetime: 3000, cachedir: '/tmp', cachefile: 'delete.me' })


      //b.verify()
      //t.deepEqual(b.verify(), {})
      /*// no user
      t.throws(() => {b.verify('user',1)}) // no pass
      t.deepEqual(b.verify('user',''),{})
      */
      class BB extends B {
        constructor(...params) {
          super(...params)
        }
      }
      let bb = new BB(l)
      bb.cachetime = -1
      t.equal(bb.cachetime,-1)

      let u = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
      /*
      bb.verify(null,u)
      .then((p)=>{
        console.log('***********---------------------')
        console.log('p',p)
      })
      .catch((e)=>{
        console.log('---------------------')
        console.error(e)
      })
      .finally(()=>{
        t.end()
      })
      */

      //t.throws(async () => {await bb.verify(u,u)})
      //bb.reallyVerify = (u,p) => { return {user:u,pass:p}}
      //bb.verify(u,u)
      //t.deepEqual(bb.verify(u,u),{})


      t.end()
    })
