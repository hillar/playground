import {
  annotate,
  userSelection
} from './annotate.js'

const mock = {
  domains: ['host.domain.tld'],
  emails: ['firstname.lastname@domain.tld'] ,
  content:'Hi!\n\nMy name is Firstname Lastname\nand my email is firstname.lastname@domain.tld\nand my pesonal website is http://host.domain.tld/Lastname/Firstname\n '
}

const userAnnotations = {}

userSelection(userAnnotations)
annotate(document.body,mock,userAnnotations)
