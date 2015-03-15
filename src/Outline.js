var asHTML = require("./asHTML");

function Outline(outlineTarget, onlySection) {
	this.startingNode = outlineTarget.node;
	this.sections = [onlySection];
}

Outline.prototype.getLastSection = function () {
	return this.sections[this.sections.length - 1];
};

Outline.prototype.asHTML = function (options) {
	return asHTML(this.sections, options);
};

module.exports = Outline;
