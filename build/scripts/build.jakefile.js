// Copyright (c) 2012-2018 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global jake, desc, task, directory, file, complete, fail, globals:true, rule */
"use strict";

var startTime = Date.now();

var paths = require("../config/paths.js");

//*** GENERAL

jake.addListener("complete", function() {
	var elapsedSeconds = (Date.now() - startTime) / 1000;
	console.log("\n\n--++===[ BUILD OK ]===++--  (" + elapsedSeconds.toFixed(2) +  "s)");
});

desc("Delete all generated files");
task("clean", [], function() {
	jake.rmRf(paths.generatedDir);
});

desc("Build, lint, and test");
task("default", [ "clean", "quick" ]);

desc("Quick build; only lint and test changed files");
task("quick", [ "nodeVersion", "lint", "test" ]);


//*** LINT

desc("Lint everything");
task("lint", [ "lintLog", "incrementalLint" ], function() {
	console.log();
});

task("lintLog", function() { process.stdout.write("Linting JavaScript: "); });

createDirectoryTasks(paths.lintDirectories());
task("incrementalLint", [ ...paths.lintDirectories(), ...paths.lintOutput() ] );

rule(".lint", determineLintDependency, function() {
	var lint = require("../util/lint_runner.js");
	var lintConfig = require("../config/eslint.conf.js");

	var passed = lint.validateFile(this.source, lintConfig.options);
	if (passed) fs().writeFileSync(this.name, "lint ok");
	else fail("Lint failed");
});

function determineLintDependency(name) {
	var result = name.replace(/^generated\/incremental\/lint\//, "");
	return result.replace(/\.lint$/, "");
}

function createDirectoryTasks(directories) {
	directories.forEach(function(lintDirectory) {
		directory(lintDirectory);
	});
}


//*** TEST

desc("Test everything");
incrementalTask("test", [], paths.serverCoreTestDependencies(), function(complete, fail) {
	process.stdout.write("Testing: ");
	mochaRunner().runTests({
		files: paths.serverCoreTestFiles(),
		options: mochaConfig()
	}, complete, fail);
});


//*** VERSIONS

// Confirm that we're running same Node.js version as will be used in production
task("nodeVersion", function() {
	console.log("Checking Node.js version: .");
	var version = require("../util/version_checker.js");

	version.check({
		name: "Node",
		expected: require("../../package.json").engines.node,
		actual: process.version,
		strict: true
	}, complete, fail);
}, { async: true });


//*** UTILITY FUNCTIONS

function incrementalTask(taskName, taskDependencies, fileDependencies, action) {
	var tasksDir = `${paths.incrementalDir}/tasks`;
	var incrementalFile = `${tasksDir}/${taskName}.task`;

	directory(tasksDir);
	task(taskName, taskDependencies.concat(tasksDir, incrementalFile));
	file(incrementalFile, fileDependencies, function() {
		action(succeed, fail);
	}, {async: true});

	function succeed() {
		fs().writeFileSync(incrementalFile, "ok");
		complete();
	}
}


//*** LAZY-LOADED MODULES

function fs() {
	return require("fs");
}

function mochaRunner() {
	return require("../util/mocha_runner.js");
}

function mochaConfig() {
	return require("../config/mocha.conf.js");
}
