	
	var _log=function()
	{
		if (typeof console != 'undefined' && console.log) {
			console.log.apply(console, arguments);
		} else if (typeof opera != 'undefined') {
			opera.postError.apply(arguments);
		}
	}
	
	if (DEBUG)
	{
		fireunit.testDone();
	}
	
}());