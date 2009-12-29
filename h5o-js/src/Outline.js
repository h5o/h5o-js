var Outline=function(outlinee, section)
{
	this.outlinee = outlinee;
	this.sections = [section];
	
	this.asHTML=function()
	{
		return _sectionListAsHTML(this.sections);
	};
};
