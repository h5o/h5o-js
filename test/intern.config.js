define(process.env.SAUCE_USERNAME ? {
	environments: [
		{ browserName: 'internet explorer', version: '11' },
		{ browserName: 'internet explorer', version: '10' },
		{ browserName: 'internet explorer', version: '9' },
		{ browserName: 'internet explorer', version: '8' },
		{ browserName: 'firefox' },
		{ browserName: 'chrome' },
		{ browserName: 'safari', version: '6' },
		{ browserName: 'safari', version: '7' }
	],

	tunnel: "SauceLabsTunnel",

	excludeInstrumentation: /^test\//
} : {
	environments: [
		{ browserName: 'phantom' }
	],
	excludeInstrumentation: /^test\//
});
