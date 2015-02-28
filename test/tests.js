(function () {

	var doc = this.document || this.jsdomDocument;

	var contextPath = this.contextPath || buster.env.contextPath || "";

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
			var actual = HTML5Outline(doc.createElement('div'));

			expect(actual).toBeNull("Outline for an empty DIV should be null");
		});

		it("section inside a div - not starting with secRoot", function () {
			var div = doc.createElement('div');
			div.appendChild(doc.createElement('section'));

			expect(HTML5Outline(div).asHTML())
				.toEqual("<ol><li><i>Untitled SECTION</i></li></ol>",
				"Outline for a DIV is the outline of the SECTION inside");
		});

		it("two sections inside a div - not starting with secRoot", function () {
			var div = doc.createElement('div');
			div.appendChild(doc.createElement('section'));
			div.appendChild(doc.createElement('section'));

			expect(HTML5Outline(div).asHTML())
				.toEqual("<ol><li><i>Untitled SECTION</i><ol><li><i>Untitled SECTION</i></li></ol></li></ol>",
				"Second SECTION becomes a child of the first one. Odd - TODO - verify");
		});

		it("some headings", function () {
			var div = doc.createElement('div');
			var heading = doc.createElement('h1');
			heading.innerHTML = "Test";
			div.appendChild(heading);
			div.appendChild(doc.createElement('section'));

			expect(HTML5Outline(div).asHTML())
				.toEqual("<ol><li><i>Untitled SECTION</i></li></ol>",
				"Heading outside of sectioning root is ignored");
		});

		var iframeTestList = [
			"spec1", "spec2", "spec3a", "spec3b", "spec4", "navfirst",
			"links_simple", "links_idreuse", "links_idcollision",
			"hgroup", "hgroup-without-headings", "hgroup-with-h1",
			"issue-11"
		];

		for (var i = 0; i < iframeTestList.length; i++) {
			it(iframeTestList[i], testOutline(iframeTestList[i]));
		}

		function testOutline(testID) {
			return function (done) {

				var inputIframe = doc.createElement("iframe"),
					outputIframe = doc.createElement("iframe"),
					outputBody,
					inputBody = outputBody = false;

				var createLinks = (testID.substring(0, 6) == 'links_');


				var runTest = function () {
					var expected = cleanWhiteSpace(outputBody.innerHTML);
					var actual = cleanWhiteSpace(HTML5Outline(inputBody).asHTML(createLinks));

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
}());
