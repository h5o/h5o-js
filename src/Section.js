var asHtml = require("./asHtml"),
	utils = require("./utils");

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

function Section(startingNode) {
	this.sections = [];
	this.startingNode = startingNode;
}

Section.prototype = {

	append: function (what) {
		what.container = this;
		this.sections.push(what);
	},

	asHTML: function (createLinks) {
		// @todo: this really belongs in a separate formatter type thing

		if (!this.heading) {
			// @todo: find formal proof if this is possible/not-possible
			throw new Error("An implied heading should have been created at some point, but wasn't.");
		}

		var headingText = this.heading.implied
			? "<i>Untitled " + utils.getTagName(this.startingNode) + "</i>"
			: sectionHeadingText(this.heading);

		if (createLinks) {
			headingText = '<a href="#' + generateId(this.startingNode) + '">'
			+ headingText
			+ '</a>';
		}
		return headingText + asHtml(this.sections, createLinks);
	}
};

module.exports = Section;
