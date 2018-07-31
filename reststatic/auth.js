module.exports = class {
  constructor(realm,logger) {
    if (!logger) throw new Error('no logger')
    this.realm = realm
    this.logger = logger
  }
  verify(username, password){
    return new Promise ( (resolve, reject) => {
      if (username === 'anonymous') resolve({username, memberOf:['guest']})
      else resolve(false)
    })
  }
}
