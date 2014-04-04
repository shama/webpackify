var inherits = require('util').inherits
var Animal = require('animal')

function Bear() {
  var self = this
  Animal.call(this)

  // Call things async and return raw CSS
  require(['css!../css/bear.css'], function(css) {
    process.nextTick(function() {
      self.emit('data', css)
    })
  })
}
module.exports = Bear
inherits(Bear, Animal)
