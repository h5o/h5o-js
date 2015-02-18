# HTML5 outliner #
[![Build Status](https://travis-ci.org/h5o/h5o-js.svg?branch=master)](https://travis-ci.org/h5o/h5o-js)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/h5o-js.svg)](https://saucelabs.com/u/h5o-js)

h5o is an implementation of the HTML5 outline algorithm in JavaScript. Specifications:

* [W3C Recommendation 28 October 2014](http://www.w3.org/TR/html5/sections.html#outline)
* [WHATWG Living Standard](https://html.spec.whatwg.org/multipage/semantics.html#outlines)

If you like this tool, please consider [a charitable donation](https://www.ammado.com/community/112794) to Ocean Voyages Institute (Project Kaisei).

## Usage ##

* [Chrome extension](https://chrome.google.com/extensions/detail/afoibpobokebhgfnknfndkgemglggomo) available
    - Source: https://github.com/h5o/h5o-chrome
* [Bookmarklet](http://h5o.github.io/h5o-js/outliner.html)
* Use the UMD module available in `dist/outliner.min.js` with a fallback to global `HTML5Outline` or 
  `var HTML5Outline = require('h5o')` in your favorite CommonJS workflow (node/browserify/etc)
  - `HTML5Outline(startFrom)` (you likely want startFrom to be document.body). Returned value is an outline object, with sections.
  - `outline.asHTML(createLinks)` to get HTML with an ordered list. If `createLinks` is `true`, the DOM will be amended with IDs and the list will contain links for navigation

## Development ##

### Pre-requisites ###
 
1. install [`node`](http://nodejs.org/) or [`iojs`](https://iojs.org/) (includes `npm`)
2. `npm install -g grunt-cli`
4. `npm install` in your local clone of this repo

### Run tests locally ###
Run `grunt test`
* Will launch [buster](http://busterjs.org) server and capture a browser with it
* Will run tests in node using [`jsdom`](https://www.npmjs.com/package/jsdom)
* @todo: automatically run tests in phantom: https://github.com/h5o/h5o-js/issues/26

### Release ###
Run `grunt release --bump=[patch|minor|major]`
* Will bump version
* Will tag the release
* Will `npm publish`
* Will push out an update `gh-pages`


## History ##

### v0.7.0 (2015-02-18) ###
* Using browserify instead of concatenation
* Making tests pass with jsdom
* Updating browsers and dependencies

### v0.6.3 (2014-06-06) ###
* Replacing inter with buster

### v0.6.2 (2014-06-05) ###
* Using ejs to generate bookmarklet HTML
* Using gh-pages to publish the bookmarklet

### v0.6.0 (2014-06-04) ###
* Using intern
* Using SauceLabs
* Using travis

### v0.5.4 (2014-06-02) ###
* Rewritten build scripts with [`grunt`](http://gruntjs.com)
* Split away Chrome extension, removed Opera/Firefox extension code

### v0.5.2 (2014-06-01) ###
* First version published in npm

### v0.5.1 and earlier ###
Originally [lived on Google Code](https://code.google.com/p/h5o), if you like archeology 
