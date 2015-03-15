var Section = require("./Section"),
	Outline = require("./Outline"),
	OutlineTarget = require("./OutlineTarget"),
	walk = require("./walk"),
	utils = require("./utils");

var currentOutlineTarget, currentSection, stack;

function stackTopNode() {
	if (!stack.length) return;
	return stack[stack.length - 1].node;
}

function getRank(heading) {
	var rankingElement = utils.getRankingHeadingElement(heading);
	if (!rankingElement) {
		// The rank of an hgroup element is the rank of the highest-ranked h1–h6 element descendant of the hgroup
		// element, if there are any such elements, or otherwise the same as for an h1 element (the highest rank).
		// ref: https://html.spec.whatwg.org/#the-hgroup-element
		return -1; // rank of H1
	}
	return -parseInt(utils.getTagName(rankingElement).substr(1));
}

function onEnterNode(node) {

	// If the top of the stack is a heading content element or an element with a hidden attribute
	// Do nothing.
	var stackTop = stackTopNode();
	if (utils.isHeading(stackTop) || utils.hasHiddenAttribute(stackTop)) {
		return;
	}

	// When entering an element with a hidden attribute
	// Push the element being entered onto the stack. (This causes the algorithm to skip that element and any
	// descendants of the element.)
	if (utils.hasHiddenAttribute(node)) {
		stack.push({node: node});
		return;
	}

	// When entering a sectioning content element
	if (utils.isSecContent(node)) {

		// If current outline target is not null, run these substeps:
		if (currentOutlineTarget != null) {
			// If the current section has no heading, create an implied heading and let that be the heading for the
			// current section.
			if (!currentSection.heading) {
				currentSection.heading = {implied: true};
			}

			// Push current outline target onto the stack.
			stack.push(currentOutlineTarget);
		}

		// Let current outline target be the element that is being entered.
		currentOutlineTarget = new OutlineTarget(node);

		// Let current section be a newly created section for the current outline target element.
		// @todo: Associate current outline target with current section.
		currentSection = new Section(node);

		// Let there be a new outline for the new current outline target, initialised with just the new current section
		// as the only section in the outline.
		currentOutlineTarget.outline = new Outline(currentOutlineTarget.node, currentSection);
		return;
	}

	// When entering a sectioning root element
	if (utils.isSecRoot(node)) {

		// If current outline target is not null, push current outline target onto the stack.
		if (currentOutlineTarget != null) {
			stack.push(currentOutlineTarget);
		}

		// Let current outline target be the element that is being entered.
		currentOutlineTarget = new OutlineTarget(node);

		// Let current outline target's parent section be current section.
		currentOutlineTarget.parentSection = currentSection;

		// Let current section be a newly created section for the current outline target element.
		currentSection = new Section(node);

		// Let there be a new outline for the new current outline target, initialised with just the new current section
		// as the only section in the outline.
		currentOutlineTarget.outline = new Outline(currentOutlineTarget.node, currentSection);
		return;
	}

	// When entering a heading content element
	if (utils.isHeading(node)) {

		// If the current section has no heading, let the element being entered be the heading for the current section.
		if (!currentSection.heading) {
			currentSection.heading = node;

			// Otherwise, if the element being entered has a rank equal to or higher than the heading of the last section of
			// the outline of the current outline target, or if the heading of the last section of the outline of the current
			// outline target is an implied heading, then
		} else if (currentOutlineTarget.outline.getLastSection().heading.implied || getRank(node) >= getRank(currentOutlineTarget.outline.getLastSection().heading)) {

			// create a new section and
			var newSection = new Section(node);

			// append it to the outline of the current outline target element, so that this new section is the new last
			// section of that outline.
			currentOutlineTarget.outline.sections.push(newSection);

			// Let current section be that new section.
			currentSection = newSection;

			// Let the element being entered be the new heading for the current section.
			currentSection.heading = node;

			// Otherwise, run these substeps:
		} else {

			var abortSubsteps = false;

			// Let candidate section be current section.
			var candidateSection = currentSection;

			// Heading loop:
			do {
				// note:
				// if candidateSection is still currentSection - it definitely has a heading, because otherwise
				// `node`, which is a heading, would be a heading for that section

				// if the heading for currentSection is higher (or same), e.g. `node` is H2 and currentSection.heading is H1
				// then our `node` creates a subsection and we don't need to care about anything else

				// if our `node` is actually higher, e.g. `node` is H3, and currentSection.heading is H4
				// H4 is not the last child of the outline target [and therefore not the only child]
				// therefore there must exist an element of at least H3 or higher rank
				// that is the outline parent of the H4 and that element of H3 or higher
				// would then be hit by going upwards
				// therefore getSectionHeadingRank is sure that candidateSection.heading is not implied

				// If the element being entered has a rank lower than the rank of the heading of the candidate section, then
				if (getRank(node) < getRank(candidateSection.heading)) {

					// create a new section,
					var newSection = new Section(node);

					// and append it to candidate section. (This does not change which section is the last section in the outline.)
					candidateSection.append(newSection);

					// Let current section be this new section.
					currentSection = newSection;

					// Let the element being entered be the new heading for the current section.
					currentSection.heading = node;

					// Abort these substeps.
					abortSubsteps = true;
				}

				// Let new candidate section be the section that contains candidate section in the outline of current outline target.
				var newCandidateSection = candidateSection.container;

				// Let candidate section be new candidate section.
				candidateSection = newCandidateSection;

				// Return to the step labeled heading loop.
			} while (!abortSubsteps);
		}

		// Push the element being entered onto the stack. (This causes the algorithm to skip any descendants of the element.)
		stack.push({node: node});
		return;
	}

	// Otherwise
	// Do nothing.
}

