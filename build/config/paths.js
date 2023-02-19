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
	"package.json",
	"tsconfig.json",
	"*.cmd",
	"*.sh",
], [
	"build/node_modules/**/*",
]);

export const lintFiles = memoizedDeglob([
	"*.js",
	"build/**/*.js",
	"src/**/*.js",
	"src/**/*.ts",
], [
	"build/util/node_version_checker.js",   // ESLint doesn't yet support import assertions
]);

export const testFiles = memoizedDeglob([
	"build/**/_*_test.js",
	"generated/typescript/**/_*_test.js",
	"generated/typescript/**/_*_test.ts",
]);

export const testDependencies = memoizedDeglob([
	"build/**/*.js",
	"generated/typescript/**/*.js",
	"generated/typescript/**/*.ts",
], [
	"build/util/dependency_analysis.js",
]);

export const compilerDependencies = memoizedDeglob([
	"src/**/*.js",
	"src/**/*.ts",
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