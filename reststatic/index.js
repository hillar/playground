const cliParams = require('commander')
const restatic = require('./restatic')
const logger = require('./logger')
//const rest = require('./rest')

const rest = {}
rest.get = {}
rest.get.conctact =  (req,res) => {
  console.log(req)
  res.end()
}


const config = {}
config.portListen = 4444
config.ipListen = '0.0.0.0'

const main = async () => {
  // get conf
  // check conf items
  // await depes
  //
  const server = await restatic.createServer({
    auth: function(u,p){ console.log('auth',u,p);return true; },
    logger: logger,
    static: {root:'./'},
    rest: rest
  })
  if (server) {
    server.listen(config.portListen, config.ipListen)
  } else {
    logger.fatal('no restatic')
    process.exit(1)
  }
/*
  process.on('uncaughtException', (error) => {
      console.error({'uncaughtException':`${error}`})
  })
  */
}

main().then(() => logger.info('STARTED')).catch((err) => {logger.fatal(err)})
