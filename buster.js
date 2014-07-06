var config = module.exports;

config["h5o-js-tests"] = {
	rootPath: ".",
	environment: "browser",
	src: [
		"dist/outliner.min.js"
	],
	tests: [
		"test/tests.js"
	],
	resources: [
		"test/*.html"
	],
	extensions: [
		require("buster-reporter-sauce")
	]
};
