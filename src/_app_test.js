// Copyright Titanium I.T. LLC.

import assert from "./util/assert.js";
import CommandLine from "./infrastructure/command_line.js";
import { transform } from "./logic/rot13.js";
import App from "./app.js";

describe("App", function() {

	it("reads command-line argument, transform it with ROT-13, and write result", function() {
		const input = "my input";
		const expectedOutput = transform(input);

		const { output } = run({ args: [ input ] });
		assert.deepEqual(output.data, [ `${expectedOutput}\n` ]);
	});

	it("writes usage to command-line when no argument provided", function() {
		const { output } = run({ args: [] });
		assert.deepEqual(output.data, [ "Usage: run text_to_transform\n" ]);
	});

	it("complains when too many command-line arguments provided", function() {
		const { output } = run({ args: [ "a", "b" ] });
		assert.deepEqual(output.data, [ "too many arguments\n" ]);
	});

});

function run({
	args = [],
} = {}) {
	const commandLine = CommandLine.createNull({ args });
	const app = new App(commandLine);
	app.run();

	return {
		output: {
			data: [ commandLine.getLastOutput() ],
		},
	};
}