function ip(req){
  let ip = req.socket.remoteAddress
  if (req.headers['x-real-ip']) ip = req.headers['x-real-ip']
  if (req.headers['x-public-ip']) ip = req.headers['x-public-ip']
  return ip
}
module.exports = { ip }
