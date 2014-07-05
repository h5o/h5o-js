module.exports = function (grunt) {

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	var VERSION = require("./package.json").version,
		BANNER = require("fs").readFileSync("src/notice.txt").toString();

	grunt.initConfig({
		"clean": {
			"all": [ "dist/**" ]
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
			}
		},
		"uglify": {
			"bookmarklet-js": {
				"src": [ "dist/debug/HTML5OutlineBookmarklet.debug.js" ],
				"dest": "dist/debug/HTML5OutlineBookmarklet.min.js"
			},
			"outliner-js": {
				"options": {
					"banner": BANNER
				},
				"src": [ "dist/debug/outliner.debug.js" ],
				"dest": "dist/outliner.min.js"
			}
		},
		"intern": {
			"dist": {
				"options": {
					"runType": 'runner',
					"config": 'test/intern.config',
					"reporters": [ 'console' ],
					"suites": [ 'test/tests' ]
				}
			}
		},
		"gh-pages": {
			"dist": {
				"options": { "base": "dist" },
				"src": [
					"outliner.min.js",
					"outliner.html"
				]
			}
		}
	});

	grunt.loadNpmTasks("intern");
	grunt.renameTask("release", "_release");

	grunt.registerTask("default", "Clean build and minify", [ "clean:all", "concat:outliner-js", "copy:bookmarklet-js", "uglify", "_bookmarklet-release" ]);
	grunt.registerTask("test", "Clean build, minify and run tests", [ "default", "intern" ]);

	grunt.registerTask("release", function () {
		var bump = grunt.option("bump");
		if (bump != "patch" && bump != "minor" && bump != "major") grunt.fail.fatal("Please pass --bump");
		grunt.task.run(["_release:" + bump, "gh-pages"]);
	});

	grunt.registerTask("_bookmarklet-release", "Prepare bookmarklet HTML for release", function () {
		var done = this.async();
		var fs = require("fs"),
			ejs = require("ejs");

		ejs.renderFile("src/bookmarklet.html.ejs", {

			version: VERSION,
			banner: BANNER,
			bookmarklet: encodeURIComponent(fs.readFileSync("dist/debug/HTML5OutlineBookmarklet.min.js").toString()),
			outliner: encodeURIComponent(fs.readFileSync("dist/outliner.min.js").toString())

		}, function (err, bookmarklet) {
			if (err) grunt.fail.fatal(err);
			fs.writeFile("dist/outliner.html", bookmarklet, done);
		});

	});

};
