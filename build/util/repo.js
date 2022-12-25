// Copyright Titanium I.T. LLC.
"use strict";

const sh = require("./sh");

// Functions to do things to the git repository

exports.runBuildAsync = async function() {
	await runAsync("./build.sh");
};

exports.hasUncommittedChangesAsync = async function() {
	const { stdout } = await runAsync("git", "status", "--porcelain");
	return stdout !== "";
};

exports.runCodeInBranch = async function(branch, fnAsync) {
	await runAsync("git", "checkout", branch);
	try {
		return await fnAsync();
	}
	finally {
		// switch back to previous branch when done
		await runAsync("git", "checkout", "-");
	}
};

exports.resetToFreshCheckoutAsync = async function() {
	await runAsync("git", "reset", "--hard");
	await runAsync("git", "clean", "-fdx");
};

exports.mergeBranchWithCommitAsync = async function(fromBranch, toBranch, message) {
	await exports.runCodeInBranch(toBranch, async () => {
		await runAsync("git", "merge", fromBranch, "--no-ff", "--log", "-m", message);
	});
};

exports.mergeBranchWithoutCommitAsync = async function(fromBranch, toBranch, message) {
	await exports.runCodeInBranch(toBranch, async () => {
		await runAsync("git", "merge", fromBranch, "--ff-only");
	});
};

exports.rebaseAsync = async function(fromBranch, toBranch) {
	await exports.runCodeInBranch(fromBranch, async () => {
		await runAsync("git", "rebase", toBranch);
	});
};

exports.rebuildNpmPackagesAsync = async function() {
	await runAsync("npm", "rebuild");
};

async function runAsync(command, ...args) {
	const result = await sh.runAsync(command, args);
	if (result.code !== 0) throw new Error(`${command} ${args[0]} failed`);

	return result;
}