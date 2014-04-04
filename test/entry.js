var Bear = require('./lib/bear.js')

// Apply CSS to the page
require('style!css!./css/style.css')

// Check to make sure bear loads css async
var bear = new Bear()
bear.on('data', function(css) {
  alert('Got the css: ' + css)
})
