
const cliParams = require('commander')
const restatic = require('./restatic')

const Logger = require('./logger')
const logger = new Logger()

const Route = require('./route')
const rest = {}

rest.kala = new Route(logger,'*')
rest.kala.get = (req,res) => {
  console.log('kala!!!!');
  res.write('kala')
  res.write('   maja')
}

rest.user = new Route(logger,['a','b','guest'])
//rest.maja.allowed = 'admins'
const allowed = ['guest','*']
const groups = 'c3'
const fn = (req,res) => {
  console.log(req.user);
  res.write(JSON.stringify(req.user))
}
rest.user.get  = {allowed, groups, fn}

rest.kala3 = new Route(logger,['a','b','c'])
rest.kala3.post = () => {}
rest.kala3.delete = () => {}


const config = require('./config')
config.portListen = 4444
config.ipListen = '0.0.0.0'

/*
const auth = new FreeIPA()
const rest = {}
rest.conctact = new Contact
*/
const main = async () => {
  // get conf
  // check conf items
  // await depes
  //
  let server
  try {
    server = await restatic.createServer({
      //auth: {func:function(u,p){ console.log('auth',u,p);return true; }},
      logger: logger, //new Logger(),
      //static: {root:'./',route:'static'},
      rest: rest,
      generateSampleConfig: false
    })
  } catch (e) {
    logger.emerg(e)
  }
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


logger.debug('starting ..')
if (process.argv.length > 2) {
  let tmp = 'params: '
  for(var index=2; index < process.argv.length; index++ ){
    tmp += ` ${process.argv[ index ]}`
  }
  logger.info(tmp)
}
main()
  .then(() => logger.info('STARTED'))
  .catch((err) => {logger.emerg(err)})
