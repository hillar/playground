/*

RFC5424

  emerg           (0),  -- emergency; system is unusable
  alert           (1),  -- action must be taken immediately
  crit            (2),  -- critical condition
  err             (3),  -- error condition
  warning         (4),  -- warning condition
  notice          (5),  -- normal but significant condition
  info            (6),  -- informational message
  debug           (7)   -- debug-level messages


  * Facility
  * Severity
  * TIMESTAMP
  * HOSTNAME
  * APP-NAME
  * PROCID
  * MSGID
  * STRUCTURED-DATA <- application-specific information
  * MSG

PCI DSS

    Record at least the following audit trail entries for all system components for each event:
    10.3.1 User identification
    10.3.2 Type of event
    10.3.3 Date and time
    10.3.4 Success or failure indication
    10.3.5 Origination of event
    10.3.6 Identity or name of affected data, system component, or resource.

so "mixin" audit trail entries:

* SEVERITY  10.3.2 use *notice* or *warning* only
* TIMESTAMP 10.3.3 now()
* HOSTNAME 10.3.6 os.hostname()
* APP-NAME 10.3.6
* STRUCTURED-DATA user 10.3.1 10.3.4 remoteip10.3.5 url=10.3.6<- application-specific information
* MSG




*/

const os = require('os')
const path = require('path')

const LOGMETHODS = require('../constants/logmethods')

const SEVERITYERROR = [
  'emerg',
  'alert',
  'crit',
  'err',
]
const SEVERITYLOG = [
  'warning',
  'notice',
  'info',
  'debug'
]

// test if all LOGMETHODS exists here
const tmp = [...SEVERITYLOG, ...SEVERITYERROR]
if (!(LOGMETHODS.every( e => tmp.includes(e)))) throw new Error ('LOGMETHODS do not match')

function nowAsJSON(){
  const now = new Date()
  return now.toJSON()
}

module.exports = class Logger {
  constructor() {

    if (!process.alias) {
      let pe = path.parse(process.argv[1])
      process.alias = pe.base === 'index.js' ? pe.dir.split('/').pop() : pe.base
    }
    // TODO rfc5424 6.3.  STRUCTURED-DATA
    for (const method of SEVERITYLOG) {
      this[method.toLowerCase()] = (ctx,...msg) => console.log(nowAsJSON(),os.hostname(),'[',process.alias,':',process.pid,']',method.toUpperCase(),':', JSON.stringify(ctx),...msg)
    }
    for (const method of SEVERITYERROR) {
      this[method.toLowerCase()] = (ctx,...msg) => console.error(nowAsJSON(),os.hostname(),'[',process.alias,':',process.pid,']',method.toUpperCase(),':', JSON.stringify(ctx), ...msg)
    }
  }
}
