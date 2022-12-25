// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const childProcess = require("child_process");
const path = require("path");
const CommandLine = require("./command_line");

describe("CommandLine", function() {

	it("provides command-line arguments", async function() {
		const args = [ "my arg 1", "my arg 2" ];
		const stdout = await runModuleAsync("./_command_line_test_args_runner.js", args);
		assert.equal(stdout, '["my arg 1","my arg 2"]');
	});

	it("writes output", async function() {
		const stdout = await runModuleAsync("./_command_line_test_output_runner.js");
		assert.equal(stdout, "my output");
	});

	it("remembers last output", function() {
		const commandLine = CommandLine.createNull();
		commandLine.writeOutput("my last output");
		assert.equal(commandLine.getLastOutput(), "my last output");
	});

	it("last output is undefined when nothing has been output yet", function() {
		const commandLine = CommandLine.createNull();
		assert.isUndefined(commandLine.getLastOutput());
	});


	describe("Nullability", function() {

		it("defaults to no arguments", function() {
			const commandLine = CommandLine.createNull();
			assert.deepEqual(commandLine.args(), []);
		});

		it("allows arguments to be configured", function() {
			const commandLine = CommandLine.createNull({ args: [ "one", "two" ]});
			assert.deepEqual(commandLine.args(), [ "one", "two" ]);
		});

		it("doesn't write output to command line", async function() {
			const stdout = await runModuleAsync("./_command_line_test_null_output_runner.js");
			assert.equal(stdout, "");
		});

	});

});

function runModuleAsync(relativeModulePath, args) {
	return new Promise((resolve, reject) => {
		const absolutePath = path.resolve(__dirname, relativeModulePath);
		const options = {
			stdio: "pipe",
		};
		const child = childProcess.fork(absolutePath, args, options);

		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (data) => {
			stdout += data;
		});
		child.stderr.on("data", (data) => {
			stderr += data;
		});

		child.on("exit", () => {
			if (stderr !== "") {
				console.log(stderr);
				return reject(new Error("Runner failed"));
			}
			else {
				return resolve(stdout);
			}
		});
	});
}
