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
		
	getHeadingText: function()
	{
		var headingEl = this.heading;
		if (isHeading(headingEl)) {
			if (_getTagName(headingEl)=='HGROUP') {
				headingEl = headingEl.getElementsByTagName('h'+(-_sectionHeadingRank(this)))[0];
			}
			return headingEl.textContent || headingEl.innerHTML;
		}
		return headingEl;
	},
	
	asHTML: function()
	{
		return this.getHeadingText() + _sectionListAsHTML(this.sections);
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
	return isHeading(section.heading) ? getHeadingElementRank(section.heading) : 1;
}
