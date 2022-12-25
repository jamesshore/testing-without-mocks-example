// Copyright Titanium I.T. LLC.
"use strict";

const pathLib = require("path");

// Matches 'require("file")' and detects if it has '//' in front.
const REQUIRE_REGEX = /(\/\/)?.*?\brequire\s*?\(["'](.*?)["']/;

// Matches '// dependency_analysis: file'. For manually specifying dependencies that don't need require(). One per line.
const COMMENT_REGEX = /\/\/?\s*?dependency_analysis:\s*(.*?)\s*$/;

module.exports = class DependencyAnalysis {

	constructor(build, rootDir, eligibleFiles) {
		this._build = build;
		this._rootDir = rootDir;
		this._eligibleFiles = eligibleFiles;
		this._analysisCache = {};
	}

	async isDependencyModifiedAsync(file, fileToCompareAgainst) {
		const allDependencies = await this._getAllDependenciesAsync(file);
		const isNewer = await Promise.all(allDependencies.map(async (dependency) => {
			return await this._build.isModifiedAsync(dependency, fileToCompareAgainst);
		}));
		return isNewer.some((dependencyIsNewer) => dependencyIsNewer);
	}

	async updateAnalysisAsync() {
		await Promise.all(this._eligibleFiles.map(async (file) => {
			if (await isCachedAnalysisOutdated(this, file)) await performAnalysisAndCachePromise(this, file);
		}));
	}

	async _getAllDependenciesAsync(file, result = []) {
		if (result.includes(file)) return result;

		result.push(file);
		const directDependencies = (await getAnalysisAsync(this, file)).dependencies;
		await Promise.all(directDependencies.map(async (dependency) => {
			await this._getAllDependenciesAsync(dependency, result);
		}));

		return result;
	}

};

async function isCachedAnalysisOutdated(self, file) {
	const analysis = await self._analysisCache[file];
	if (analysis === undefined) return true;
	return await self._build.isNewerThanAsync(file, analysis.analyzedAt);

}

async function getAnalysisAsync(self, file) {
	if (self._analysisCache[file] === undefined) performAnalysisAndCachePromise(self, file);
	try {
		return await self._analysisCache[file];
	}
	catch (err) {
		delete self._analysisCache[file];   // don't cache failed analysis
		throw err;
	}
}

function performAnalysisAndCachePromise(self, file) {
	const analysisPromise = performAnalysisAsync();
	self._analysisCache[file] = analysisPromise;

	async function performAnalysisAsync() {
		const analyzedAt = Date.now();
		const fileContents = await self._build.readFileAsync(file);
		return {
			analyzedAt,
			dependencies: analyzeRequireStatements(self, file, fileContents),
		};
	}
}

function analyzeRequireStatements(self, file, fileContents) {
	const basedir = pathLib.dirname(file);
	return fileContents
		.split("\n")
		.map((line, index) => analyzeLine(line, index))
		.filter((line) => line !== null);

	function analyzeLine(line, index) {
		const dependency = getLineDependency(line);
		if (dependency === null) return null;

		try {
			const result = self._build.rootRelativePath(self._rootDir, require.resolve(dependency, { paths: [basedir] }));
			if (!self._eligibleFiles.includes(result)) return null;
			else return result;
		}
		catch(err) {
			if (err.code === "MODULE_NOT_FOUND") {
				throw new Error(
					"Dependency analysis failed\n" +
					`Cannot find module '${dependency}' in '${file}'.\n  line ${index + 1}: ${line.trim()}`);
			}
			else {
				throw err;
			}
		}
	}

	function getLineDependency(line) {
		const requireMatch = line.match(REQUIRE_REGEX);
		const commentMatch = line.match(COMMENT_REGEX);

		if (requireMatch !== null && requireMatch[1] !== "//") return requireMatch[2];
		else if (commentMatch !== null) return commentMatch[1];
		else return null;
	}
}
