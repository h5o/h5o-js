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

function getHeadingElementRank(el) {
	var elTagName = getTagName(el);
	if (elTagName == 'HGROUP') {
		/* The rank of an hgroup element is the rank of the highest-ranked h1-h6 element descendant of the hgroup element, if there are any such elements, or otherwise the same as for an h1 element (the highest rank). */
		for (var i = 1; i <= 6; i++) {
			if (el.getElementsByTagName('H' + i).length > 0) {
				return -i;
			}
		}
		return -1;
	} else {
		return -parseInt(elTagName.substr(1));
	}
}

function escapeHtml(str) {
	return (""+str).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

exports.getTagName = getTagName;

exports.isSecRoot = tagChecker('^BLOCKQUOTE|BODY|DETAILS|FIELDSET|FIGURE|TD$');
exports.isSecContent = tagChecker('^ARTICLE|ASIDE|NAV|SECTION$');
exports.isHeading = tagChecker('^H[1-6]|HGROUP$');
exports.getHeadingElementRank = getHeadingElementRank;

exports.escapeHtml = escapeHtml;
