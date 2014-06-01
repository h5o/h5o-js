# HTML5 outliner #

This project originally lived on Google Code, and for the time being, 
the downloads still reside there: https://code.google.com/p/h5o/downloads/list

If you like this tool, please consider [a charitable donation](https://www.ammado.com/community/112794) to Ocean Voyages Institute (Project Kaisei).

## Original README ##

The current (Nov, 2009) HTML5 draft defines quite a precise algorithm, for producing an outline for HTML documents. h5o is an implementation of the algorithm in JavaScript.

### The goals of this project are: ###

* A bookmarklet, to produce outlines in decent browsers
* ~~A Firebug extension, to help HTML5 development~~
* A repository of HTML5 outlining test cases

### Current status ###

* [Chrome extension](https://chrome.google.com/extensions/detail/afoibpobokebhgfnknfndkgemglggomo) available
* [Bookmarklet](http://code.google.com/p/h5o/downloads/list) available (Tested in FF3.5 ~~and O10.10~~ - should also work elsewhere)
  - ~~Limited [version for IE](http://h5o.googlecode.com/files/bookmarklet.for.ie.html) also available. See: [ProblemsWithInternetExplorer]~~
* ~~Firebug extension is in a very [early experimental state](http://code.google.com/p/h5o/downloads/list)~~
* [Minified JS](http://code.google.com/p/h5o/downloads/list) that you can use.
  - `HTML5Outline(startFrom)` (you likely want startFrom to be document.body). Returned value is an outline object, with sections.
  - `outline.asHTML(createLinks)` to get a simple ordered list. If createLinks is true, the DOM will be amended with IDs and the list will contain links for navigation

## Real current status ##

Kind of trying to revive this, clean up and create myself some space for experimentation.

It's probably horribly broken and nothing will work, while it's in transition.

Chrome Extension is now split out into a separate repo: https://github.com/h5o/h5o-chrome
