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
