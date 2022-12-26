// Copyright Titanium I.T. LLC.
import assert from "../util/assert.js";
import childProcess from "node:child_process";
import CommandLine from "./command_line.js";
import { pathToFile } from "../util/modulePaths.js";

describe("CommandLine", () => {

	describe("output", () => {

		it("writes to stdout", async () => {
			const stdout = await runModuleAsync("./_command_line_test_output_runner.js");
			assert.equal(stdout, "my output");
		});

		it("remembers last output", () => {
			const commandLine = CommandLine.createNull();
			commandLine.writeOutput("my last output");
			assert.equal(commandLine.getLastOutput(), "my last output");
		});

		it("last output is undefined when nothing has been output yet", () => {
			const commandLine = CommandLine.createNull();
			assert.isUndefined(commandLine.getLastOutput());
		});

	});


	describe("arguments", () => {

		it("provides command-line arguments", async () => {
			const args = [ "my arg 1", "my arg 2" ];
			const stdout = await runModuleAsync("./_command_line_test_args_runner.js", args);
			assert.equal(stdout, '["my arg 1","my arg 2"]');
		});

	});


	describe("Nullable", () => {

		it("doesn't write to stdout", async () => {
			const stdout = await runModuleAsync("./_command_line_test_null_output_runner.js");
			assert.equal(stdout, "");
		});

		it("defaults to no arguments", () => {
			const commandLine = CommandLine.createNull();
			assert.deepEqual(commandLine.args(), []);
		});

		it("allows arguments to be configured", () => {
			const commandLine = CommandLine.createNull({ args: [ "one", "two" ] });
			assert.deepEqual(commandLine.args(), [ "one", "two" ]);
		});

	});

});

async function runModuleAsync(relativeModulePath, args) {
	return await new Promise((resolve, reject) => {
		const absolutePath = pathToFile(import.meta.url, relativeModulePath);
		const child = childProcess.fork(absolutePath, args, { stdio: "pipe" });

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
