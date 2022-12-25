// Copyright Titanium I.T. LLC.

const assert = require("./util/assert.cjs");
const CommandLine = require("./infrastructure/command_line.cjs");
const rot13 = require("./logic/rot13.cjs");
const App = require("./app.cjs");

describe("App", function() {

	it("reads command-line argument, transform it with ROT-13, and write result", function() {
		const input = "my input";
		const expectedOutput = rot13.transform(input);

		const commandLine = CommandLine.createNull({ args: [ input ]});
		const app = App.create(commandLine);
		app.run();
		assert.equal(commandLine.getLastOutput(), expectedOutput + "\n");
	});

	it("writes usage to command-line when no argument provided", function() {
		const commandLine = CommandLine.createNull({ args: []});
		const app = App.create(commandLine);

		app.run();
		assert.equal(commandLine.getLastOutput(), "Usage: run text_to_transform\n");
	});

	it("complains when too many command-line arguments provided", function() {
		const commandLine = CommandLine.createNull({ args: [ "a", "b" ]});
		const app = App.create(commandLine);

		app.run();
		assert.equal(commandLine.getLastOutput(), "too many arguments\n");
	});

});

