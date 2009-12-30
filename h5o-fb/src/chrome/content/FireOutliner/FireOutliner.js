FBL.ns(function() { with (FBL) {

Firebug.FireOutliner = extend(Firebug.Module, 
{ 
	refresh: function() 
	{ 
		FirebugContext.getPanel("FireOutliner").showOutline()
	} 
}); 


function HTML5OutlinePanel() {}
HTML5OutlinePanel.prototype = extend(Firebug.Panel, 
{ 
    name: "FireOutliner", 
    title: "Outline", 
    searchable: false, 
    editable: false,

	showOutline: function() {
      this.panelNode.innerHTML = HTML5Outline(this.context.window.document.body).asHTML();
    }
}); 


Firebug.registerModule(Firebug.FireOutliner); 
Firebug.registerPanel(HTML5OutlinePanel); 

}});