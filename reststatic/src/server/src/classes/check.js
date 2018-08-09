
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

  constructor (logger, checklist) {
    super(logger)
    this.inlist = () => {return false}
    this._checklist = undefined
    this.checklist = checklist
  }

  get isdefined () { return !!this._checklist }

  get checklist () {

    if (Array.isArray(this._checklist) && this._checklist.length === 1 ) return this._checklist[0]
    else return this._checklist

  }

  set checklist (checklist) {
    let orig = checklist
    //noop
    if (checklist === null || checklist === undefined) return
    //if not string or array, die
    if (!(Array.isArray(checklist) || Object.prototype.toString.call(checklist) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' checklist :: not string nor array ' + typeof checklist)
    if (checklist === '*' ) {
      this.inlist = (memberOf) => {
        //if not string or array, die, even we allow all
        if (!(Array.isArray(memberOf) || Object.prototype.toString.call(memberOf) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' inlist :: not string nor array ' + typeof memberOf)
        return true
      }
      this._checklist = '*'
      return
    }
    if (Object.prototype.toString.call(checklist) === '[object String]') checklist = [checklist]
    if (Array.isArray(checklist)) checklist = zapArray(checklist)
    else throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: checklist not array'+ typeof checklist)
    if (Array.isArray(checklist) && checklist.length > 0) {
        this._checklist = checklist
        this.inlist = (memberOf) => {
          //if not string or array, die
          if (!(Array.isArray(memberOf) || Object.prototype.toString.call(memberOf) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: not string nor array ' + typeof memberOf)
            if (!Array.isArray(memberOf)) memberOf = [ memberOf ]
            return this._checklist.some( (v)  => {
                return memberOf.indexOf(v) >= 0
            })
        }
    } else {
      this._checklist = undefined
      this.inlist = () => {return false}
      this.log_alert({'empty checklist, deny all': orig })
    }
  }

}
