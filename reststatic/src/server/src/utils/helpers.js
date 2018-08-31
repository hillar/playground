/*
Returns a name property of the Object constructor function **that created the instance object**.
*/

function creatorName(that) {
  return Object.getPrototypeOf(that).constructor.name
}

/*
? standardised way to tell the type of a javascript object
*/

function objectType(that) {
  return Object.prototype.toString.call(that)
}


module.exports = {
  creatorName,
  objectType
}
