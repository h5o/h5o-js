FBL.ns(function() { with (FBL) {

Firebug.FireOutliner = extend(Firebug.Module, 
{ 
	refresh: function() 
	{ 
		FirebugContext.getPanel("FireOutliner").showOutline()
	} 
}); 


function FireOutlinerPanel() {}
FireOutlinerPanel.prototype = extend(Firebug.Panel, 
{ 
    name: "FireOutliner", 
    title: "Outline", 
    searchable: false, 
    editable: false,
	
	show: function(state)
	{
		this.showToolbarButtons("fbH5OButtons", true);
	},
		
	hide: function()
	{
		this.showToolbarButtons("fbH5OButtons", false);
	},

	showOutline: function() {
      this.panelNode.innerHTML = HTML5Outline(this.context.window.document.body).asHTML();
    }
}); 


Firebug.registerModule(Firebug.FireOutliner); 
Firebug.registerPanel(FireOutlinerPanel); 

}});