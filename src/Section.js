function Section(startingNode) {
	this.sections = [];
	this.startingNode = startingNode;
}

Section.prototype.append = function (what) {
	what.container = this;
	this.sections.push(what);
};

module.exports = Section;
