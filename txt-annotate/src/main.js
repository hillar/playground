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
/*
for (const doc of mocks) {
  const li = document.createElement("li")
  annotate(li,doc)
  alist.appendChild(li)
}
*/
fetch('http://172.16.33.129:8983/solr/solrdefalutcore/select?q=id:114b1bf8ab29a4ea306bd72b82e10584')
.then(function(response) {
    return response.json();
  })
  .then(function(solr) {
    console.log(solr);
    const doc = solr.response.docs[0]
    annotate(alist,doc,'logline')
  });