function onExitNode(node) {


	// When exiting an element, if that element is the element at the top of the stack
	// Note: The element being exited is a heading content element or an element with a hidden attribute.
	// Pop that element from the stack.
	var stackTop = stackTopNode();
	if (stackTop === node) {
		stack.pop();
	}

	// If the top of the stack is a heading content element or an element with a hidden attribute
	// Do nothing.
	if (utils.isHeading(stackTop) || utils.hasHiddenAttribute(stackTop)) {
		return;
	}

	// When exiting a sectioning content element, if the stack is not empty
	if (utils.isSecContent(node) && stack.length > 0) {

		// If the current section has no heading, create an implied heading and let that be the heading for the current section.
		if (!currentSection.heading) {
			currentSection.heading = {implied: true};
		}

		var targetBeingExited = currentOutlineTarget; // note: `targetBeingExited.node` is `node`

		// Pop the top element from the stack, and let the current outline target be that element.
		currentOutlineTarget = stack.pop();

		// Let current section be the last section in the outline of the current outline target element.
		currentSection = currentOutlineTarget.outline.getLastSection();

		// Append the outline of the sectioning content element being exited to the current section.
		// (This does not change which section is the last section in the outline.)
		for (var i = 0; i < targetBeingExited.outline.sections.length; i++) {
			currentSection.append(targetBeingExited.outline.sections[i]);
		}
		return;
	}

	// When exiting a sectioning root element, if the stack is not empty
	if (utils.isSecRoot(node) && stack.length > 0) {

		// If the current section has no heading, create an implied heading and let that be the heading for the current section.
		if (!currentSection.heading) {
			currentSection.heading = {implied: true};
		}

		// Let current section be current outline target's parent section.
		currentSection = currentOutlineTarget.parentSection;

		// Pop the top element from the stack, and let the current outline target be that element.
		currentOutlineTarget = stack.pop();
		return;
	}

	// The current outline target is the element being exited, and it is the sectioning content element or a sectioning
	// root element at the root of the subtree for which an outline is being generated.
	// Note: The current outline target is the element being exited, and it is the sectioning content element or
	// a sectioning root element at the root of the subtree for which an outline is being generated.
	if (utils.isSecContent(node) || utils.isSecRoot(node)) {

		// If the current section has no heading, create an implied heading and let that be the heading for the current section.
		if (!currentSection.heading) {
			currentSection.heading = {implied: true};
		}

		// Skip to the next step in the overall set of steps. (The walk is over.)
		return;
	}

	// Otherwise
	// Do nothing.
}

function createOutline(start) {

	if (!utils.isSecContent(start) && !utils.isSecRoot(start)) {
		throw new TypeError("Invalid argument: start element must either be sectioning root or sectioning content.");
	}

	// Let current outline target be null.
	// (It holds the element whose outline is being created.)
	currentOutlineTarget = null;

	// Let current section be null.
	// (It holds a pointer to a section, so that elements in the DOM can all be associated with a section.)
	currentSection = null;

	// Create a stack to hold elements, which is used to handle nesting. Initialise this stack to empty.
	stack = [];

	// Walk over the DOM in tree order, starting with the sectioning content element or sectioning root element at the
	// root of the subtree for which an outline is to be created, and trigger the first relevant step below for each
	// element as the walk enters and exits it.
	walk(start, onEnterNode, onExitNode);

	// @todo: In addition, whenever the walk exits a node, after doing the steps above, if the node is not associated with a section yet, associate the node with the section current section.
	// @todo: Associate all non-element nodes that are in the subtree for which an outline is being created with the section with which their parent element is associated.
	// @todo: Associate all nodes in the subtree with the heading of the section with which they are associated, if any.

	// `currentOutlineTarget` cannot be null, since we can only `start` at sectioning root/content
	// and entering sectioning root/content always sets a `currentOutlineTarget`
	return currentOutlineTarget.outline;

}

module.exports = createOutline;
