define([
	"intern!tdd",
	"intern/chai!assert",
	"intern/order!../dist/outliner.min.js"
], function (tdd, assert) {

	var cleanWhiteSpace = function (s) {
		return s.replace(/>\s+/g, '>').replace(/\s+</g, '<');
	};

	var test = tdd.test;

	tdd.suite('h5o', function () {

		test("non-sectioning element outlining", function () {
			var actual = HTML5Outline(document.createElement('div'));
			assert.equal(null, actual, "Outline for an empty DIV should be null");
		});

		test("section inside a div - not starting with secRoot", function () {
			var div = document.createElement('div');
			div.appendChild(document.createElement('section'));
			var actual = HTML5Outline(div);
			assert.equal("<ol><li><i>Untitled SECTION</i></li></ol>",
				actual.asHTML(),
				"Outline for a DIV is the outline of the SECTION inside");
		});

		test("two sections inside a div - not starting with secRoot", function () {
			var div = document.createElement('div');
			div.appendChild(document.createElement('section'));
			div.appendChild(document.createElement('section'));
			var actual = HTML5Outline(div);
			assert.equal("<ol><li><i>Untitled SECTION</i><ol><li><i>Untitled SECTION</i></li></ol></li></ol>",
				actual.asHTML(),
				"Second SECTION becomes a child of the first one. Odd - TODO - verify");
		});

		test("some headings", function () {
			var div = document.createElement('div');
			var heading = document.createElement('h1');
			heading.innerHTML = "Test";
			div.appendChild(heading);
			div.appendChild(document.createElement('section'));
			var actual = HTML5Outline(div);
			assert.equal("<ol><li><i>Untitled SECTION</i></li></ol>",
				actual.asHTML(),
				"Heading outside of sectioning root is ignored");
		});

		var iframeTestList = [
			"spec1", "spec2", "spec3a", "spec3b", "spec4", "navfirst", "hgroup",
			"links_simple", "links_idreuse", "links_idcollision"
		];

		for (var i = 0; i < iframeTestList.length; i++) {
			test(iframeTestList[i], testOutline(iframeTestList[i]));
		}

		function testOutline(testID) {
			return function () {

				var docIframe = document.createElement("iframe"),
					outIframe = document.createElement("iframe"),
					out,
					doc = out = false;

				var createLinks = (testID.substring(0, 6) == 'links_');

				docIframe.src = ("test/" + testID + ".doc.html");
				docIframe.onload = function () {
					doc = docIframe.contentWindow.document.body;
				};

				outIframe.src = ("test/" + testID + ".out.html");
				outIframe.onload = function () {
					out = outIframe.contentWindow.document.body;
				};

				var runTest = function () {
					if (!doc || !out) return;
					clearInterval(waitForLoad);

					var expected = cleanWhiteSpace(out.innerHTML);
					var actual = cleanWhiteSpace(HTML5Outline(doc).asHTML(createLinks));

					assert.equal(expected, actual, "Comparison for: " + testID);

					setTimeout(function () {
						docIframe.parentNode.removeChild(docIframe);
						outIframe.parentNode.removeChild(outIframe);
						assert.end();
					}, 100);
				};

				var waitForLoad = setInterval(runTest, 1);

				document.body.appendChild(docIframe);
				document.body.appendChild(outIframe);
			}
		}
	});
});
