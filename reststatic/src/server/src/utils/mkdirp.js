const { mkdirSync:mkdirs } = require('fs')
const { dirname } = require('path')

function mkdir(path, mode = 0777){
  try {
    mkdirs(path, mode)
  } catch({errno}) {
    if (-2 !== errno) return // enoent
    mkdir(dirname(path), mode)
    mkdir(path, mode)
  }
}

module.exports = {
  mkdir
}
