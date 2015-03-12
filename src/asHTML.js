var utils = require("./utils");

function sectionHeadingText(section) {

	if (section.heading.implied) {
		return "<i>Untitled " + utils.getTagName(section.startingNode) + "</i>";
	}

	var elHeading = section.heading;
	if (utils.getTagName(elHeading) === 'HGROUP') {
		// @todo: share code with getHeadingElementRank() to return the heading itself and that would be it
		var headings = elHeading.getElementsByTagName('h' + (-utils.getHeadingElementRank(elHeading)));
		if (!headings.length) {
			return "<i>Error: no H1-H6 inside HGROUP</i>";
		}
		elHeading = headings[0];
	}
	// @todo: try to resolve text content from img[alt] or *[title]
	return utils.escapeHtml(elHeading.textContent) || "<i>No text content inside " + elHeading.nodeName + "</i>";
}

function generateId(node) {
	var linkCounter = 0; // @todo: move this out somewhere else, as this is not exactly performant (but makes old tests pass)
	var id = node.getAttribute('id');
	if (id) return id;

	do {
		id = 'h5o-' + (++linkCounter);
	} while (node.ownerDocument.getElementById(id));
	node.setAttribute('id', id);
	return id;
}

function asHTML(sections, createLinks) {
	if (!sections.length) {
		return '';
	}

	var result = [];

	result.push("<ol>");

	for (var i = 0; i < sections.length; i++) {
		var section = sections[i];
		result.push("<li>");

		if (createLinks) {
			result.push('<a href="#' + generateId(section.startingNode) + '">');
		}

		result.push(sectionHeadingText(section));

		if (createLinks) {
			result.push("</a>");
		}

		result.push(asHTML(section.sections, createLinks));
		result.push("</li>");
	}

	result.push("</ol>");

	return result.join("");
}

module.exports = asHTML;
