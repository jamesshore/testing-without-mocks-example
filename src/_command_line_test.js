// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const CommandLine = require("./command_line.js");
const stdout = require("test-console").stdout;

describe("CommandLine", function() {

	it("provides first command-line argument", function() {
		const savedArgs = process.argv;
		process.argv = ["ignore 1", "ignore 2", "first_argument"];
		try {
			const cli = CommandLine.create();
			assert.equal(cli.arg(), "first_argument");
		}
		finally {
			process.argv = savedArgs;
		}
	});

	it("writes to console", function() {
		stdout.inspectSync((output) => {
			const cli = CommandLine.create();
			cli.output("my output");
			assert.deepEqual(output, [ "my output\n" ]);
		});
	});

	it("provides last line written to console", function() {
		stdout.ignoreSync(() => {
			const cli = CommandLine.create();
			cli.output("my output");
			assert.equal(cli.getLastOutput(), "my output");
		});
	});

	it("arg is nullable", function() {
		const cli = CommandLine.createNull("my_arg");
		assert.equal(cli.arg(), "my_arg");
	});

	it("console is nullable", function() {
		stdout.inspectSync((output) => {
			const cli = CommandLine.createNull();
			cli.output("my output");
			assert.deepEqual(output, [], "should not actually output");
		});
	});

});