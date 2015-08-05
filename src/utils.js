function getTagName(el) {
	return el.tagName.toUpperCase(); // upper casing due to http://ejohn.org/blog/nodename-case-sensitivity/
}

function tagChecker(regexString) {
	return function (el) {
		return isElement(el) && (new RegExp(regexString, "i")).test(getTagName(el));
	}
}

function isElement(obj) {
	return obj && obj.tagName;
}

var isHeading = tagChecker('^H[1-6]|HGROUP$');

function getRankingHeadingElement(heading) {
	if (!isHeading(heading)) {
		throw new Error("Not a heading element");
	}

	var elTagName = getTagName(heading);
	if (elTagName !== "HGROUP") {
		return heading;
	}

	// find highest ranking heading inside HGROUP
	for (var i = 1; i <= 6; i++) {
		var headings = heading.getElementsByTagName("H" + i);
		if (headings.length) {
			return headings[0];
		}
	}

	// HGROUP has no headings...
	return null;
}

function escapeHtml(str) {
	return (""+str).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function hasHiddenAttribute(el) {
	return isElement(el) && el.hasAttribute("hidden");
}

exports.getTagName = getTagName;

exports.hasHiddenAttribute = hasHiddenAttribute;
exports.isSecRoot = tagChecker('^(BLOCKQUOTE|BODY|DETAILS|FIELDSET|FIGURE|TD)$');
exports.isSecContent = tagChecker('^(ARTICLE|ASIDE|NAV|SECTION)$');
exports.isHeading = isHeading;
exports.getRankingHeadingElement = getRankingHeadingElement;

exports.escapeHtml = escapeHtml;
