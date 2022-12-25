// Copyright (c) 2015-2018 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

const glob = require("glob");
const path = require("path");

exports.generatedDir = "generated";
exports.incrementalDir = `${exports.generatedDir}/incremental`;

exports.lintFiles = memoize(() => {
	return deglob([
		"*.js",
		"build/**/*.js",
		"src/**/*.js",
	], [
	]);
});

exports.lintOutput = memoize(() => {
	return exports.lintFiles().map(function(pathname) {
		return `${exports.incrementalDir}/lint/${pathname}.lint`;
	});
});

exports.lintDirectories = memoize(() => {
	return exports.lintOutput().map(function(lintDependency) {
		return path.dirname(lintDependency);
	});
});

exports.testFiles = memoize(() => {
	return deglob([
		"src/**/_*_test.js",
	], [
	]);
});

exports.testDependencies = memoize(() => {
	return deglob([
		"src/**/*.js",
	], [
	]);
});


const deglob = exports.deglob = function(patternsToFind, patternsToIgnore) {
	let globPattern = patternsToFind;
	if (Array.isArray(patternsToFind)) {
		if (patternsToFind.length === 1) {
			globPattern = patternsToFind[0];
		}
		else {
			globPattern = "{" + patternsToFind.join(",") + "}";
		}
	}

	return glob.sync(globPattern, { ignore: patternsToIgnore });
};


// Cache function results for performance
function memoize(fn) {
	let cache;
	return function() {
		if (cache === undefined) {
			cache = fn();
		}
		return cache;
	};
}