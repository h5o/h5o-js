# HTML5 outliner #
[![Build Status](https://travis-ci.org/h5o/h5o-js.svg?branch=master)](https://travis-ci.org/h5o/h5o-js)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/h5o-js.svg)](https://saucelabs.com/u/h5o-js)

h5o is an implementation of the HTML5 outline algorithm in JavaScript. Specifications:

* [W3C Recommendation 28 October 2014](http://www.w3.org/TR/html5/sections.html#outline)
* [WHATWG Living Standard](https://html.spec.whatwg.org/multipage/semantics.html#outlines)

If you like this tool, please consider [a charitable donation](https://www.ammado.com/community/112794) to Ocean Voyages Institute (Project Kaisei).

## Usage ##

`npm install h5o` (as of 2015, you should not be using any other way of managing your JS dependencies, but
you can still [download latest release](https://github.com/h5o/h5o-js/releases/latest))

* Use the UMD module available in `dist/outliner.min.js` with a fallback to global `HTML5Outline` or
  `var HTML5Outline = require('h5o')` in node or browserify
* `var outline = HTML5Outline(startFrom)` (you likely want `startFrom` to be `document.body`). Returned value is an outline object, with sections.
* `outline.asHTML( [ options | createLinks ])` to get HTML with an ordered list.
    - If `options.createLinks` (or `createLinks`) is `true`, the DOM will be amended with IDs and the list will contain links for navigation.
    - If `options.skipToHeader` is true, the outline HTML will only include the sub-sections of the first section in
      the outline (which is usually the `body`), i.e. it will only contain the sections of the documents, skipping
      the title of the whole document.

Visit https://h5o.github.io/ for the Chrome extension and bookmarklet.

## Development ##

### Pre-requisites ###

1. install [`node`](http://nodejs.org/)
2. `npm install -g grunt-cli`
4. `npm install` in your local clone of this repo

### Run tests locally ###
Run `grunt test`
* Will launch [buster](http://busterjs.org) server and capture the system default browser with it
* Will run tests in node using [`jsdom`](https://www.npmjs.com/package/jsdom)
* Will run tests in [PhantomJS](https://www.npmjs.com/package/phantomjs)

Run `grunt watch`
* Will watch for file changes and rebuild/run tests automatically

## History ##

### vNext (????-??-??) ###
* ???

### v0.11.3 (2015-08-05) ###
* Fix for [h5o/h5o-chrome #10](https://github.com/h5o/h5o-chrome/issues/10) / [#18](https://github.com/h5o/h5o-js/issues/32)

### v0.11.0 (2015-04-10) ###
* Split off bookmarklet into a separate repo: https://github.com/h5o/h5o-bookmarklet

### v0.10.4-v0.10.6 (2015-03-29) ###
* Bookmarklet no longer part of GH releases
* Some styling for bookmarklet.html

### v0.10.1-v0.10.3 (2015-03-25) ###
* Auto-publish in npm via Travis

### v0.10.0 (2015-03-15) ###
* [Fixed #18](https://github.com/h5o/h5o-js/issues/18): Add an option to skip the top-level header when generating a ToC (thanks [@jyasskin](https://github.com/jyasskin))
* Split up `getHeadingElementRank` into `getRankingHeadingElement` and `getRank`
* `Section` no longer has `asHTML` (out of scope)

### v0.9.3 (2015-03-11) ###
* `Outline` is not a separate object of its own
* `getSectionHeadingRank` cleanup
* Travis runs tests in both - `jsdom` v4.x and v3.x via [`jsdom-compat`](https://github.com/h5o/jsdom-compat)

### v0.9.2 (2015-03-07) ###
* Throw when non-sectioning root / content element passed in for outlining
* Cleanup

### v0.9.1 (2015-03-03) ###
* More tests

### v0.9.0 (2015-03-02) ###
* Added jsdom@4.x on io.js to the test matrix
* Fixed implied headings to follow the spec - this actually means the previous implementation was
  incorrect - updated the following tests: `navfirst`, `issue-13`. Issue #13 was partly invalid.
* Added more examples from the spec

### v0.8.0 (2015-03-01) ###
* Updated to the latest specified algorithm
* Fixed #11: HTML entity escaping
* Fixed #13: problems with sectioning root elements inside the outline
* Properly handling of `hgroup` without any `h1`-`h6` inside

### v0.7.5 (2015-02-26) ###
* Renamed `grunt start-dev` in favor a simpler `grunt watch`
* Bookmarklet now goes via browserify
* Bookmarklet works in Firefox again (fixes #6)
* Fixed #9

### v0.7.4 (2015-02-25) ###
* Travis deploy (second try)

### v0.7.3 (2015-02-25) ###
* Travis deploy

### v0.7.2 (2015-02-22) ###
* Run tests on node 0.12 and io.js
* Run tests in phantom.js as well as real browsers

### v0.7.1 (2015-02-20) ###
* README updates
* ignore `.grunt` folder

### v0.7.0 (2015-02-18) ###
* Using browserify instead of concatenation
* Made tests pass with `jsdom`
* Updated browsers and dependencies

### v0.6.3 (2014-06-06) ###
* Replaced intern with buster

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

## Contributors ##

* [Dominykas Blyžė](http://www.dominykas.com/)
* [Jeffrey Yasskin](https://github.com/jyasskin)
