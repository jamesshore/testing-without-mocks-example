// Copyright Titanium I.T. LLC.
"use strict";

const repo = require("../util/repo");
const branches = require("../config/branches");
const pathLib = require("path");
const { brightRed, brightGreen, brightWhite } = require("../util/colors");

runAsync();

async function runAsync() {
	const args = process.argv;
	if (args.length !== 3) {
		const name = pathLib.basename(process.argv[1]).split(".")[0];
		console.log(`Usage: ${name} "commit message"`);
		return;
	}

	try {
		await integrateAsync(args[2]);
		console.log(brightGreen.inverse("\n   SUCCESS   \n"));
	}
	catch (err) {
		process.stdout.write(
			brightRed.inverse("\n   FAILED   \n") +
			brightRed(`${err.message}\n\n`)
		);
	}
}

async function integrateAsync(message) {
	writeHeader("Checking repository");
	await ensureNothingToCheckIn("Commit changes before integrating");

	writeHeader("Checking npm");
	await ensureNpmBuildFilesAreIgnored();

	writeHeader("Running build");
	await repo.runBuildAsync();

	try {
		writeHeader("Performing integration");
		await repo.mergeBranchWithCommitAsync(branches.dev, branches.integration, `INTEGRATE: ${message}`);
		await repo.mergeBranchWithoutCommitAsync(branches.integration, branches.dev);
	}
	catch (err) {
		writeHeader("Failed; resetting repository");
		await repo.resetToFreshCheckoutAsync();
		throw err;
	}

	writeHeader("Rebasing challenge branches");
	for (let i = 0; i < branches.challenges.length; i++) {
		await repo.rebaseAsync(branches.challenges[i], branches.integration);
	}
}

async function ensureNpmBuildFilesAreIgnored() {
	await repo.runCodeInBranch(branches.dev, async () => {
		await repo.rebuildNpmPackagesAsync(branches.dev);
		await ensureNothingToCheckIn("Need to ignore NPM build files");
	});
}

async function ensureNothingToCheckIn(errorMessage) {
	if (await repo.hasUncommittedChangesAsync()) throw new Error(errorMessage);
}

function writeHeader(message) {
	console.log(brightWhite.underline("\n" + message));
}