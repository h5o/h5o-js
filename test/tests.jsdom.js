buster = require("buster");

require("jsdom")
	.env("<div></div>", {
		features: {
			FetchExternalResources: ["iframe"]
		}
	}, function (e, w) {

		jsdomDocument = w.document;
		contextPath = require("path").resolve(__dirname + "/..");

		require("../dist/outliner.min");
		require("./tests");

	});
