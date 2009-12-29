	var Outline=function(outlinee, section)
	{
		this.outlinee = outlinee;
		this.sections=[section];
	};
	Outline.prototype={
		asHTML: function()
		{
			return _sectionListAsHTML(this.sections);
		}
	};