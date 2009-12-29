	// minifiers will love this more than using el.tagName.toUpperCase() directly
	var _getTagName = function(el)
	{
		return el.tagName.toUpperCase(); // upper casing due to http://ejohn.org/blog/nodename-case-sensitivity/
	}

	var _createTagChecker=function(regexString)
	{
		return function(el)
		{
			return isElement(el) && (new RegExp(regexString, "i")).test(_getTagName(el));
		}
	}
	
	var isSecRoot	= _createTagChecker('^BLOCKQUOTE|BODY|DETAILS|FIELDSET|FIGURE|TD$'),
		isSecContent= _createTagChecker('^ARTICLE|ASIDE|NAV|SECTION$'),
		isHeading	= _createTagChecker('^H[1-6]|HGROUP$'),
		isElement	= function(obj) { return obj && obj.tagName; };
	
	/*
	var _implieadHeadings={
		BLOCKQUOTE: 'Untitled quote', 
		BODY: 'Untitled document', 
		DETAILS: 'Untitled details', 
		FIELDSET: 'Untitled fieldset', 
		FIGURE: 'Untitled figure', 
		TD: 'Untitled cell',
		
		ARTICLE: 'Untitled article', 
		ASIDE: 'Untitled sidebar', 
		NAV: 'Untitled navigation', 
		SECTION: 'Untitled section'
	}
	var impliedHeading=function(el)
	{
		return _implieadHeadings[_getTagName(el)];
	}
	*/
		
	var _getHeadingElementRank = function(el)
	{
		var elTagName = _getTagName(el);
		if (elTagName=='HGROUP') {
			/* The rank of an hgroup element is the rank of the highest-ranked h1-h6 element descendant of the hgroup element, if there are any such elements, or otherwise the same as for an h1 element (the highest rank). */
			for (var i=1; i <= 6; i++) {
				if (el.getElementsByTagName('H'+i).length > 0)
					return -i;
			}
		} else {
			return -parseInt(elTagName.substr(1));
		}
	};
	
	var _lastSection = function (outlineOrSection)
	{
		return _arrayLast(outlineOrSection.sections);
	}

	var _arrayLast = function (arr)
	{
		return arr[arr.length-1];
	}
	