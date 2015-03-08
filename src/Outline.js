var asHTML = require("./asHTML");

function Outline(outlineTarget, onlySection) {
	this.startingNode = outlineTarget.node;
	this.sections = [onlySection];
}

Outline.prototype.getLastSection = function () {
	return this.sections[this.sections.length - 1];
};

Outline.prototype.asHTML = function (createLinks) {
	return asHTML(this.sections, createLinks);
};

module.exports = Outline;
