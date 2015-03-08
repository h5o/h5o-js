function asHTML(sections, createLinks) {
	var retval = '';

	for (var i = 0; i < sections.length; i++) {
		retval += '<li>' + sections[i].asHTML(createLinks) + '</li>';
	}

	return (retval == '' ? retval : '<ol>' + retval + '</ol>');
}

module.exports = asHTML;
