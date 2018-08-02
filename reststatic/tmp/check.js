
// remove empty elements
function zapArray(a) {

    a = [...(new Set(a))] // uniq
    let i = -1;
    const length = a ? a.length : 0;
    const result = [];
    while (++i < length) {
        const value = a[i];
        if (value && value.length > 0) {
            result.push(value)
        }
    }

    return result;

}

const Base = require('./base')

module.exports = class Check extends Base {

  constructor (logger,checklist) {
    super(logger)
    this.inlist = () => {return false}
    this.checklist = checklist
  }
  
  get checklist () { return this._checklist}
  set checklist (checklist) {
    let orig = checklist
    if (!(Array.isArray(checklist) || Object.prototype.toString.call(checklist) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: not string nor array')
    if (checklist === '*' ) {
      this.inlist = () => {return true}
      this._checklist = '*'
      return
    }
    if (Object.prototype.toString.call(checklist) === '[object String]') checklist = [checklist]
    if (Array.isArray(checklist)) checklist = zapArray(checklist)
    else throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: checklist not a string nor array')
    if (Array.isArray(checklist) && checklist.length > 0) {
        this._checklist = checklist
        this.inlist = (memberOf) => {
            if (!Array.isArray(memberOf)) memberOf = [ memberOf ]
            return this._checklist.some( (v)  => {
                return memberOf.indexOf(v) >= 0
            })
        }
    } else {
      this.log_alert(Object.getPrototypeOf(this).constructor.name + ' empty checklist |' + orig + '|')
    }
  }

}

/*

process.alias = 'test Check'
let L = require('../logger')
let l = new L()


const t = 'kala'
let C = require('./check')
let c = new C(l,'*')
c.checklist
c.inlist(t)

c.checklist = t
c.checklist
c.inlist(t)

c = new C(l,t)
c.checklist
c.inlist(t)

c = new C(l,[''])
console.log(c.checklist)
console.dir(c)
console.log(c.inlist(t))
*/
