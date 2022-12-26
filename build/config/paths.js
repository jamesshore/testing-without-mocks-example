// Copyright (c) 2015-2018 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.

import glob from "glob";

export const generatedDir = "generated";
export const incrementalDir = `${generatedDir}/incremental`;

export const watchFiles = memoizedDeglob([
	"build/**/*",
	"src/**/*",
]);

export const watchRestartFiles = memoizedDeglob([
	"build/**/*",
], [
	"build/node_modules/**/*",
]);

export const lintFiles = memoizedDeglob([
	"*.js",
	"build/**/*.cjs",
	"src/**/*.cjs",
	"build/**/*.js",
	"src/**/*.js",
], [
	"build/util/node_version_checker.js",   // ESLint doesn't yet support import assertions
]);

export const testFiles = memoizedDeglob([
	"build/**/_*_test.cjs",
	"src/**/_*_test.cjs",
	"build/**/_*_test.js",
	"src/**/_*_test.js",
]);

export const testDependencies = memoizedDeglob([
	"build/**/*.cjs",
	"src/**/*.cjs",
	"build/**/*.js",
	"src/**/*.js",
], [
	"build/util/dependency_analysis.cjs",
	"build/util/dependency_analysis.js",
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