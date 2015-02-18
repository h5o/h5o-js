var Section = require("./Section"),
	asHtml = require("./asHtml"),
	walk = require("./walk"),
	utils = require("./utils");

function arrayLast(arr) {
	return arr[arr.length - 1];
}

function getSectionHeadingRank(section) {
	var heading = section.heading;
	return utils.isHeading(heading)
		? utils.getHeadingElementRank(heading)
		: 1; // is this true? TODO: find a reference...
};

var currentOutlinee, currentSection, stack;

function onEnterNode(node) {
	// If the top of the stack is a heading content element - do nothing
	if (utils.isHeading(arrayLast(stack))) {
		return;
	}

	// When entering a sectioning content element or a sectioning root element
	if (utils.isSecContent(node) || utils.isSecRoot(node)) {
		// If current outlinee is not null, and the current section has no heading,
		// create an implied heading and let that be the heading for the current section.
		// if (currentOutlinee!=null && !currentSection.heading) {
		/*
		 TODO: is this really the way it should be done?
		 In my implementation, "implied heading" is always created (section.heading=false by default)

		 If I DO "create" something else here, the algorithm goes very wrong, as there's a place
		 where you have to check whether a "heading exists" - so - does the "implied heading" mean
		 there is a heading or not?
		 */
		// }

		// If current outlinee is not null, push current outlinee onto the stack.
		if (currentOutlinee != null) {
			stack.push(currentOutlinee);
		}

		// Let current outlinee be the element that is being entered.
		currentOutlinee = node;

		// Let current section be a newly created section for the current outlinee element.
		currentSection = new Section(node);

		// Let there be a new outline for the new current outlinee, initialized with just the new current section as the only section in the outline.
		currentOutlinee.outline = {
			sections: [currentSection],
			startingNode: node,
			asHTML: function (createLinks) {
				return asHtml(this.sections, createLinks);
			}
		};
		return;
	}

	// If the current outlinee is null, do nothing
	if (currentOutlinee == null) {
		return;
	}

	// When entering a heading content element
	if (utils.isHeading(node)) {

		// If the current section has no heading, let the element being entered be the heading for the current section.
		if (!currentSection.heading) {
			currentSection.heading = node;

			// Otherwise, if the element being entered has a rank equal to or greater than the heading of the last section of the outline of the current outlinee,
		} else if (utils.getHeadingElementRank(node) >= getSectionHeadingRank(arrayLast(currentOutlinee.outline.sections))) {

			// create a new section and
			var newSection = new Section(node);

			// append it to the outline of the current outlinee element, so that this new section is the new last section of that outline.
			currentOutlinee.outline.sections.push(newSection);

			// Let current section be that new section.
			currentSection = newSection;

			// Let the element being entered be the new heading for the current section.
			currentSection.heading = node;

			// Otherwise, run these substeps:
		} else {
			var abortSubsteps = false;

			// 1. Let candidate section be current section.
			var candidateSection = currentSection;

			do {
				// 2. If the element being entered has a rank lower than the rank of the heading of the candidate section,
				if (utils.getHeadingElementRank(node) < getSectionHeadingRank(candidateSection)) {

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

				// 3. Let new candidate section be the section that contains candidate section in the outline of current outlinee.
				var newCandidateSection = candidateSection.container;

				// 4. Let candidate section be new candidate section.
				candidateSection = newCandidateSection;

				// 5. Return to step 2.
			} while (!abortSubsteps);
		}

		// Push the element being entered onto the stack. (This causes the algorithm to skip any descendants of the element.)
		stack.push(node);
		return;
	}

	// Do nothing.
};

function onExitNode(node) {
	// If the top of the stack is an element, and you are exiting that element
	//				Note: The element being exited is a heading content element.
	//		Pop that element from the stack.
	// If the top of the stack is a heading content element - do nothing
	var stackTop = arrayLast(stack);
	if (utils.isHeading(stackTop)) {
		if (stackTop == node) {
			stack.pop();
		}
		return;
	}

	/************ MODIFICATION OF ORIGINAL ALGORITHM *****************/
	// existing sectioning content or sectioning root
	// this means, currentSection will change (and we won't get back to it)
	if ((utils.isSecContent(node) || utils.isSecRoot(node)) && !currentSection.heading) {

		currentSection.heading = '<i>Untitled ' + utils.getTagName(node) + '</i>';

	}
	/************ END MODIFICATION ***********************************/

	// When exiting a sectioning content element, if the stack is not empty
	if (utils.isSecContent(node) && stack.length > 0) {

		// Pop the top element from the stack, and let the current outlinee be that element.
		currentOutlinee = stack.pop();

		// Let current section be the last section in the outline of the current outlinee element.
		currentSection = arrayLast(currentOutlinee.outline.sections);

		// Append the outline of the sectioning content element being exited to the current section. (This does not change which section is the last section in the outline.)
		for (var i = 0; i < node.outline.sections.length; i++) {
			currentSection.append(node.outline.sections[i]);
		}
		return;
	}

	// When exiting a sectioning root element, if the stack is not empty
	if (utils.isSecRoot(node) && stack.length > 0) {
		// Pop the top element from the stack, and let the current outlinee be that element.
		currentOutlinee = stack.pop();

		// Let current section be the last section in the outline of the current outlinee element.
		currentSection = arrayLast(currentOutlinee.outline.sections);

		// Finding the deepest child: If current section has no child sections, stop these steps.
		while (currentSection.sections.length > 0) {

			// Let current section be the last child section of the current current section.
			currentSection = arrayLast(currentSection.sections);

			// Go back to the substep labeled finding the deepest child.
		}
		return;
	}

	// When exiting a sectioning content element or a sectioning root element
	if (utils.isSecContent(node) || utils.isSecRoot(node)) {
		// Let current section be the first section in the outline of the current outlinee element.
		currentSection = currentOutlinee.outline.sections[0];

		// Skip to the next step in the overall set of steps. (The walk is over.)
		return;
	}

	// If the current outlinee is null, do nothing
	// Do nothing
};

function HTML5Outline(start) {
	// Let current outlinee be null. (It holds the element whose outline is being created.)
	currentOutlinee = null;

	// Let current section be null. (It holds a pointer to a section, so that elements in the DOM can all be associated with a section.)
	currentSection = null;

	// Create a stack to hold elements, which is used to handle nesting. Initialize this stack to empty.
	stack = [];

	// As you walk over the DOM in tree order, trigger the first relevant step below for each element as you enter and exit it.
	walk(start, onEnterNode, onExitNode);

	// If the current outlinee is null, then there was no sectioning content element or sectioning root element in the DOM. There is no outline. Abort these steps.
	/* @todo
	 if (currentOutlinee != null) {
	 Associate any nodes that were not associated with a section in the steps above with current outlinee as their section.

	 Associate all nodes with the heading of the section with which they are associated, if any.

	 If current outlinee is the body element, then the outline created for that element is the outline of the entire document.
	 }
	 */

	return currentOutlinee != null ? currentOutlinee.outline : null;
};

module.exports = HTML5Outline;
