	var _createTagChecker=function(tagList)
	{
		return function(el)
		{
			if (!isElement(el)) {
				return false;
			}
			
			for (var i=0; i < tagList.length; i++) {
				if (tagList[i] == el.tagName.toUpperCase()) {
					return true;
				}
			}
			
			return false;
		}
	}
	
	var isSecRoot	= _createTagChecker(['BLOCKQUOTE', 'BODY', 'DETAILS', 'FIELDSET', 'FIGURE', 'TD']),
		isSecContent= _createTagChecker(['ARTICLE', 'ASIDE', 'NAV', 'SECTION']),
		isHeading	= _createTagChecker(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HGROUP']),
		isElement	= function(obj) { return (typeof obj != 'undefined') && (obj.nodeType == Node.ELEMENT_NODE); };
	
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
		return _implieadHeadings[el.tagName.toUpperCase()];
	}
		
	var getHeadingRank = function(el)
		{
			if (!isHeading(el)) { throw new Error("Only heading elements have ranks!"); };
			if (el.tagName.toUpperCase()=='HGROUP') {
				/* The rank of an hgroup element is the rank of the highest-ranked h1-h6 element descendant of the hgroup element, if there are any such elements, or otherwise the same as for an h1 element (the highest rank). */
				for (var i=1; i <= 6; i++) {
					if (el.getElementsByTagName('H'+i).length > 0)
						return -i;
				}
			} else {
				return -parseInt(el.tagName.substr(1));
			}
		};
		
	if (DEBUG) {
		fireunit.compare(-1, getHeadingRank(document.createElement('H1')), "Get rank for H1");
		fireunit.compare(-2, getHeadingRank(document.createElement('H2')), "Get rank for H2");
		fireunit.compare(-3, getHeadingRank(document.createElement('H3')), "Get rank for H3");
		fireunit.compare(-4, getHeadingRank(document.createElement('H4')), "Get rank for H4");
		fireunit.compare(-5, getHeadingRank(document.createElement('H5')), "Get rank for H5");
		fireunit.compare(-6, getHeadingRank(document.createElement('H6')), "Get rank for H6");
	}
