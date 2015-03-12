var utils = require("./utils");

function sectionHeadingText(sectionHeading) {
	if (utils.getTagName(sectionHeading) == 'HGROUP') {
		// @todo: share code with getHeadingElementRank() to return the heading itself and that would be it
		var headings = sectionHeading.getElementsByTagName('h' + (-utils.getHeadingElementRank(sectionHeading)));
		if (!headings.length) {
			return "<i>Error: no H1-H6 inside HGROUP</i>";
		}
		sectionHeading = headings[0];
	}
	// @todo: try to resolve text content from img[alt] or *[title]
	return utils.escapeHtml(sectionHeading.textContent) || "<i>No text content inside " + sectionHeading.nodeName + "</i>";
}

function generateId(node) {
	var linkCounter = 0; // @todo: move this out somewhere else, as this is not exactly performant (but makes old tests pass)
	var id = node.getAttribute('id');
	if (id) return id;

	do {
		id = 'h5o-' + (++linkCounter);
	} while (node.ownerDocument.getElementById(id)); // @todo: there's probably no document when outlining a detached fragment... is there?
	node.setAttribute('id', id);
	return id;
}

function getSectionHeadingHtml(section, createLinks) {
	var headingText = section.heading.implied
		? "<i>Untitled " + utils.getTagName(section.startingNode) + "</i>"
		: sectionHeadingText(section.heading);

	if (createLinks) {
		headingText = '<a href="#' + generateId(section.startingNode) + '">'
		+ headingText
		+ '</a>';
	}
	return headingText;
}

function asHTML(sections, createLinks) {
	var retval = '';

	for (var i = 0; i < sections.length; i++) {
		var section = sections[i];
		retval += '<li>' + getSectionHeadingHtml(section, createLinks) + asHTML(section.sections, createLinks) + '</li>';
	}

	return (retval == '' ? retval : '<ol>' + retval + '</ol>');
}

module.exports = asHTML;
