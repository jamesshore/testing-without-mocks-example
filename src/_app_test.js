// Copyright Titanium I.T. LLC.

import assert from "./util/assert.cjs";
import CommandLine from "./infrastructure/command_line.cjs";
import { transform } from "./logic/rot13.js";
import App from "./app.js";

describe("App", function() {

	it("reads command-line argument, transform it with ROT-13, and write result", function() {
		const input = "my input";
		const expectedOutput = transform(input);

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

