const { expect } = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

lab.test('aut base verify ', async () => {
  
  let L = require('../../src/classes/logger')
  let l = new L()
  let B = require('../../src/classes/authbase')
  let b = new B(l)
  let u = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('')

  return b.verify(u,u).then( (user) => {
    expect(user).to.be.an.object()
  })

})
