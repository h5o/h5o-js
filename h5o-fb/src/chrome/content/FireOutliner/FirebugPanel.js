FBL.ns(function() { with (FBL) {

Firebug.HTML5Outline = extend(Firebug.Module, 
{ 
	refresh: function() 
	{ 
		FirebugContext.getPanel("HTML5Outline").showOutline()
	} 
}); 


function HTML5OutlinePanel() {}
HTML5OutlinePanel.prototype = extend(Firebug.Panel, 
{ 
    name: "HTML5Outline", 
    title: "Outline", 
    searchable: false, 
    editable: false,

	showOutline: function() {
      this.panelNode.innerHTML = HTML5Outline(this.context.window.document.body).asHTML();
    }
}); 


Firebug.registerModule(Firebug.HTML5Outline); 
Firebug.registerPanel(HTML5OutlinePanel); 

}});