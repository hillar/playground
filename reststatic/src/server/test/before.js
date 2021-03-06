const glob = require('glob')
const fs = require('fs')
const path = require('path')
const files = glob.sync('src/server/src/**/*.js')


for (const src of files) {
  const test = src.replace('/src/','/test/').replace('.js','.tape.js')
  if (!fs.existsSync(test)){
    console.error('no test for', src)
    fs.writeFileSync(test,`

process.alias = 'test ${src}'
test = require('tape')
test('${src}', function (t) {
  t.fail('no tests for ${src}')
  t.end()
})

    `)
  }
}
for (const src of files) {
  const doc = src.replace('/src/','/doc/').replace('.js','.md')
  if (!fs.existsSync(doc)){
    console.error('no doc for', src)
    fs.writeFileSync(doc,`
# ${src}

see ${src}
    `)
  }
}
