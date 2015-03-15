var utils = require("./utils");

function sectionHeadingText(section) {

	if (section.heading.implied) {
		return "<i>Untitled " + utils.getTagName(section.startingNode) + "</i>";
	}

	var elHeading = utils.getRankingHeadingElement(section.heading);
	if (!elHeading) {
		return "<i>Error: no H1-H6 inside HGROUP</i>";
	}

	var textContent = elHeading.textContent;
	if (!textContent) {
		return "<i>No text content inside " + utils.getTagName(elHeading) + "</i>";
	}

	return utils.escapeHtml(textContent);
}

function getId(section, options) {
	var sectionId = section.startingNode.getAttribute('id');
	if (sectionId) {
		return sectionId;
	}

	if (!section.heading.implied) {
		var headingId = section.heading.getAttribute('id');
		if (headingId) {
			return headingId;
		}
	}

	var node = section.startingNode;
	do {
		var id = 'h5o-' + (++options.linkCounter);
	} while (node.ownerDocument.getElementById(id));

	node.setAttribute('id', id);
	return id;
}

function asHTML(sections, options) {

	if (typeof(options) !== "object") {
		// if second argument is not an object - it must be the boolean for `createLinks` (backwards compat)
		options = {
			createLinks: !!options
		}
	}

	if (!sections.length) {
		return '';
	}

	if (options.skipTopHeader) {
		return asHTML(sections[0].sections, {
			skipToHeader: false,
			createLinks: options.createLinks
		})
	}

	if (typeof(options.linkCounter) === "undefined") {
		options.linkCounter = 0;
	}

	var createLinks = !!options.createLinks;
	var result = [];

	result.push("<ol>");

	for (var i = 0; i < sections.length; i++) {
		var section = sections[i];
		result.push("<li>");

		if (createLinks) {
			result.push('<a href="#' + getId(section, options) + '">');
		}

		result.push(sectionHeadingText(section));

		if (createLinks) {
			result.push("</a>");
		}

		result.push(asHTML(section.sections, options));
		result.push("</li>");
	}

	result.push("</ol>");

	return result.join("");
}

module.exports = asHTML;
