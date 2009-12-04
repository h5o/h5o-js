	var enterNode=function(node)
	{
		if (isHeading(stack[stack.length-1])) {
			_log("Entering: If the top of the stack is a heading content element - do nothing", node);
			return;
		}

		// When entering a sectioning content element or a sectioning root element
		if (isSecContent(node) || isSecRoot(node)) {
			// If current outlinee is not null, and the current section has no heading,
			// create an implied heading and let that be the heading for the current section.
			if (currentOutlinee!=null && !currentSection.heading) {
				currentSection.heading = impliedHeading(currentOutlinee);
			}
			
			// If current outlinee is not null, push current outlinee onto the stack.
			if (currentOutlinee!=null) {
				stack.push(currentOutlinee);
			}
			
			// Let current outlinee be the element that is being entered.
			currentOutlinee = node;

			// Let current section be a newly created section for the current outlinee element.
			currentSection = new Section();

			// Let there be a new outline for the new current outlinee, initialized with just the new current section as the only section in the outline.
			currentOutlinee.outline = new Outline(currentOutlinee, currentSection);
			return;
		}
		
		if (currentOutlinee==null) {
			_log("If the current outlinee is null, do nothing");
			return;
		}
		
		// When entering a heading content element
		if (isHeading(node)) {
			
			// If the current section has no heading, let the element being entered be the heading for the current section.
			if (!currentSection.heading) {
				currentSection.heading = node;
			
			// Otherwise, if the element being entered has a rank equal to or greater than the heading of the last section of the outline of the current outlinee, 
			} else if (getHeadingRank(node) >= currentOutlinee.outline.lastSection().headingRank()) {
				
				// create a new section and 
				var newSection=new Section();
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
					if (getHeadingRank(node) < candidateSection.headingRank()) {
						
						// create a new section,
						var newSection = new Section();

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

		_log("Do nothing (entering):", node);
	}
