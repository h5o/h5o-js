	var exitNode=function(node)
	{
		// If the top of the stack is a heading element, and you are exiting that element
		if (isHeading(stack[stack.length-1]) && stack[stack.length-1]==node) {
			stack.pop();
			return;
		}

		// If the top of the stack is a heading content element - do nothing
		if (isHeading(stack[stack.length-1])) {
			return;
		}
		
		/************ MODIFICATION OF ORIGINAL ALGORITHM *****************/
		// existing sectioning content or sectioning root
		// this means, currentSection will change (and we won't get back to it)
		if ((isSecContent(node) || isSecRoot(node)) && !currentSection.heading) {
			
			currentSection.heading = '<i>' + impliedHeading(node) + '</i>';
			
		}
		/************ END MODIFICATION ***********************************/

		// When exiting a sectioning content element, if the stack is not empty
		if (isSecContent(node) && stack.length > 0) {
			
			// Pop the top element from the stack, and let the current outlinee be that element.
			currentOutlinee = stack.pop();
			
			// Let current section be the last section in the outline of the current outlinee element.
			currentSection = _lastSection(currentOutlinee.outline);
			
			// Append the outline of the sectioning content element being exited to the current section. (This does not change which section is the last section in the outline.)
			for (var i = 0; i < node.outline.sections.length; i++) {
				currentSection.append(node.outline.sections[i]);
			}
			return;
		}

		// When exiting a sectioning root element, if the stack is not empty
		if (isSecRoot(node) && stack.length > 0) {
			// Pop the top element from the stack, and let the current outlinee be that element.
			currentOutlinee = stack.pop();
			
			// Let current section be the last section in the outline of the current outlinee element.
			currentSection = _lastSection(currentOutlinee.outline);

			// Finding the deepest child: If current section has no child sections, stop these steps.
			while (currentSection.sections.length > 0) {
				
				// Let current section be the last child section of the current current section.
				currentSection = _lastSection(currentSection);
				
				// Go back to the substep labeled finding the deepest child.
			}
			return;
		}

		// When exiting a sectioning content element or a sectioning root element
		if (isSecContent(node) || isSecRoot(node)) {
			// Let current section be the first section in the outline of the current outlinee element.
			currentSection = currentOutlinee.outline.sections[0];
			 
			// Skip to the next step in the overall set of steps. (The walk is over.)
			return;
		}
		
		// If the current outlinee is null, do nothing
		// Do nothing
	}
