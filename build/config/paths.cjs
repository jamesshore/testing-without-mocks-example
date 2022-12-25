// Copyright (c) 2015-2018 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

const glob = require("glob");

exports.generatedDir = "generated";
exports.incrementalDir = `${exports.generatedDir}/incremental`;

exports.watchFiles = memoizedDeglob([
	"build/**/*",
	"src/**/*",
]);

exports.watchRestartFiles = memoizedDeglob([
	"build/**/*",
], [
	"build/node_modules/**/*",
]);

exports.lintFiles = memoizedDeglob([
	"*.js",
	"build/**/*.cjs",
	"src/**/*.cjs",
]);

exports.testFiles = memoizedDeglob([
	"build/**/_*_test.cjs",
	"src/**/_*_test.cjs",
]);

exports.testDependencies = memoizedDeglob([
	"build/**/*.cjs",
	"src/**/*.cjs",
], [
	"build/util/dependency_analysis.cjs"
]);


function memoizedDeglob(patternsToFind, patternsToIgnore) {
	return memoize(() => {
		return deglob(patternsToFind, patternsToIgnore);
	});
}

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

function deglob(patternsToFind, patternsToIgnore) {
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
}