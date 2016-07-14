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

function getText(element) {
	// is a TEXT_NODE or CDATA section
	if (element.nodeType == 3 || element.nodeType == 4) {
		return element.nodeValue;
	}

	if (element.nodeType != 1) {
		return '';
	}

	// tag with alt attribute
	if (getTagName(element) == 'IMG' || (getTagName(element) == 'INPUT' && element.getAttribute('type').toLowerCase() == 'image')) {
		var alternatives = '';
		if (element.getAttribute('alt')) {
			alternatives += element.getAttribute('alt');
		}
		return alternatives;
	}

	var texto = [];

	// get text from child nodes
	for (var i = 0; i < element.childNodes.length; i++) {
		// non-comment node
		if(element.childNodes[i].nodeType != 8) {
			texto[texto.length] = getText(element.childNodes[i]);
		}
	}

	return texto.join('');
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
exports.getText = getText;

exports.escapeHtml = escapeHtml;
