var asHtml = require("./asHtml"),
	utils = require("./utils");

function sectionHeadingText(sectionHeading) {
	if (utils.isHeading(sectionHeading)) {
		if (utils.getTagName(sectionHeading) == 'HGROUP') {
			sectionHeading = sectionHeading.getElementsByTagName('h' + (-utils.getHeadingElementRank(sectionHeading)))[0];
		}
		// @todo: try to resolve text content from img[alt] or *[title]
		return utils.escapeHtml(sectionHeading.textContent) || "<i>No text content inside " + sectionHeading.nodeName + "</i>";
	}
	return "<i>Untitled " + utils.getTagName(sectionHeading) + "</i>";
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
};

function Section(startingNode) {
	this.sections = [];
	this.startingNode = startingNode;
};

Section.prototype = {
	heading: false,

	append: function (what) {
		what.container = this;
		this.sections.push(what);
	},

	asHTML: function (createLinks) {
		// @todo: this really belongs in a separate formatter type thing
		var headingText = sectionHeadingText(this.heading);
		if (createLinks) {
			headingText = '<a href="#' + generateId(this.startingNode) + '">'
			+ headingText
			+ '</a>';
		}
		return headingText + asHtml(this.sections, createLinks);
	}
};

module.exports = Section;
