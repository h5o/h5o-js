function createTests(suffix, doc, contextPath, HTML5Outline) {

	var expect = buster.referee.expect,
		describe = buster.spec.describe,
		before = buster.spec.before,
		it = buster.spec.it;

	var cleanWhiteSpace = function (s) {
		return s.replace(/>\s+/g, '>').replace(/\s+</g, '<');
	};

	describe('h5o.' + suffix, function () {

		before(function () {
			this.timeout = 5000;
		});

		it("should throw when starting at non-sectioning root/content", function () {
			expect(function () {
				HTML5Outline(doc.createElement("div"));
			}).toThrow({
				//constructor: TypeError, // @todo: uncomment when https://github.com/busterjs/buster/issues/436 is fixed
				message: "Invalid argument: start element must either be sectioning root or sectioning content."
			});
		});

		var iframeTestList = [
			"spec1", "spec2", "spec3a", "spec3b", "spec4",
			"spec5", "spec6", "spec7", "spec8",

			"hidden", "navfirst", "blockquote",

			["links_simple", true], ["links_idreuse", true], ["links_idcollision", true],

			"hgroup", "hgroup-without-headings", "hgroup-with-h1",

			"issue-11", "issue-13",

			["issue-19-look-harder-for-ids", true],
			["issue-18-skip-top-level", { skipTopHeader: true }],
			["issue-18-skip-top-level-with-links", { skipTopHeader: true, createLinks: true }]
		];

		for (var i = 0; i < iframeTestList.length; i++) {
			var options = undefined,
				test = iframeTestList[i];

			if (typeof(test) !== "string") {
				options = test[1];
				test = test[0];
			}

			it(test, testOutline(test, options));
		}

		function testOutline(testID, options) {
			return function (done) {

				var inputIframe = doc.createElement("iframe"),
					outputIframe = doc.createElement("iframe"),
					outputBody,
					inputBody = outputBody = false;

				var runTest = function () {
					var expected = cleanWhiteSpace(outputBody.innerHTML);
					var actual = cleanWhiteSpace(HTML5Outline(inputBody).asHTML(options));

					expect(actual).toEqual(expected, "Comparison for: " + testID);

					inputIframe.parentNode.removeChild(inputIframe);
					outputIframe.parentNode.removeChild(outputIframe);
					done();
				};

				inputIframe.onload = function () {
					inputBody = inputIframe.contentWindow.document.body;
					if (outputBody) runTest();
				};
				inputIframe.src = (contextPath + "/test/" + testID + ".doc.html");

				outputIframe.onload = function () {
					outputBody = outputIframe.contentWindow.document.body;
					if (inputBody) runTest();
				};
				outputIframe.src = (contextPath + "/test/" + testID + ".out.html");

				doc.body.appendChild(inputIframe);
				doc.body.appendChild(outputIframe);
			}
		}
	});
}

if (typeof(window) === "undefined") {
	// jsdom tests are created on demand in tests.jsdom.js
	module.exports = createTests;
} else {
	// browser tests rely on the global and autorun
	createTests("browser", document, buster.env.contextPath || "", HTML5Outline);
}
