var utils = require("./utils");

function sectionHeadingText(section) {

	if (section.heading.implied) {
		return "<i>Untitled " + utils.getTagName(section.startingNode) + "</i>";
	}

	var elHeading = utils.getRankingHeadingElement(section.heading);
	if (!elHeading) {
		return "<i>Error: no H1-H6 inside HGROUP</i>";
	}

	var textContent = elHeading.textContent; // @todo: try to resolve text content from img[alt] or *[title]
	if (!textContent) {
		return "<i>No text content inside " + utils.getTagName(elHeading) + "</i>";
	}

	return utils.escapeHtml(textContent);
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
