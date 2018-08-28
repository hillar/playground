/*

sample solr

*/



// move to utils

const http = require('http')
const https = require('https')
const path = require('path')

async function fetchJSON(proto, host, port, path, body){
  return new Promise((resolve, reject) => {
    if (!host) reject(new Error('fetchJSON no host'))
    if (!port) reject(new Error('fetchJSON no port'))
    if (!path) reject(new Error('fetchJSON no path'))
    const start = Date.now()
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    try {
      const contentlength = ( (body) ? Buffer.byteLength(body) : 0 )
      const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'GET',
        headers: {
          'content-type' : 'application/json; charset=UTF-8',
          'content-length' : contentlength
        }
      };
      const req = (proto === 'https' ? https : http).request(options, (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data))
        });
        res.on('error', (error) => {
          reject(error)
        })
      });
      req.on('error', (error) => {
        reject(error)
      });
      if (body) req.write(body);
      req.end();
    } catch (error) {
      reject(error)
    }
  })
}


const Route = require('../classes/route')
const { ip } = require('../classes/requtils')

const HOST = 'localhost'
const PORT = 8983
const COLLECTION = 'solrdefalutcore'

module.exports = class SolrRoute extends Route {

  constructor (logger, roles, groups, host = HOST, port = PORT, collection = COLLECTION) {
    super(logger, roles, groups)
    this.host = host
    this.port = port
    this.collection = collection

    const putDoc = async (log, user, req, res) => {
      const result = await new Promise( async (resolve) => {
        const id = path.parse(decodeURIComponent(req.url)).name

        let body = []
        req.on('data', (chunk) => {
          body.push(chunk)
        }).on('end', () => {
          try {
            body = JSON.parse(Buffer.concat(body).toString())
          } catch (e) {
            body = {}
            log.log_warning({notJSON:Buffer.concat(body).toString().slice(0,24)})
          }
          resolve(body)
        })

      })
      if (body.id && body.set) {
        /*
        {"id":"mydoc",
        "sub_categories":{"add-distinct":"under_10"},
        */

      } else log.log_warning({nodata:id})
      return result
    }

    const getDoc = async (log, user, req, res) => {
      const result = await new Promise( async (resolve) => {
        const id = path.parse(decodeURIComponent(req.url)).name
        let response
        try {
          response = await fetchJSON('http',this.host,this.port,`/solr/${this.collection}/select?q=id:${id}`)
          if (response.response && response.response.docs && response.response.docs.length === 1) {
            res.write(JSON.stringify(response.response.docs[0]))
            log.log_notice({docid:id})
          } else log.log_warning({SolrNotDoc:response.responseHeader.params.q})
        } catch (e) {
          log.log_err({host:this.host,error:e.message,e})
        }
        resolve(true)
      })
      return result
    }

    const ping = async (u) => {
      const result = await new Promise( async (resolve)=>{
            let response
            try {
              response = await fetchJSON('http',this.host,this.port,`/solr/${this.collection}/admin/ping?wt=json`)
              this.log_info({ping:{host:this.host,response}})
            } catch (e) {
              this.log_err({ping:{host:this.host,error:e.message,e}})
            }
            resolve(response && response.status && response.status === 'OK')
      })
      return result
    }

    this.setMethod('get',getDoc, null, null, ping)
    this.setMethod('put',putDoc, null, null, ping)

  }

  get host () { return this._host }
  set host (host) { this._host = host }
  get port () { return this._port }
  set port (port) { this._port = port }
  get collection () { return this._collection }
  set collection (collection) { this._collection = collection }

}
