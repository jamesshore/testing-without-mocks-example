// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const CommandLine = require("./command_line.js");

describe("CommandLine", function() {

	it("provides first command-line argument", function() {
		const savedArgs = process.argv;
		process.argv = ["ignore", "first_argument"];
		try {
			const cli = CommandLine.create();
			assert.equal(cli.arg(), "first_argument");
		}
		finally {
			process.argv = savedArgs;
		}
	});

});