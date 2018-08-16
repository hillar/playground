
    process.alias = 'test src/server/src/classes/helpers.js'
    test = require('tape')
    test('src/server/src/classes/helpers.js', function (t) {

      let h = require('../../src/classes/helpers')

      // creatorName
      t.equal(h.creatorName(''),'String','string')
      t.equal(h.creatorName(1),'Number','number')
      t.equal(h.creatorName([]),'Array','array')
      t.equal(h.creatorName({}),'Object','object')
      const p = new Promise((r)=>{r()})
      t.equal(h.creatorName(p),'Promise')
      t.equal(h.creatorName(() => {}),'Function')
      t.equal(h.creatorName(async () => {}),'AsyncFunction')
      const fp = () => {return new Promise((r)=>{r()})}
      t.equal(h.creatorName(fp),'Function')
      const afp = async () => {const p = await new Promise((r)=>{r()}); return p}
      t.equal(h.creatorName(afp),'AsyncFunction')


      class kala {}
      t.equal(h.creatorName(new kala),'kala')

      class kalamaja extends kala {}
      t.equal(h.creatorName(new kalamaja),'kalamaja')

      class pt extends kalamaja {}
      t.equal(h.creatorName(new pt),'pt')

      let L = require('../../src/classes/logger')
      const l = new L()
      t.equal(h.creatorName(l),'Logger')

      let B = require('../../src/classes/base')
      const b = new B()
      t.equal(h.creatorName(b),'Base')

      let I = require('../../src/classes/authfreeipa')
      const i = new I()
      t.equal(h.creatorName(i),'AuthFreeIPA')

      // objectType
      t.equal(h.objectType(''),'[object String]')
      t.equal(h.objectType(1),'[object Number]')
      t.equal(h.objectType([]),'[object Array]')
      t.equal(h.objectType({}),'[object Object]')
      t.equal(h.objectType(p),'[object Promise]')
      t.equal(h.objectType(fp),'[object Function]')
      t.equal(h.objectType(afp),'[object AsyncFunction]')
      t.equal(h.objectType(l),'[object Object]')
      t.equal(h.objectType(b),'[object Object]')



      t.end()
    })
