/**
 * This code contains an implementation of HTML5 outlining algorithm, as described by WHATWG at [1]
 *
 * The copyright notice at [2] says:
 *		(c) Copyright 2004-2009 Apple Computer, Inc., Mozilla Foundation, and Opera Software ASA.
 *		You are granted a license to use, reproduce and create derivative works of this document.
 *
 * However, I am not as of this moment sure, what will happen with licensing when the work is 
 * published by W3C. The current W3C draft [3] (retrieved on Nov 9, 2009) of HTML5 does not include 
 * the outlining algorithm. I suppose it will be covered by W3C Documenation or W3C Software 
 * license. They are in theory compatible with MIT license. Please don't sue me.
 *
 * [1] http://www.whatwg.org/specs/web-apps/current-work/multipage/sections.html#outlines
 * [2] http://www.whatwg.org/specs/web-apps/current-work/multipage/index.html
 * [3] http://dev.w3.org/html5/spec/Overview.html#outlines
 */
(function(){
	var DEBUG = (typeof fireunit != 'undefined');
	var Section=function()
	{
		this.sections=[];
	};
	Section.prototype={
		heading: false,
			
		lastChild: function()
		{
			return this.sections[this.sections.length-1];
		},
		
		headingRank: function() {
			if (isHeading(this.heading)) {
				return getHeadingRank(this.heading);
			}
			return 1; /* @todo: check if this is true!!! */
		},
		
		append: function(what)
		{
			what.container=this;
			this.sections.push(what);
		},
			
		getHeadingText: function()
		{
			if (isHeading(this.heading)) {
				if (this.heading.tagName.toUpperCase()=='HGROUP') {
					var rank = this.headingRank();
					var headingEl = this.heading.getElementsByTagName('h'+(-rank))[0];
					return headingEl.innerHTML;
				} else {
					return this.heading.innerHTML; // @todo: fix up properly!
				}
			}
			return this.heading;
		},
			
		asHTML: function()
		{
			var html=this.getHeadingText();
			if (this.sections.length > 0) {
				html+='<ol>';
				for (var i=0; i < this.sections.length; i++) {
					html+='<li>'+this.sections[i].asHTML()+'</li>';
				}
				html+='</ol>';
			}
			return html;
		}
	};

	var Outline=function(outlinee, section)
	{
		this.outlinee = outlinee;
		this.sections=[section];
	};
	Outline.prototype={
		lastSection: function()
		{
			return this.sections[this.sections.length-1];
		},
			
		asHTML: function()
		{
			var html='<ol>';
			for (var i=0; i < this.sections.length; i++) {
				html+='<li>'+this.sections[i].asHTML()+'</li>';
			}
			html+='</ol>';
			return html;
		}
	};
	
	var currentOutlinee, currentSection, stack;
	
	var walk=function (root, enter, exit) {
		var node = root;
		start: while (node) {
			enter(node);
			if (node.firstChild) {
				node = node.firstChild;
				continue start;
			}
			while (node) {
				exit(node);
				if (node.nextSibling) {
					node = node.nextSibling;
					continue start;
				}
				if (node == root)
					node = null;
				else
					node = node.parentNode;
			}
		}
	}
	
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
		return _implieadHeadings[el.tagName];
	}
		
	var getHeadingRank = function(el)
		{
			if (!isHeading(el)) { throw new Error("Only heading elements have ranks!"); };
			if (el.tagName.toUpperCase()=='HGROUP') {
				/* The rank of an hgroup element is the rank of the highest-ranked h1–h6 element descendant of the hgroup element, if there are any such elements, or otherwise the same as for an h1 element (the highest rank). */
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
		
	var enterNode=function(node)
	{
		if (isHeading(stack[stack.length-1])) {
			_log("Entering: If the top of the stack is a heading content element - do nothing", node);
			return;
		}

		// When entering a sectioning content element or a sectioning root element
		if (isSecContent(node) || isSecRoot(node)) {
			// If current outlinee is not null, and the current section has no heading,
			// create an implied heading and let that be the heading for the current section.
			if (currentOutlinee!=null && !currentSection.heading) {
				currentSection.heading = impliedHeading(currentOutlinee);
			}
			
			// If current outlinee is not null, push current outlinee onto the stack.
			if (currentOutlinee!=null) {
				stack.push(currentOutlinee);
			}
			
			// Let current outlinee be the element that is being entered.
			currentOutlinee = node;

			// Let current section be a newly created section for the current outlinee element.
			currentSection = new Section();

			// Let there be a new outline for the new current outlinee, initialized with just the new current section as the only section in the outline.
			currentOutlinee.outline = new Outline(currentOutlinee, currentSection);
			return;
		}
		
		if (currentOutlinee==null) {
			_log("If the current outlinee is null, do nothing");
			return;
		}
		
		// When entering a heading content element
		if (isHeading(node)) {
			
			// If the current section has no heading, let the element being entered be the heading for the current section.
			if (!currentSection.heading) {
				currentSection.heading = node;
			
			// Otherwise, if the element being entered has a rank equal to or greater than the heading of the last section of the outline of the current outlinee, 
			} else if (getHeadingRank(node) >= currentOutlinee.outline.lastSection().headingRank()) {
				
				// create a new section and 
				var newSection=new Section();
				// append it to the outline of the current outlinee element, so that this new section is the new last section of that outline. 
				currentOutlinee.outline.sections.push(newSection);
				
				// Let current section be that new section. 
				currentSection = newSection;
				
				// Let the element being entered be the new heading for the current section.
				currentSection.heading = node;
				
			// Otherwise, run these substeps:
			} else {
				var abortSubsteps = false;
				
				// 1. Let candidate section be current section.
				var candidateSection = currentSection;

				do {
					// 2. If the element being entered has a rank lower than the rank of the heading of the candidate section, 
					if (getHeadingRank(node) < candidateSection.headingRank()) {
						
						// create a new section,
						var newSection = new Section();

						// and append it to candidate section. (This does not change which section is the last section in the outline.)
						candidateSection.append(newSection);
						
						// Let current section be this new section.
						currentSection = newSection;
						
						// Let the element being entered be the new heading for the current section.
						currentSection.heading = node;
						
						// Abort these substeps.
						abortSubsteps = true;
					}
					
					// 3. Let new candidate section be the section that contains candidate section in the outline of current outlinee.
					var newCandidateSection = candidateSection.container;
					
					// 4. Let candidate section be new candidate section.
					candidateSection = newCandidateSection;
					
					// 5. Return to step 2.
				} while (!abortSubsteps);
			}
			
			// Push the element being entered onto the stack. (This causes the algorithm to skip any descendants of the element.)
			stack.push(node);
			return;
		}

		_log("Do nothing (entering):", node);
	}
	
	var exitNode=function(node)
	{
		// If the top of the stack is a heading element, and you are exiting that element
		if (isHeading(stack[stack.length-1]) && stack[stack.length-1]==node) {
			stack.pop();
			return;
		}
		
		if (isHeading(stack[stack.length-1])) {
			_log("Exiting: If the top of the stack is a heading content element - do nothing", node);
			return;
		}
		
		/************ MODIFICATION OF ORIGINAL ALGORITHM *****************/
		// existing sectioning content or sectioning root
		// this means, currentSection will change (and we won't get back to it)
		if (isSecContent(node) || isSecRoot(node)) {
			
			// set an implied heading, if none was set
			if (!currentSection.heading) {
				currentSection.heading = impliedHeading(node);
			}
			
		}
		/************ END MODIFICATION ***********************************/

		// When exiting a sectioning content element, if the stack is not empty
		if (isSecContent(node) && stack.length > 0) {
			
			// Pop the top element from the stack, and let the current outlinee be that element.
			currentOutlinee = stack.pop();
			
			// Let current section be the last section in the outline of the current outlinee element.
			currentSection = currentOutlinee.outline.lastSection();
			
			// Append the outline of the sectioning content element being exited to the current section. (This does not change which section is the last section in the outline.)
			for (var i = 0; i < node.outline.sections.length; i++) {
				currentSection.append(node.outline.sections[i]);
			}
			return;
		}

		// When exiting a sectioning root element, if the stack is not empty
		if (isSecRoot(node) && stack.length > 0) {
			// Pop the top element from the stack, and let the current outlinee be that element.
			currentOutlinee = stack.pop();
			
			// Let current section be the last section in the outline of the current outlinee element.
			currentSection = currentOutlinee.outline.lastSection();

			// Finding the deepest child: If current section has no child sections, stop these steps.
			while (currentSection.sections.length > 0) {
				
				// Let current section be the last child section of the current current section.
				currentSection = currentSection.lastChild();
				
				// Go back to the substep labeled finding the deepest child.
			}
			return;
		}

		// When exiting a sectioning content element or a sectioning root element
		if (isSecContent(node) || isSecRoot(node)) {
			// Let current section be the first section in the outline of the current outlinee element.
			currentSection = currentOutlinee.outline.sections[0];
			 
			// Skip to the next step in the overall set of steps. (The walk is over.)
			return;
		}
		
		if (currentOutlinee==null) {
			_log("If the current outlinee is null, do nothing");
			return;
		}

		_log("Do nothing (exiting):", node);
	}
	
	HTML5Outline=function(start)
	{
		if (!isSecRoot(start) && !isSecContent(start)) {
			throw new Error("Must start with either sectioning content or sectioning root element");
		}

		// Let current outlinee be null. (It holds the element whose outline is being created.)
		currentOutlinee=null;
		
		// Let current section be null. (It holds a pointer to a section, so that elements in the DOM can all be associated with a section.)
		currentSection=new Section();
		
		// Create a stack to hold elements, which is used to handle nesting. Initialize this stack to empty.
		stack=[];

		// As you walk over the DOM in tree order, trigger the first relevant step below for each element as you enter and exit it.
		walk(start, enterNode, exitNode);
		
/*
If the current outlinee is null, then there was no sectioning content element or sectioning root element in the DOM. There is no outline. Abort these steps.

Associate any nodes that were not associated with a section in the steps above with current outlinee as their section.

Associate all nodes with the heading of the section with which they are associated, if any.

If current outlinee is the body element, then the outline created for that element is the outline of the entire document.
*/
		
		return currentOutlinee.outline.asHTML();
		
	};
	
	var _log=function()
	{
		if (typeof console != 'undefined' && console.log) {
			console.log.apply(console, arguments);
		} else if (typeof opera != 'undefined') {
			opera.postError.apply(arguments);
		}
	}
	
	if (DEBUG)
	{
		fireunit.testDone();
	}
	
})();