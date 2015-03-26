module.exports = function (grunt) {

	require("time-grunt")(grunt);
	require("load-grunt-tasks")(grunt);

	var VERSION = require("./package.json").version,
		BANNER = require("fs").readFileSync("src/notice.txt").toString();

	grunt.initConfig({
		"clean": {
			"all": ["dist/**"]
		},
		"uglify": {
			"bookmarklet-js": {
				"options": {
					"banner": BANNER
				},
				"src": ["dist/debug/bookmarklet.debug.js"],
				"dest": "dist/debug/bookmarklet.min.js"
			},
			"outliner-js": {
				"options": {
					"banner": BANNER
				},
				"src": ["dist/debug/outliner.debug.js"],
				"dest": "dist/outliner.min.js"
			}
		},
		"gh-pages": {
			"options": {
				base: "dist",
				add: true,
				repo: "https://" + process.env.GH_TOKEN + "@github.com/h5o/h5o.github.io.git",
				branch: "master"
			},
			"src": "bookmarklet.html"
		},
		"_watch": {
			autoBuild: {
				files: ["src/**"],
				tasks: ["default", "buster:local:test", "buster:jsdom:test"]
			},
			autoTest: {
				files: ["test/**"],
				tasks: ["buster:local:test", "buster:jsdom:test"]
			}
		},
		buster: {
			"local": {
				"test": {
					"reporter": "specification",
					"config-group": "browser"
				}
			},
			"jsdom": {
				"test": {
					"reporter": "specification",
					"config-group": "jsdom"
				}
			}
		},
		open: {
			"capture-browser": {
				path: "http://127.0.0.1:1111/capture"
			}
		},
		browserify: {
			"outliner-js": {
				"src": [
					"index.js"
				],
				"dest": "dist/debug/outliner.debug.js",
				"options": {
					"banner": BANNER,
					"browserifyOptions": {
						"standalone": "HTML5Outline"
					}
				}
			},
			"bookmarklet-js": {
				"src": [
					"bookmarklet.js"
				],
				"dest": "dist/debug/bookmarklet.debug.js",
				"options": {
					"banner": BANNER
				}
			}
		},
		"saucelabs-custom": {
			dist: {
				options: {
					testname: "HTML5 outliner",
					build: process.env.TRAVIS_JOB_ID || "",
					browsers: [
						{browserName: "internet explorer", platform: "Windows 8.1", version: "11"},
						{browserName: "internet explorer", platform: "Windows 7", version: "11"},
						{browserName: "internet explorer", platform: "Windows 7", version: "10"},
						{browserName: "internet explorer", platform: "Windows 7", version: "9"},
						{browserName: "firefox", platform: "Windows 8.1"},
						{browserName: "firefox", platform: "Windows 7"},
						{browserName: "firefox", platform: "OS X 10.10"},
						{browserName: "firefox", platform: "Linux"},
						{browserName: "chrome", platform: "Windows 8.1"},
						{browserName: "chrome", platform: "Windows 7"},
						{browserName: "chrome", platform: "OS X 10.10"},
						{browserName: "chrome", platform: "Linux"},
						{browserName: "safari", platform: "OS X 10.10"}
					],
					urls: [
						"http://127.0.0.1:8000/?reporter=sauce"
					]
				}
			}
		}
	});

	grunt.renameTask("watch", "_watch");

	grunt.registerTask("default", "Clean build and minify", ["clean:all", "browserify", "uglify", "_bookmarklet-release"]);
	grunt.registerTask("test", "Clean build, minify and run tests",
		process.env.SAUCE_LABS === "true" ?
			["default", "test-jsdom", "test-phantom", "test-sauce"] :
			["default", "test-jsdom", process.env.TRAVIS === "true" ? "test-phantom" : "test-local"]
	);
	grunt.registerTask("test-sauce", ["buster-static", "saucelabs-custom"]);
	grunt.registerTask("test-phantom", ["buster:local:server", "buster:local:phantomjs", "buster:local:test"]);
	grunt.registerTask("test-local", ["buster:local:server", "buster:local:phantomjs", "open:capture-browser", "buster:local:test"]);
	grunt.registerTask("test-jsdom", ["buster:jsdom:test"]);
	grunt.registerTask("watch", ["buster:local:server", "buster:local:phantomjs", "open:capture-browser", "_watch"]);

	grunt.registerTask("release", function () {
		var bump = grunt.option("bump");
		if (bump != "patch" && bump != "minor" && bump != "major") grunt.fail.fatal("Please pass --bump");
		grunt.task.run(["checkbranch:master", "checkpending", "bump:" + bump]);
	});

	grunt.registerTask("_bookmarklet-release", "Prepare bookmarklet HTML for release", function () {
		var done = this.async();
		var fs = require("fs"),
			ejs = require("ejs");

		ejs.renderFile("bookmarklet.html.ejs", {

			version: VERSION,
			banner: BANNER,
			bookmarklet: encodeURIComponent(fs.readFileSync("dist/debug/bookmarklet.debug.js").toString())

		}, function (err, bookmarklet) {
			if (err) grunt.fail.fatal(err);
			fs.writeFile("dist/bookmarklet.html", bookmarklet, done);
		});

	});

	grunt.registerTask("buster-static", function () {
		// @todo: move buster-static task to grunt-buster package
		var done = this.async();

		var resolveBin = require("resolve-bin"),
			cp = require("child_process");

		resolveBin("buster", {executable: "buster-static"}, function (e, busterStaticBinPath) {
			if (e) {
				grunt.fail.fatal(e);
				return;
			}
			grunt.log.writeln("Spawning " + busterStaticBinPath + " --port 8000");
			var busterStaticProcess = cp.spawn(process.execPath, [busterStaticBinPath, "--port", "8000"], {
				env: process.env,
				setsid: true
			});
			busterStaticProcess.stdout.once("data", function () {
				done();
			});
			busterStaticProcess.stderr.on("data", function (data) {
				grunt.fail.fatal(data);
			});
			process.on("exit", function () {
				busterStaticProcess.kill();
			})
		})
	});

};
