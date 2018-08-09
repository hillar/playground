const METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete'
]

    process.alias = 'test src/server/src/classes/route.js'
    test = require('tape')
    test('src/server/src/classes/route.js', async function (t) {
      let L = require('../../src/classes/logger')
      let l = new L()
      let B = require('../../src/classes/route')
      let b
      t.throws(()=>{b = new B(l,null,null,{nnnn:()=>{}})})
      t.throws(()=>{b = new B(l,null,null,{get:null})})
      b = new B(l)
      t.throws(()=>{b.setMethod()})
      for (const m of METHODS) t.throws(()=>{b[m] = {fn:()=>{},test:{}}})
      for (const m of METHODS) t.doesNotThrow(()=>{b[m] = {fn:()=>{},roles:'a',groups:'b'}})
      t.deepEqual(b.methods,[ 'get', 'post', 'put', 'patch', 'delete' ])
      t.deepEqual(b.config,{ roles: undefined, groups: undefined, get: { roles: 'a', groups: 'b' }, post: { roles: 'a', groups: 'b' }, put: { roles: 'a', groups: 'b' }, patch: { roles: 'a', groups: 'b' }, delete: { roles: 'a', groups: 'b' } })
      b.readConfig({roles: 'AAA', groups: 'BBB',get: { roles: '*', groups: '*' }})
      t.deepEqual(b.config, { roles: 'AAA', groups: 'BBB', get: { roles: '*', groups: '*' }, post: { roles: 'a', groups: 'b' }, put: { roles: 'a', groups: 'b' }, patch: { roles: 'a', groups: 'b' }, delete: { roles: 'a', groups: 'b' } })
      /*
      b = new B(l,'test',['test','a','b'])
      t.equal(typeof b, 'object')
      t.deepEqual(b.roles,'test')
      t.deepEqual(b.groups,['test','a','b'])

      t.deepEqual(b.allowed('test'),true)
      //t.equal(b.groups,'*')
      t.deepEqual(b.methods,[])
      t.throws(()=>{b.setMethod('test')},'Error: method name not in METHODS: test')
      t.throws(()=>{b.setMethod('get')},'Error: get not a function: undefined')
      b.get = () => { return '1234'}
      t.equal(typeof b.get, 'function')
      t.equal(await b.get(l,{roles:'test',groups:'a'}),'1234')

      let fn = async (l,u,rq,rp) => { return '4321'}
      b.post = {fn, roles:'test', groups:['test','abc']}
      t.equal(typeof b.post, 'function')
      t.deepEqual(b.methods,['get','post'])
      t.equal(await b.post(l,{roles:['test'],groups:'abc'}),'4321')
      t.equal(await b.post(l,{roles:['test1'],groups:'test'}),false)
      t.equal(await b.post(l,{roles:['test'],groups:'test1'}),false)
      t.deepEqual(b.config,{ roles: 'test', groups: [ 'a', 'b' ], get: { roles: 'test', groups: [ 'a', 'b' ] }, post: { roles: 'test', groups: [ 'test', 'abc' ] } })

      t.throws(()=>{b.delete = {fn, roles:'test', groups:['test'],test:()=>{}}})
      t.doesNotThrow(()=>{b.delete = {fn, roles:'test', groups:['test'],test:async()=>{}}})

      */

      t.end()
    })
