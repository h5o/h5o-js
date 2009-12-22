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
