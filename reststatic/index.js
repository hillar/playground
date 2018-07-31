
const cliParams = require('commander')
const restatic = require('./restatic')
const Logger = require('./logger')
//const rest = require('./rest')


const config = {}
config.portListen = 4444
config.ipListen = '0.0.0.0'

const auth = {}
auth.func = (u,p) => { return true}

const rest = {}
rest.get = {}
rest.get.conctact =  (req,res) => {
  console.log(req)
  res.end()
}

const main = async () => {
  // get conf
  // check conf items
  // await depes
  //
  const server = await restatic.createServer({
    //auth: {func:function(u,p){ console.log('auth',u,p);return true; }},
    //logger: new Logger(),
    //static: {root:'./',route:'static'},
    //rest: rest
  })
  if (server) {
    server.listen(config.portListen, config.ipListen)
  } else {
    logger.emerg('no restatic')
    process.exit(1)
  }
/*
  process.on('uncaughtException', (error) => {
      console.error({'uncaughtException':`${error}`})
  })
  */
}
const logger = new Logger()

logger.debug('starting ..')
if (process.argv.length > 2) {
  let tmp = 'params: '
  for(var index=2; index < process.argv.length; index++ ){
    tmp += ` ${process.argv[ index ]}`
  }
  logger.info(tmp)
}
main().then(() => logger.info('STARTED')).catch((err) => {logger.emerg(err)})
