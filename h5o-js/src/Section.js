var Section=function()
{
	this.sections=[];
};
Section.prototype={
	heading: false,
		
	append: function(what)
	{
		what.container=this;
		this.sections.push(what);
	},
		
	asHTML: function()
	{
		return _sectionHeadingText(this.heading) + _sectionListAsHTML(this.sections);
	}
};

var _sectionListAsHTML = function (sections)
{
	if (sections.length == 0) return '';
	
	var retval='<ol>';
	for (var i=0; i < sections.length; i++) {
		retval+='<li>'+sections[i].asHTML()+'</li>';
	}
	retval+='</ol>';
	return retval;
}

var _sectionHeadingRank = function(section)
{
	return isHeading(section.heading) ? _getHeadingElementRank(section.heading) : 1;
}

var _sectionHeadingText = function(sectionHeading)
{
	if (isHeading(sectionHeading)) {
		if (_getTagName(sectionHeading)=='HGROUP') {
			sectionHeading = sectionHeading.getElementsByTagName('h'+(-_getHeadingElementRank(sectionHeading)))[0];
		}
		return sectionHeading.textContent || sectionHeading.innerHTML;
	}
	return ""+sectionHeading;
}
