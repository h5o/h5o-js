The algorithm that must be followed during a walk of a DOM subtree rooted at a sectioning content element or a sectioning root element to determine that element's outline is as follows:

	1. Let current outline target be null. (It holds the element whose outline is being created.)

	2. Let current section be null. (It holds a pointer to a section, so that elements in the DOM can all be associated with a section.)

	3. Create a stack to hold elements, which is used to handle nesting. Initialise this stack to empty.

	4. Walk over the DOM in tree order, starting with the sectioning content element or sectioning root element at the root of the subtree for which an outline is to be created, and trigger the first relevant step below for each element as the walk enters and exits it.

		* When exiting an element, if that element is the element at the top of the stack

			Note: The element being exited is a heading content element or an element with a hidden attribute.

			Pop that element from the stack.

		* If the top of the stack is a heading content element or an element with a hidden attribute

			Do nothing.

		* When entering an element with a hidden attribute

			Push the element being entered onto the stack. (This causes the algorithm to skip that element and any descendants of the element.)

		* When entering a sectioning content element

			Run these steps:

			1. If current outline target is not null, run these substeps:

				1. If the current section has no heading, create an implied heading and let that be the heading for the current section.

				2. Push current outline target onto the stack.

			2. Let current outline target be the element that is being entered.

			3. Let current section be a newly created section for the current outline target element.

			4. Associate current outline target with current section.

			5. Let there be a new outline for the new current outline target, initialised with just the new current section as the only section in the outline.

		* When exiting a sectioning content element, if the stack is not empty

			Run these steps:

			1. If the current section has no heading, create an implied heading and let that be the heading for the current section.

			2. Pop the top element from the stack, and let the current outline target be that element.

			3. Let current section be the last section in the outline of the current outline target element.

			4. Append the outline of the sectioning content element being exited to the current section. (This does not change which section is the last section in the outline.)

		* When entering a sectioning root element

			Run these steps:

			1. If current outline target is not null, push current outline target onto the stack.

			2. Let current outline target be the element that is being entered.

			3. Let current outline target's parent section be current section.

			4. Let current section be a newly created section for the current outline target element.

			5. Let there be a new outline for the new current outline target, initialised with just the new current section as the only section in the outline.

		* When exiting a sectioning root element, if the stack is not empty

			Run these steps:

			1. If the current section has no heading, create an implied heading and let that be the heading for the current section.

			2. Let current section be current outline target's parent section.

			3. Pop the top element from the stack, and let the current outline target be that element.

		* When exiting a sectioning content element or a sectioning root element (when the stack is empty)

			Note: The current outline target is the element being exited, and it is the sectioning content element or a sectioning root element at the root of the subtree for which an outline is being generated.

			If the current section has no heading, create an implied heading and let that be the heading for the current section.

			Skip to the next step in the overall set of steps. (The walk is over.)

		* When entering a heading content element

			If the current section has no heading, let the element being entered be the heading for the current section.

			Otherwise, if the element being entered has a rank equal to or higher than the heading of the last section of the outline of the current outline target, or if the heading of the last section of the outline of the current outline target is an implied heading, then create a new section and append it to the outline of the current outline target element, so that this new section is the new last section of that outline. Let current section be that new section. Let the element being entered be the new heading for the current section.

			Otherwise, run these substeps:

				1. Let candidate section be current section.

				2. Heading loop: If the element being entered has a rank lower than the rank of the heading of the candidate section, then create a new section, and append it to candidate section. (This does not change which section is the last section in the outline.) Let current section be this new section. Let the element being entered be the new heading for the current section. Abort these substeps.

				3. Let new candidate section be the section that contains candidate section in the outline of current outline target.

				4. Let candidate section be new candidate section.

				5. Return to the step labeled heading loop.

			Push the element being entered onto the stack. (This causes the algorithm to skip any descendants of the element.)

			Note: Recall that h1 has the highest rank, and h6 has the lowest rank.

		* Otherwise

			Do nothing.

		In addition, whenever the walk exits a node, after doing the steps above, if the node is not associated with a section yet, associate the node with the section current section.

	5. Associate all non-element nodes that are in the subtree for which an outline is being created with the section with which their parent element is associated.

	6. Associate all nodes in the subtree with the heading of the section with which they are associated, if any.

	The tree of sections created by the algorithm above, or a proper subset thereof, must be used when generating document outlines, for example when generating tables of contents.

The outline created for the body element of a Document is the outline of the entire document.

When creating an interactive table of contents, entries should jump the user to the relevant sectioning content element, if the section was created for a real element in the original document, or to the relevant heading content element, if the section in the tree was generated for a heading in the above process.

Selecting the first section of the document therefore always takes the user to the top of the document, regardless of where the first heading in the body is to be found.

The outline depth of a heading content element associated with a section section is the number of sections that are ancestors of section in the outermost outline that section finds itself in when the outlines of its Document's elements are created, plus 1. The outline depth of a heading content element not associated with a section is 1.

User agents should provide default headings for sections that do not have explicit section headings.
