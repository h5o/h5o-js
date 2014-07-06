(function () {

	var expect = buster.referee.expect,
		describe = buster.spec.describe,
		before = buster.spec.before,
		it = buster.spec.it;

	var cleanWhiteSpace = function (s) {
		return s.replace(/>\s+/g, '>').replace(/\s+</g, '<');
	};

	describe('h5o', function () {

		before(function () {
			this.timeout = 5000;
		});

		it("non-sectioning element outlining", function () {
			var actual = HTML5Outline(document.createElement('div'));

			expect(actual).toBeNull("Outline for an empty DIV should be null");
		});

		it("section inside a div - not starting with secRoot", function () {
			var div = document.createElement('div');
			div.appendChild(document.createElement('section'));

			expect(HTML5Outline(div).asHTML())
				.toEqual("<ol><li><i>Untitled SECTION</i></li></ol>",
				"Outline for a DIV is the outline of the SECTION inside");
		});

		it("two sections inside a div - not starting with secRoot", function () {
			var div = document.createElement('div');
			div.appendChild(document.createElement('section'));
			div.appendChild(document.createElement('section'));

			expect(HTML5Outline(div).asHTML())
				.toEqual("<ol><li><i>Untitled SECTION</i><ol><li><i>Untitled SECTION</i></li></ol></li></ol>",
				"Second SECTION becomes a child of the first one. Odd - TODO - verify");
		});

		it("some headings", function () {
			var div = document.createElement('div');
			var heading = document.createElement('h1');
			heading.innerHTML = "Test";
			div.appendChild(heading);
			div.appendChild(document.createElement('section'));

			expect(HTML5Outline(div).asHTML())
				.toEqual("<ol><li><i>Untitled SECTION</i></li></ol>",
				"Heading outside of sectioning root is ignored");
		});

		var iframeTestList = [
			"spec1", "spec2", "spec3a", "spec3b", "spec4", "navfirst", "hgroup",
			"links_simple", "links_idreuse", "links_idcollision"
		];

		for (var i = 0; i < iframeTestList.length; i++) {
			it(iframeTestList[i], testOutline(iframeTestList[i]));
		}

		function testOutline(testID) {
			return function (done) {

				var docIframe = document.createElement("iframe"),
					outIframe = document.createElement("iframe"),
					out,
					doc = out = false;

				var contextPath = buster.env.contextPath || "";

				var createLinks = (testID.substring(0, 6) == 'links_');


				var runTest = function () {
					var expected = cleanWhiteSpace(out.innerHTML);
					var actual = cleanWhiteSpace(HTML5Outline(doc).asHTML(createLinks));

					expect(actual).toEqual(expected, "Comparison for: " + testID);

					docIframe.parentNode.removeChild(docIframe);
					outIframe.parentNode.removeChild(outIframe);
					done();
				};

				docIframe.onload = function () {
					doc = docIframe.contentWindow.document.body;
					if (out) runTest();
				};
				docIframe.src = (contextPath + "/test/" + testID + ".doc.html");

				outIframe.onload = function () {
					out = outIframe.contentWindow.document.body;
					if (doc) runTest();
				};
				outIframe.src = (contextPath + "/test/" + testID + ".out.html");

				document.body.appendChild(docIframe);
				document.body.appendChild(outIframe);
			}
		}
	});
}());
