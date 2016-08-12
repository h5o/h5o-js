var config = module.exports;

config["browser"] = {
	rootPath: ".",
	environment: "browser",
	src: [
		"dist/outliner.min.js"
	],
	tests: [
		"test/tests.js"
	],
	resources: [
		"test/*.html",
		"test/images/kitten.jpg"
	],
	extensions: [
		require("buster-reporter-sauce")
	]
};

config["jsdom"] = {
	rootPath: ".",
	environment: "node",
	tests: [
		"test/tests.jsdom.js"
	]
};
