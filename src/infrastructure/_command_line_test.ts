// Copyright Titanium I.T. LLC.
import assert from "../util/assert.js";
import childProcess from "node:child_process";
import { CommandLine, CommandLineResponses } from "./command_line.js";
import { pathToFile } from "../util/module_paths.js";

describe("CommandLine", () => {

	describe("output", () => {

		it("writes to stdout", async () => {
			const stdout = await runModuleAsync("./_command_line_test_output_runner.js");
			assert.equal(stdout, "my output");
		});

		it("tracks output", () => {
			const { commandLine, output } = createNull();

			commandLine.writeOutput("my output");
			assert.deepEqual(output.data, [ "my output" ]);
		});

	});


	describe("arguments", () => {

		it("provides command-line arguments", async () => {
			const args = [ "my arg 1", "my arg 2" ];
			const stdout = await runModuleAsync("./_command_line_test_args_runner.js", args);
			assert.equal(stdout, '["my arg 1","my arg 2"]');
		});

	});


	describe("nullability", () => {

		it("doesn't write to stdout", async () => {
			const stdout = await runModuleAsync("./_command_line_test_nulled_output_runner.js");
			assert.equal(stdout, "");
		});

		it("defaults to no arguments", () => {
			const { commandLine } = createNull();
			assert.deepEqual(commandLine.args(), []);
		});

		it("allows arguments to be configured", () => {
			const { commandLine } = createNull({ args: [ "one", "two" ] });
			assert.deepEqual(commandLine.args(), [ "one", "two" ]);
		});

	});

});

async function runModuleAsync(relativeModulePath: string, args?: string[]) {
	return await new Promise((resolve, reject) => {
		const absolutePath = pathToFile(import.meta.url, relativeModulePath);
		const child = childProcess.fork(absolutePath, args, { stdio: "pipe" });

		let stdout = "";
		let stderr = "";
		child.stdout!.on("data", (data) => {
			stdout += data;
		});
		child.stderr!.on("data", (data) => {
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

function createNull(options?: CommandLineResponses) {
	const commandLine = CommandLine.createNull(options);
	const output = commandLine.trackOutput();
	return { commandLine, output };
}
