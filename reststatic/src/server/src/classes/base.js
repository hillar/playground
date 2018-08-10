const LOGMETHODS  =  require('./logmethods')

const __ignore_setters___ = [
  'logger',
  'checklist',
  'get',
  'post',
  'put',
  'patch',
  'delete'
]


module.exports = class Base {

  constructor (logger) {
    this.logger = logger
  }

  // everything has to have logging
  get logger () {return this._logger}

  set logger (logger) {
    if (!logger) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: no logger' )
    for (const method of LOGMETHODS){
      if (!logger[method] || !Object.prototype.toString.call(logger[method]) === '[object Function]') throw new Error(Object.getPrototypeOf(this).constructor.name +' :: logger has no method ' + method)
    }
    // add logger & funcs as non enumerable
    for (const method of LOGMETHODS){
      Object.defineProperty(this, 'log_' + method, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (...msgs) => {
          const ctx = {}
          ctx[Object.getPrototypeOf(this).constructor.name] = [...msgs][0]
          logger[method](ctx)
        }
      })
    }
    Object.defineProperty(this, '_logger', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: logger
    })
  }

  // list of props what can be set
  get setters () {
    function dive(i){
      let _self = []
      const proto = Object.getPrototypeOf(i)
      for (const key of Object.getOwnPropertyNames(proto)) {
        const desc = Object.getOwnPropertyDescriptor(proto, key)
        if (!key.startsWith('__') && !__ignore_setters___.includes(key) && desc && typeof desc.set === 'function') _self.push(key)
      }
      const parent = Object.getPrototypeOf(i)
      if (parent && parent.constructor.name !== 'Object') return [..._self, ...dive(parent)]
      else return _self
    }
    return dive(this)
  }

  // current values of all setters
  get config () {
    const conf = {}
    for (const setting of this.setters){
      conf[setting] = this[setting]
    }
    return conf
  }

   // set config (conf) { <-- RangeError: Maximum call stack size exceeded
   // re-read the configuration
   readConfig (conf) {
    if (conf)  {
       const settings = this.setters
       for (const setting of this.setters) {
         if (conf[setting] && !(this[setting] === conf[setting])){
           const m = {}
           m[setting] = {old:this[setting],new:conf[setting]}
           this.log_notice({readConfig:m})
           this[setting] = conf[setting]
         }
       }
    }
  }

  ping () {
    throw new Error('no ping')
  }


}
