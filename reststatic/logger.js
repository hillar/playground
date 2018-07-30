function nowAsJSON(){
  const now = new Date()
  return now.toJSON()
}

class Logger {}

// TODO
for (const level of [ 'Trace', 'Debug', 'Info', 'Log', 'Access','Warn','Warning']) {

  Logger.prototype[level.toLowerCase()] = (...msg) => {
    const m = {}
    m['time'] = nowAsJSON()
    m[level] = []
    for (const mm of msg) m[level].push(mm)
    console.log(JSON.stringify(m))
  }
}

for (const level of [ 'Error', 'Fatal']) {

  Logger.prototype[level.toLowerCase()] = (msg) => {
    const time = nowAsJSON()
    console.error(JSON.stringify({time,level,msg}))
  }
}

Logger.prototype['dir'] = console.dir

module.exports = new Logger;
