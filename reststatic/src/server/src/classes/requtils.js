function ip(req){
  if (!req || !req.socket) return 
  let ip = req.socket.remoteAddress
  if (req.headers['x-real-ip']) ip = req.headers['x-real-ip']
  if (req.headers['x-public-ip']) ip = req.headers['x-public-ip']
  return ip
}

function params(req){
  const kv = {}
  if (!req || !req.url) return kv
  const rawparams = decodeURIComponent(req.url).split('?')[1]
  if (!rawparams) return kv
  const params = rawparams.split('&')
  for (const param of params) {
    const tmp = param.split('=')
    const key = tmp[0]
    const value = tmp[1] || true
    kv[key] = value
  }
  return kv
}
module.exports = { ip, params }
