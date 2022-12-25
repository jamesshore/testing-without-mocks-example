// Copyright Titanium I.T. LLC.
"use strict";

require("../util/node_version_checker").check();

const Build = require("../util/build_runner");
const paths = require("../config/paths");
const lint = require("../util/lint_runner");
const lintConfig = require("../config/eslint.conf");
const pathLib = require("path");
const shell = require("shelljs"); shell.config.fatal = true;
const mochaRunner = require("../util/mocha_runner");
const mochaConfig = require("../config/mocha.conf");

const build = new Build({ incrementalDir: `${paths.incrementalDir}/tasks/` });

exports.runAsync = async function(args) {
	try {
		await build.runAsync(args, "✅  BUILD OK ✅");
		return null;
	}
	catch (err) {
		console.log(`\n🚨  BUILD FAILURE 🚨\n${err.message}`);
		return err.failedTask;
	}
};

build.task("default", async() => {
	await build.runTasksAsync([ "clean", "quick" ]);
});

build.task("quick", async () => {
	await build.runTasksAsync([ "lint", "test" ]);
});

build.task("clean", () => {
	console.log("Deleting generated files: .");
	shell.rm("-rf", `${paths.generatedDir}/*`);
});

build.task("lint", async () => {
	let header = "Linting: ";
	let footer = "";

	const lintPromises = paths.lintFiles().map(async (lintFile) => {
		const lintDependency = lintDependencyName(lintFile);
		const modified = await build.isModifiedAsync(lintFile, lintDependency);
		if (!modified) return true;

		process.stdout.write(header);
		header = "";
		footer = "\n";
		const success = await lint.validateFileAsync(lintFile, lintConfig.options);
		if (success) build.writeDirAndFileAsync(lintDependency, "lint ok");

		return success;
	});

	const successes = await Promise.all(lintPromises);
	const overallSuccess = successes.every((success) => success === true);
	if (!overallSuccess) throw new Error("Lint failed");

	process.stdout.write(footer);
});

build.incrementalTask("test", paths.testDependencies(), async () => {
	process.stdout.write("Testing: ");
	await runTestsAsync(paths.testFiles());
});

async function runTestsAsync(testFiles) {
	await mochaRunner.runTestsAsync({
		files: testFiles,
		options: mochaConfig,
	});
}

function lintDependencyName(lintFilename) {
	const rootDir = pathLib.resolve(__dirname, "..");
	const filenameRelativeToRoot = lintFilename.replace(rootDir, "");
	return `${paths.incrementalDir}/lint/${filenameRelativeToRoot}.lint`;
}
