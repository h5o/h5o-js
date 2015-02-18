buster = require("buster");

require("jsdom")
	.env("<div></div>", {
		features: {
			FetchExternalResources: ["iframe"]
		}
	}, function (e, w) {

		jsdomDocument = w.document;
		contextPath = require("path").resolve(__dirname + "/..");

		// @todo: tests still rely on a global being present
		global.HTML5Outline = require("../dist/outliner.min");
		require("./tests");

	});
