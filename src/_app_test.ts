// Copyright Titanium I.T. LLC.
import assert from "./util/assert.js";
import { CommandLine } from "./infrastructure/command_line.js";
import * as rot13 from "./logic/rot13.js";
import { App } from "./app.js";

describe("App", () => {

	it("reads command-line argument, transform it with ROT-13, and writes result", () => {
		const input = "my input";
		const expectedOutput = rot13.transform(input);

		const { output } = run({ args: [ input ] });
		assert.deepEqual(output.data, [ `${expectedOutput}\n` ]);
	});

	it("writes usage when no arguments provided", () => {
		const { output } = run({ args: [] });
		assert.deepEqual(output.data, [ "Usage: run text_to_transform\n" ]);
	});

	it("complains when too many arguments provided", () => {
		const { output } = run({ args: [ "a", "b" ] });
		assert.deepEqual(output.data, [ "too many arguments\n" ]);
	});

});

function run({
	args = [],
}: { args?: string[] } = {}) {
	const commandLine = CommandLine.createNull({ args });
	const output = commandLine.trackOutput();

	const app = new App(commandLine);
	app.run();

	return { output };
}