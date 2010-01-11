	HTML5Outline=function(start)
	{
		linkCounter=0;
		
		// we need a document, to be able to use getElementById - @todo: figure out a better way, if there is one
		rootDocument = start.ownerDocument || window.document; // @todo: how will this work in, say, Rhino, for outlining fragments?
		
		// Let current outlinee be null. (It holds the element whose outline is being created.)
		currentOutlinee=null;
		
		// Let current section be null. (It holds a pointer to a section, so that elements in the DOM can all be associated with a section.)
		currentSection=null;
		
		// Create a stack to hold elements, which is used to handle nesting. Initialize this stack to empty.
		stack=[];

		// As you walk over the DOM in tree order, trigger the first relevant step below for each element as you enter and exit it.
		walk(start, enterNode, exitNode);

		// If the current outlinee is null, then there was no sectioning content element or sectioning root element in the DOM. There is no outline. Abort these steps.
		/*
		if (currentOutlinee != null) {
			Associate any nodes that were not associated with a section in the steps above with current outlinee as their section.

			Associate all nodes with the heading of the section with which they are associated, if any.

			If current outlinee is the body element, then the outline created for that element is the outline of the entire document.
		}
		*/
		
		return currentOutlinee != null ? currentOutlinee.outline : null;
	};
