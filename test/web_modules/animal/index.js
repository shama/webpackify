var EE = require('events').EventEmitter
var inherits = require('util').inherits

function Animal() {
  EE.call(this)
}
module.exports = Animal
inherits(Animal, EE)
