# webpackify

> Use [webpack](http://webpack.github.io/docs/) through a [Browserify](http://browserify.org) plugin

## Features

Using this plugin, you can make Browserify:

* Use AMD modules and they actually load asynchronously
* Load any kind of resource CSS, images, fonts, Stylus, LESS, Handlebars, etc as a module
* Split your bundles into chunks that load asynchronously
* Resolve modules from custom folders, ie: `['node_modules', 'bower_components', 'src/vendor', 'etc']`
* Dynamically `require('./langs/' + language + '.js')` modules

...and almost everything else webpack does as webpack is just another node module that compiles modules, so why not?

## Examples

### Load modules asynchronously

``` js
require(['./big.js'], function(big) {
  // ./big.js will be split into it's own chunk and loaded async
})
```

### Load CSS as modules

Install the css and style loaders with: `npm install css-loader style-loader --save-dev`

Within your code:

``` js
// Apply ./css/style.css directly to the page
require('style!css!./css/style.css')

// Return the CSS as a string
var css = require('css!./css/style.css')
```

Both `@import()` and `url()` statements within your CSS will resolve as modules too.

### Resolve modules from custom folders

Configure the module folders through the `webpackify` key in your `package.json`:

``` json
{
  "name": "mypackage",
  "webpackify": {
    "resolve": {
      "modulesDirectories": ["node_modules", "bower_components", "src/vendor"]
    }
  }
}
```

and now calls to `require('a-module')` will first search `node_modules/a-module`, then `bower_components/a-module` and finally `src/vendor/a-module` before giving up.

### Load miscellaneous resources as modules

Install the [url-loader](https://github.com/webpack/url-loader) with: `npm install url-loader --save-dev`

Configure the loader to run on certain files in your `package.json`:

``` json
{
  "name": "mypackage",
  "webpackify": {
    "module": {
      "loaders": [
        { "test": "\.(png|svg|woff|eot|ttf|otf)$", "loader": "url?limit=100000" }
      ]
    }
  }
}
```

Now any file you load that ends with one of the above file extensions will be inlined if under 100k and loaded async if above 100k.

## Usage

* `npm install browserify webpackify --save-dev`
* `./node_modules/.bin/browserify entry.js -o out/bundle.js -p [ webpackify ]`

### Configure through the CLI

``` shell
./node_modules/.bin/browserify entry.js -o out/bundle.js -p [ webpackify --cache --context ./anotherbase ]
```

### Configure through `package.json`

``` json
{
  "name": "mypackage",
  "description": "This is my package",
  "version": "0.1.0",
  "devDependencies": {
    "browserify": "^3.38.0",
    "webpackify": "^0.1.0"
  },
  "webpackify": {
    "entry": "./index.js",
    "output": {
      "path": "./out/",
      "filename": "[hash].js",
      "publicPath": "../tmp/"
    }
  }
}
```

### Configure through `webpack.config.js`

**package.json:**

``` json
{
  "name": "mypackage",
  "description": "This is my package",
  "version": "0.1.0",
  "devDependencies": {
    "browserify": "^3.38.0",
    "webpackify": "^0.1.0",
    "webpack": "^1.1.3"
  },
  "webpackify": "webpack.config.js"
}
```

**webpack.config.js:**

``` js
var DefinePlugin = require('webpack').DefinePlugin
var IgnorePlugin = require('webpack').IgnorePlugin
module.exports = {
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(png|svg|woff|eot|ttf|otf)$/, loader: 'url?limit=100000' }
    ],
  },
  plugins: [{
    new DefinePlugin({
      A_GLOBAL_VARIABLE: true
    }),
    new IgnorePlugin(/\.(html|txt|DS_Store)$/),
  ],
}
```

## Install

With [npm](http://npmjs.org) do:

```
npm install webpackify
```

## release history

* 0.1.1 - readme and test updates
* 0.1.0 - initial release

## license
Copyright (c) 2014 Kyle Robinson Young  
Licensed under the MIT license.
