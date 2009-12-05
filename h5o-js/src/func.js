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
		isElement	= function(obj) { return obj && obj.tagName; };
	
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
