module.exports = function (root, enter, exit) {
	var node = root;
	start: while (node) {
		enter(node);
		if (node.firstChild) {
			node = node.firstChild;
			continue start;
		}
		while (node) {
			exit(node);
			if (node.nextSibling) {
				node = node.nextSibling;
				continue start;
			}
			if (node == root)
				node = null;
			else
				node = node.parentNode;
		}
	}
};
