var Section=function(startingNode)
{
	this.sections=[];
	this.startingNode = startingNode;
};
Section.prototype={
	heading: false,
		
	append: function(what)
	{
		what.container=this;
		this.sections.push(what);
	},
		
	asHTML: function(createLinks)
	{
		return _sectionHeadingText(this.heading) + _sectionListAsHTML(this.sections);
	}
};

var _sectionListAsHTML = function (sections, createLinks)
{
	var retval = '';
	
	for (var i=0; i < sections.length; i++) {
		retval+='<li>'+sections[i].asHTML(createLinks)+'</li>';
	}
	
	return (retval=='' ? retval : '<ol>'+retval+'</ol>');
}

var _sectionHeadingRank = function(section)
{
	var heading = section.heading;
	return isHeading(heading) 
				? _getHeadingElementRank(heading) 
				: 1; // is this true? TODO: find a reference...
}

var _sectionHeadingText = function(sectionHeading)
{
	if (isHeading(sectionHeading)) {
		if (_getTagName(sectionHeading)=='HGROUP') {
			sectionHeading = sectionHeading.getElementsByTagName('h'+(-_getHeadingElementRank(sectionHeading)))[0];
		}
		return sectionHeading.textContent || sectionHeading.innerText || sectionHeading.innerHTML;
	}
	return ""+sectionHeading;
}
