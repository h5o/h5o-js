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