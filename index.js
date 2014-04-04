var webpack = require('webpack')
var through = require('through')
var extend = require('deep-extend')
var path = require('path')
var fs = require('fs')
var EOL = require('os').EOL
var charm = require('charm')()
charm.pipe(process.stdout)

module.exports = function(browserify, opts) {
  var entry = opts.entry || opts.e || browserify.argv.entry || browserify.argv.e || browserify.argv._.slice(0, 1)

  if (Array.isArray(entry) && entry.length === 1) entry = entry[0]
  var outfile = opts.outfile || opts.o || browserify.argv.outfile || browserify.argv.o

  var extensions = browserify._extensions || ['.js', '.json']
  extensions.unshift('')

  opts = extend({
    entry: (Array.isArray(entry)) ? entry.map(path.resolve) : path.resolve(entry),
    output: {
      path: path.resolve(path.dirname(outfile)),
      filename: path.basename(outfile),
    },
    resolve: {
      extensions: extensions,
    },
  }, readPkg(path.join(process.cwd(), 'package.json')), opts || {})

  function parsewebpack(err, stats) {
    var self = this
    if (err) return self.emit('error', err)
    var stat = stats.toJson()
    if (stat.errors.length > 0) {
      stat.errors.forEach(function(err) {
        charm.foreground('red').write(err + EOL + EOL)
      })
    }
    if (stat.warnings.length > 0) {
      stat.warnings.forEach(function(warn) {
        charm.foreground('yellow').write(warn + EOL + EOL)
      })
    }
    fs.readFile(path.resolve(opts.output.path, stat.assetsByChunkName.main), function(err, data) {
      self.queue(data)
      self.queue(null)
    })
  }

  browserify.noParse(opts.entry)
  browserify.transform({ global: false }, function(file) {
    if (file !== opts.entry) return through()
    return through(function(buf) { }, function() {
      webpack(opts, parsewebpack.bind(this))
    })
  })
}

function readPkg(filepath) {
  var pkg = require(filepath)
  if (!pkg.webpackify) return {}
  if (typeof pkg.webpackify === 'string') return require(pkg.webpackify)
  return pkg.webpackify
}
