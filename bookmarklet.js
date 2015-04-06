var HTML5Outline = require("./index");

var Iframeish = function (opts, cb) {
	// @todo: extract / publish on npm?
	if (typeof(cb) === "undefined" && typeof(opts) === "function") {
		cb = opts;
		opts = {};
	}
	var renderTo = opts.renderTo || document.body;

	var iframe = document.createElement('iframe');
	iframe.style.border = "none";

	var loaded = false;
	var onLoad = function () {
		if (loaded) {
			return;
		}

		var doc = iframe.contentDocument;
		try {
			doc.open(); // IE might fail even after `load` has fired
		} catch (e) {
			setTimeout(onLoad, 10);
			return;
		}
		loaded = true;
		// you can only document.write the doctype...
		doc.write("<!doctype html>");
		doc.close();

		cb(null, { iframe: iframe, document: doc });
	};

	iframe.addEventListener('load', onLoad);

	renderTo.appendChild(iframe);
};

var setAttribute = function (els, attr, val) {
	for (var i = 0; i < els.length; i++) els[i].setAttribute(attr, val);
};

var setStyles = function (els, stl) {
	setAttribute(els, "style", stl);
};

var IFRAME_STYLE = 'position:fixed;top:10px;right:10px;border:2px solid #000;background:rgba(255,255,255,.9);z-index:999999;width:400px;';
var BODY_STYLE = "padding:0;margin:0;font-size:12px;font-family:Verdana, sans-serif;";
var CONTAINER_STYLE = 'overflow-x:hidden;text-overflow:ellipsis;padding:15px;';
var LI_STYLE = 'list-style:decimal outside;margin-left:20px;';
var OL_STYLE = 'margin: 0;padding:0;';
var A_STYLE = 'color:#008;text-decoration:underline;';
var CLOSE_LNK_STYLE = 'float: right; margin: 0 0 5px 5px; padding: 5px; border: 1px #008 solid;color:#00f;background-color:#ccf;cursor:pointer;';

var outlineHTML = HTML5Outline(document.body).asHTML(true);

var containerDiv = document.createElement('div');
setStyles([containerDiv], CONTAINER_STYLE);
containerDiv.innerHTML = outlineHTML;

setStyles(containerDiv.getElementsByTagName('li'), LI_STYLE);
setStyles(containerDiv.getElementsByTagName('ol'), OL_STYLE);
setStyles(containerDiv.getElementsByTagName('a'), A_STYLE);
setAttribute(containerDiv.getElementsByTagName('a'), "target", "_top");

var lnk = containerDiv.insertBefore(document.createElement('button'), containerDiv.firstChild);
setStyles([lnk], CLOSE_LNK_STYLE);
lnk.innerHTML = 'Close';

Iframeish(function (err, iframeish) {
	if (err) {
		console.error(err);
		return;
	}

	setStyles([iframeish.iframe], IFRAME_STYLE);
	iframeish.document.body.appendChild(containerDiv);

	var size = containerDiv.getBoundingClientRect();
	setStyles([iframeish.document.body], BODY_STYLE);
	iframeish.iframe.style.height = (size.height > 400 ? 400 : size.height) + "px";

	lnk.addEventListener("click", function () {
		document.body.removeChild(iframeish.iframe);
		containerDiv = lnk = null;
	});
});
