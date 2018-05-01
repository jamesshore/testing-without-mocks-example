// Copyright (c) 2015-2018 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var glob = require("glob");
var path = require("path");

exports.generatedDir = "generated";
exports.tempTestfileDir = `${exports.generatedDir}/test`;
exports.incrementalDir = `${exports.generatedDir}/incremental`;

exports.lintFiles = function() {
	return deglob([
		"*.js",
		"*.jakefile",
		"build/**/*.js",
		"build/**/*.jakefile",
		"src/**/*.js",
		"spikes/**/*.js"
	], [
		"src/lets_code_javascript/www/v3/vendor/**/*.js",
		"src/lets_code_javascript/client/vendor_dev/**/*.js",
		"src/shared/vendor/**/*.js",
		"spikes/**/node_modules/**/*",
		"spikes/**/vendor/**/*"
	]);
};

exports.lintOutput = function() {
	return exports.lintFiles().map(function(pathname) {
		return `${exports.incrementalDir}/lint/${pathname}.lint`;
	});
};

exports.lintDirectories = function() {
	return exports.lintOutput().map(function(lintDependency) {
		return path.dirname(lintDependency);
	});
};

exports.serverCoreTestFiles = function() {
	return deglob([
		"src/_*_test.js",
		"src/server/**/_*_test.js",
		"src/shared/**/_*_test.js",
		"src/tools/**/_*_test.js",
	], [
		...exports.smokeTestFiles(),
	]);
};

exports.serverCoreTestDependencies = function() {
	return deglob([
		"src/*.js",
		"src/server/**/*.js",
		"src/shared/**/*.js",
		"src/tools/**/*.js",
	], [
			...exports.smokeTestFiles(),
		"src/server/run.js"
	]);
};

exports.serverContentTestFiles = function() {
	return deglob([
		"src/lets_code_javascript/**/_*_test.js"
	], [
		...exports.smokeTestFiles(),
		...exports.clientTestDependencies()
	]);
};

exports.serverContentTestDependencies = function() {
	return deglob([
		"src/lets_code_javascript/**/*.js",
		...exports.serverCoreTestDependencies(),
	], [
		...exports.smokeTestFiles(),
		...exports.clientTestDependencies(),
	]);
};

exports.clientTestDependencies = function() {
	return deglob([
		"src/lets_code_javascript/client/**/*.js",
		"src/shared/**/*.js"
	]);
};

exports.smokeTestFiles = function() {
	return deglob([ "src/**/_smoke_test.js" ]);
};

exports.smokeTestDependencies = function() {
	return [
		...exports.smokeTestFiles(),
		"src/_run_server.js",
		"src/server/run.js",
		"src/server/globals.js",
		"src/server/cms/cms_server.js",
		"src/server/cms/http_server.js",
	];
};

exports.cssFile = function() {
	// Be sure to update master template if CSS file location changes
	return "src/lets_code_javascript/www/v3/css/screen.css";
};

exports.cssDependencies = function() {
	return deglob("src/lets_code_javascript/client/sass/**/*.scss");
};

function deglob(patternsToFind, patternsToIgnore) {
	var globPattern = patternsToFind;
	if (Array.isArray(patternsToFind)) {
		if (patternsToFind.length === 1) {
			globPattern = patternsToFind[0];
		}
		else {
			globPattern = "{" + patternsToFind.join(",") + "}";
		}
	}

	return glob.sync(globPattern, { ignore: patternsToIgnore });
}