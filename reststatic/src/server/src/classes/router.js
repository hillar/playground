const AG = require('./rolesandgroups')

module.exports = class Router extends AG {

  constructor (logger, roles, groups, ...routes) {
    super(logger,roles, groups)
    //this._routes = ...routes

  }
  test () {
    this.log_info('test begin ----------------')

    this.log_info('test end ------------------')
    return true

  }
}
