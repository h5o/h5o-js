global.buster = require("buster");
var createTests = require("./tests");
var HTML5Outline = require("../dist/outliner.min");
var path = require("path");
var contextPath = "file://" + path.resolve(__dirname + "/..");

require("jsdom").env(
	"<div></div>",
	{features: {FetchExternalResources: ["iframe"]}},
	function (e, w) {
		createTests("jsdom", w.document, contextPath, HTML5Outline);
	});
