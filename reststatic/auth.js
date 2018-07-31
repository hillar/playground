module.exports = class {
  constructor(realm,func,logger) {
    const fn = (u,p) => {
      return true
    }
    this.realm = realm
    this.func = func || fn
  }
}
