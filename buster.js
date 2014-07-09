var config = module.exports;

config["h5o-browser"] = {
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

config["h5o-jsdom"] = {
	rootPath: ".",
	environment: "node",
	tests: [
		"test/tests.jsdom.js"
	]
};
