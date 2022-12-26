// Copyright Titanium I.T. LLC.

import * as sh from "./sh.js";

// Functions to do things to the git repository

export async function runBuildAsync() {
	await runAsync("./build.sh");
}

export async function hasUncommittedChangesAsync() {
	const { stdout } = await runAsync("git", "status", "--porcelain");
	return stdout !== "";
}

export async function runCodeInBranch(branch, fnAsync) {
	await runAsync("git", "checkout", branch);
	try {
		return await fnAsync();
	}
	finally {
		// switch back to previous branch when done
		await runAsync("git", "checkout", "-");
	}
}

export async function resetToFreshCheckoutAsync() {
	await runAsync("git", "reset", "--hard");
	await runAsync("git", "clean", "-fdx");
}

export async function mergeBranchWithCommitAsync(fromBranch, toBranch, message) {
	await runCodeInBranch(toBranch, async () => {
		await runAsync("git", "merge", fromBranch, "--no-ff", "--log", "-m", message);
	});
}

export async function mergeBranchWithoutCommitAsync(fromBranch, toBranch, message) {
	await runCodeInBranch(toBranch, async () => {
		await runAsync("git", "merge", fromBranch, "--ff-only");
	});
}

export async function rebaseAsync(fromBranch, toBranch) {
	await runCodeInBranch(fromBranch, async () => {
		await runAsync("git", "rebase", toBranch);
	});
}

export async function rebuildNpmPackagesAsync() {
	await runAsync("npm", "rebuild");
}

async function runAsync(command, ...args) {
	const result = await sh.runAsync(command, args);
	if (result.code !== 0) throw new Error(`${command} ${args[0]} failed`);

	return result;
}