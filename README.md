# HTML5 outliner #

This project originally lived on Google Code, and for the time being, 
the downloads still reside there: https://code.google.com/p/h5o/downloads/list

If you like this tool, please consider [a charitable donation](https://www.ammado.com/community/112794) to Ocean Voyages Institute (Project Kaisei).

## Real current status ##

Kind of trying to revive this, clean up and create myself some space for experimentation.

* [List of cleanup tasks](https://github.com/h5o/h5o-js/issues?labels=cleanup&page=1&state=open)

Chrome Extension is now split out into a separate repo: https://github.com/h5o/h5o-chrome

[![Build Status](https://travis-ci.org/h5o/h5o-js.svg?branch=master)](https://travis-ci.org/h5o/h5o-js)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/h5o-js.svg)](https://saucelabs.com/u/h5o-js)

### Running tests locally ###
* start phantomjs webdriver server: `phantomjs --webdriver=4444`
* `grunt test`

## Original README ##

> The current (Nov, 2009) HTML5 draft defines quite a precise algorithm, for producing an outline for HTML documents. h5o is an implementation of the algorithm in JavaScript.

> ### The goals of this project are: ###

> * A bookmarklet, to produce outlines in decent browsers
> * ~~A Firebug extension, to help HTML5 development~~
> * A repository of HTML5 outlining test cases

> ### Downloads ###

> [Chrome extension](https://chrome.google.com/extensions/detail/afoibpobokebhgfnknfndkgemglggomo) available
> ~~[Bookmarklet](http://code.google.com/p/h5o/downloads/list) available (Tested in FF3.5 and O10.10 - should also work elsewhere)~~
>  - ~~Limited [version for IE](http://h5o.googlecode.com/files/bookmarklet.for.ie.html) also available. See: [ProblemsWithInternetExplorer]~~
> ~~Firebug extension is in a very [early experimental state](http://code.google.com/p/h5o/downloads/list)~~
> ~~[Minified JS](http://code.google.com/p/h5o/downloads/list) that you can use.~~ `npm install h5o`, use `dist/outliner.min.js`
> - `HTML5Outline(startFrom)` (you likely want startFrom to be document.body). Returned value is an outline object, with sections.
> - `outline.asHTML(createLinks)` to get a simple ordered list. If createLinks is true, the DOM will be amended with IDs and the list will contain links for navigation
