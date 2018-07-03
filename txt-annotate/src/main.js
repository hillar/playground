import { annotate } from './annotate.js'

const mocks = [
  {
  id:1,
  domains: ['host.domain.tld','google.com'],
  emails: ['firstname.lastname@domain.tld'] ,
  names:['thisisaname'],
  dbs:['1970-01-01 00:00:00'],
  content:['bli bla bläh',
          'thisisaname was invented @ 1970-01-01 00:00:00 by google.com',
          'Hi!\n\nMy name is Firstname Lastname\nand my email is firstname.lastname@domain.tld\nand my pesonal website is http://host.domain.tld/Lastname/Firstname\n '
          ]
  }
]

const alist = document.getElementById('annotationslist')
for (const doc of mocks) {
  const li = document.createElement("li")
  annotate(li,doc)
  alist.appendChild(li)
}
