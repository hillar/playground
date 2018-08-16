const Identity = require('./classes/authfreeipa')
const Server = require('./classes/server');

function createServer(options) {
  if (!options) throw new Error('no options')
  if (!options.auth) options.auth = new Identity(options.logger)
  return new Server(options.auth,options.router,options.config,options.roles,options.groups,options.logger)
}

module.exports = {
  createServer
}
