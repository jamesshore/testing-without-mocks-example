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
import { pathToFile } from "../../src/util/modulePaths.js";

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

// incrementalTestsTask("test", "Testing", paths.testFiles());
allTestsTask("test", "Testing", paths.testFiles(), paths.testDependencies());


function incrementalTestsTask(taskName, header, candidateTestFiles) {
	build.task(taskName, async () => {
		await analysis.updateAnalysisAsync();

		const testFilePromises = candidateTestFiles.map(async (testFile) => {
			const dependencyModified = await analysis.isDependencyModifiedAsync(testFile, testDependencyName(testFile));
			if (dependencyModified) return testFile;
			else return null;
		});
		const testFiles = (await Promise.all(testFilePromises)).filter((testFile) => testFile !== null);
		if (testFiles.length === 0) return;

		await runTestsAsync(header, testFiles);
		await Promise.all(testFiles.map(async (testFile) => {
			await build.writeDirAndFileAsync(testDependencyName(testFile), "test ok");
		}));
	});
}

function allTestsTask(taskName, header, testFiles, testDependencies) {
	build.incrementalTask(taskName, testDependencies, async () => {
		await runTestsAsync(header, testFiles);
	});
}

async function runTestsAsync(header, testFiles) {
	process.stdout.write(`${header}: `);
	await runMochaAsync({
		files: testFiles,
		options: mochaConfig,
	});
}

function lintDependencyName(filename) {
	return dependencyName(filename, "lint");
}

function testDependencyName(filename) {
	return dependencyName(filename, "test");
}

function dependencyName(filename, extension) {
	return `${paths.incrementalDir}/incremental/${build.rootRelativePath(rootDir, filename)}.${extension}`;
}