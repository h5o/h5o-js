(function(){

	var setStyles = function(els, stl)
	{
		for (var i=0; i < els.length; i++) els[i].setAttribute('style', stl);
	}
	
	var FONT_STYLE = 'font-size:11px;font-family:Verdana, sans-serif;';
	var CONTAINER_STYLE = 'position:fixed;top:10px;right:10px;border:2px solid #000;background:rgba(255,255,255,.9);padding:15px;z-index:999;max-height:400px;overflow:auto;';
	var LI_STYLE = 'list-style:decimal outside;margin-left:20px;';
	var OL_STYLE = 'margin: 0;padding:0;';
	var A_STYLE = 'color:#008;text-decoration:underline;';
	var CLOSE_LNK_STYLE = 'float: right; margin: 0 0 5px 5px; padding: 5px; border: 1px #008 solid;color:#00f;background-color:#ccf;';
	
	var outlineHTML = HTML5Outline(document.body).asHTML(true);
	
	var containerDiv = document.createElement('div');
	setStyles([containerDiv], CONTAINER_STYLE+FONT_STYLE);
	containerDiv.innerHTML = outlineHTML;
	
	setStyles(containerDiv.getElementsByTagName('li'), LI_STYLE+FONT_STYLE);
	setStyles(containerDiv.getElementsByTagName('ol'), OL_STYLE+FONT_STYLE);
	setStyles(containerDiv.getElementsByTagName('a'), A_STYLE+FONT_STYLE);
	
	var lnk = containerDiv.insertBefore(document.createElement('a'), containerDiv.firstChild);
	setStyles([lnk], CLOSE_LNK_STYLE);
	lnk.innerHTML = 'Close';
	lnk.href='#';
	lnk.onclick=function(){ document.body.removeChild(containerDiv); containerDiv = lnk = null; };
	
	document.body.appendChild(containerDiv);
	
}());