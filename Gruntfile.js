module.exports = function (grunt) {

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	var VERSION = require("./package.json").version;

	grunt.initConfig({
		"clean": [ "dist/**" ],
		"copy": {
			"bookmarklet-js": {
				"src": [ "src/HTML5OutlineBookmarklet.js" ],
				"dest": "dist/HTML5OutlineBookmarklet.debug.js"
			}
		},
		"concat": {
			"outliner-js": {
				"src": [
					"src/notice.txt",
					"src/_head.js",
					"src/Section.js",
					"src/Outline.js",
					"src/walk.js",
					"src/enterNode.js",
					"src/exitNode.js",
					"src/func.js",
					"src/HTML5Outline.js",
					"src/_foot.js"
				],
				"dest": "dist/outliner.debug.js"
			},
			"outliner-release": {
				"src": [
					"src/notice.txt",
					"dist/outliner.min.js"
				],
				"dest": "dist/outliner." + VERSION + ".js"
			}
		},
		"uglify": {
			"bookmarklet-js": {
				"src": [ "dist/HTML5OutlineBookmarklet.debug.js" ],
				"dest": "dist/HTML5OutlineBookmarklet.min.js"
			},
			"outliner-js": {
				"src": [ "dist/outliner.debug.js" ],
				"dest": "dist/outliner.min.js"
			}
		}
	});

	grunt.registerTask("default", "Clean build and minify", [ "clean", "concat:outliner-js", "copy:bookmarklet-js", "uglify" ]);
	grunt.registerTask("release", "Prepare files for deployment", [ "default", "concat:outliner-release", "_bookmarklet-release" ]);

	grunt.registerTask("_bookmarklet-release", "Prepare bookmarklet HTML for release", function () {
		var done = this.async();
		var fs = require("fs");

		var bookmarkletHtml = fs.readFileSync("src/bookmarklet.html").toString();

		bookmarkletHtml = bookmarkletHtml.replace(/@VERSION/g, VERSION);
		bookmarkletHtml = bookmarkletHtml.replace(/@NOTICE/g, fs.readFileSync("src/notice.txt"));
		bookmarkletHtml = bookmarkletHtml.replace(/@RUNBOOKMARKLET/g, encodeURIComponent(fs.readFileSync("dist/HTML5OutlineBookmarklet.min.js").toString()));
		bookmarkletHtml = bookmarkletHtml.replace(/@MINIFIED/g, encodeURIComponent(fs.readFileSync("dist/outliner.min.js").toString()));

		fs.writeFile("dist/outliner." + VERSION + ".html", bookmarkletHtml, done);
	});

};