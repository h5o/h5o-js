(function () {

	var expect = buster.referee.expect,
		describe = buster.spec.describe,
		it = buster.spec.it;

	var cleanWhiteSpace = function (s) {
		return s.replace(/>\s+/g, '>').replace(/\s+</g, '<');
	};

	describe('h5o', function () {

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

				var createLinks = (testID.substring(0, 6) == 'links_');

				docIframe.src = (buster.env.contextPath + "/test/" + testID + ".doc.html");
				docIframe.onload = function () {
					doc = docIframe.contentWindow.document.body;
				};

				outIframe.src = (buster.env.contextPath + "/test/" + testID + ".out.html");
				outIframe.onload = function () {
					out = outIframe.contentWindow.document.body;
				};

				var runTest = function () {
					if (!doc || !out) return;
					clearInterval(waitForLoad);

					var expected = cleanWhiteSpace(out.innerHTML);
					var actual = cleanWhiteSpace(HTML5Outline(doc).asHTML(createLinks));

					expect(actual).toEqual(expected, "Comparison for: " + testID);

					setTimeout(function () {
						docIframe.parentNode.removeChild(docIframe);
						outIframe.parentNode.removeChild(outIframe);
						done();
					}, 100);
				};

				var waitForLoad = setInterval(runTest, 1);

				document.body.appendChild(docIframe);
				document.body.appendChild(outIframe);
			}
		}
	});
}());
