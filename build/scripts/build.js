// Copyright Titanium I.T. LLC.

import Build from "../util/build_runner.js";
import DependencyAnalysis from "../util/dependency_analysis.js";
import * as paths from "../config/paths.js";
import * as lint from "../util/lint_runner.js";
import lintConfig from "../config/eslint.conf.js";
import shell from "shelljs"; shell.config.fatal = true;
import { runMochaAsync } from "../util/mocha_runner.js";
import mochaConfig from "../config/mocha.conf.js";
import Colors from "../util/colors.js";
import { pathToFile } from "../util/module_paths.js";
import * as sh from "../util/sh.js";

const successColor = Colors.brightGreen;
const failureColor = Colors.brightRed;

const rootDir = pathToFile(import.meta.url, "../..");

const build = new Build({ incrementalDir: `${paths.incrementalDir}/tasks/` });
const analysis = new DependencyAnalysis(build, rootDir, paths.testDependencies());

export async function runBuildAsync(args) {
	try {
		await build.runAsync(args, successColor.inverse("   BUILD OK   "));
		return null;
	}
	catch (err) {
		console.log(`\n${failureColor.inverse("   BUILD FAILURE   ")}\n${failureColor.bold(err.message)}`);
		return err.failedTask;
	}
}

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
		const success = await lint.validateFileAsync(lintFile, lintConfig);
		if (success) build.writeDirAndFileAsync(lintDependency, "lint ok");

		return success;
	});

	const successes = await Promise.all(lintPromises);
	const overallSuccess = successes.every((success) => success === true);
	if (!overallSuccess) throw new Error("Lint failed");

	process.stdout.write(footer);
});

build.incrementalTask("test", paths.testDependencies(), async () => {
	await build.runTasksAsync([ "compile" ]);

	process.stdout.write("Testing: ");
	await runMochaAsync({
		files: paths.testFiles(),
		options: mochaConfig,
	});
});

build.incrementalTask("compile", paths.compilerDependencies(), async () => {
	console.log("Compiling: .");

	const { code } = await sh.runInteractive("node_modules/.bin/tsc", []);
	if (code !== 0) throw new Error("Compile failed");
});


function lintDependencyName(filename) {
	return dependencyName(filename, "lint");
}

function dependencyName(filename, extension) {
	return `${paths.incrementalDir}/incremental/${build.rootRelativePath(rootDir, filename)}.${extension}`;
}