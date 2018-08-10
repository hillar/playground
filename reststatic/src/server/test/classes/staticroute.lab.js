const { expect } = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

lab.test('staticroute ping defaults', async () => {

  let L = require('../../src/classes/logger')
  let l = new L()
  let B = require('../../src/classes/staticroute')
  let b = new B(l)

  return b.ping().then( (result) => {
    expect(result).to.be.true()
  })

})

lab.test('staticroute ping dir not exists', async () => {

  let L = require('../../src/classes/logger')
  let l = new L()
  let B = require('../../src/classes/staticroute')
  let b = new B(l)
  b.root = 'doesnotexist bla bla jadadadaaaa'
  return b.ping().then( (result) => {
    expect(result).to.be.false()
  })

})
