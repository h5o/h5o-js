global.buster = require("buster");
var createTests = require("./tests");
var HTML5Outline = require("../dist/outliner.min");
var contextPath = require("path").resolve(__dirname + "/..");

function runTestsIn(jsdomModule) {
	require(jsdomModule).env(
		"<div></div>",
		{features: {FetchExternalResources: ["iframe"]}},
		function (e, w) {
			createTests(jsdomModule, w.document, contextPath, HTML5Outline);
		});
}

runTestsIn("jsdom-compat");
(!process.version.indexOf("v0.10") && !process.version.indexOf("v0.12")) || runTestsIn("jsdom");
