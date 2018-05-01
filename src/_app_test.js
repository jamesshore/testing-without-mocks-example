// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const App = require("./app.js");

describe("ROT-13 App", function() {

	it("encodes hello", function() {
		const app = new App();
		const actual = app.run();
		assert.equal(actual, "uryyb");
	});

});