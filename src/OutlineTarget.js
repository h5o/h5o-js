/**
 * Internal data structure to avoid adding properties onto native objects
 *
 * @param {Element} node
 * @constructor
 */
function OutlineTarget(node)
{
	this.node = node;
}

module.exports = OutlineTarget;
