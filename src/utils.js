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
	if (element.nodeType == 3) {
		return element.nodeValue;
	}

	if (getTagName(element) == 'IMG' || getTagName(element) == 'AREA' || (getTagName(element) == 'INPUT' && element.getAttribute('type').toLowerCase() == 'image')) {
		var alternatives = '';
		if (element.getAttribute('alt')) {
			alternatives += element.getAttribute('alt');
		}
		return alternatives;
	}

	var texto = [];

	if(element.childNodes[0]){
		if(element.childNodes[0].nodeType != 8) {
			texto[0] = getText(element.childNodes[0]);
		}
	}

	var i = 1;

	if(element.childNodes[i]) {
		while(element.childNodes[i]) {
			if(element.childNodes[i]) {
				if(element.childNodes[i].nodeType != 8) {
					texto[texto.length] = getText(element.childNodes[i]);
				}
				i++;
			}
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
