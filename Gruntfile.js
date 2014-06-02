module.exports = function (grunt) {

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	var VERSION = require("./package.json").version;

	grunt.initConfig({
		"clean": {
			"all": [ "dist/**" ],
			"debug": [ "dist/debug/**" ],
			"min": [ "dist/min/**" ]
		},
		"copy": {
			"bookmarklet-js": {
				"src": [ "src/HTML5OutlineBookmarklet.js" ],
				"dest": "dist/debug/HTML5OutlineBookmarklet.debug.js"
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
				"dest": "dist/debug/outliner.debug.js"
			},
			"outliner-release": {
				"src": [
					"src/notice.txt",
					"dist/min/outliner.min.js"
				],
				"dest": "dist/outliner." + VERSION + ".js"
			}
		},
		"uglify": {
			"bookmarklet-js": {
				"src": [ "dist/debug/HTML5OutlineBookmarklet.debug.js" ],
				"dest": "dist/min/HTML5OutlineBookmarklet.min.js"
			},
			"outliner-js": {
				"src": [ "dist/debug/outliner.debug.js" ],
				"dest": "dist/min/outliner.min.js"
			}
		}
	});

	grunt.registerTask("default", "Clean build and minify", [ "clean:all", "concat:outliner-js", "copy:bookmarklet-js", "uglify" ]);
	grunt.registerTask("release", "Prepare files for deployment", [ "default", "concat:outliner-release", "_bookmarklet-release", "clean:debug", "clean:min" ]);

	grunt.registerTask("_bookmarklet-release", "Prepare bookmarklet HTML for release", function () {
		var done = this.async();
		var fs = require("fs");

		var bookmarkletHtml = fs.readFileSync("src/bookmarklet.html").toString();

		bookmarkletHtml = bookmarkletHtml.replace(/@VERSION/g, VERSION);
		bookmarkletHtml = bookmarkletHtml.replace(/@NOTICE/g, fs.readFileSync("src/notice.txt"));
		bookmarkletHtml = bookmarkletHtml.replace(/@RUNBOOKMARKLET/g, encodeURIComponent(fs.readFileSync("dist/min/HTML5OutlineBookmarklet.min.js").toString()));
		bookmarkletHtml = bookmarkletHtml.replace(/@MINIFIED/g, encodeURIComponent(fs.readFileSync("dist/min/outliner.min.js").toString()));

		fs.writeFile("dist/outliner." + VERSION + ".html", bookmarkletHtml, done);
	});

};
