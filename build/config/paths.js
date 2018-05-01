// Copyright (c) 2015-2018 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var glob = require("glob");
var path = require("path");

exports.generatedDir = "generated";
exports.tempTestfileDir = `${exports.generatedDir}/test`;
exports.incrementalDir = `${exports.generatedDir}/incremental`;

exports.lintFiles = function() {
	return deglob([
		"build/**/*.js",
		"build/**/*.jakefile",
		"src/**/*.js",
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
	]);
};

exports.serverCoreTestDependencies = function() {
	return deglob([
		"src/*.js",
	]);
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