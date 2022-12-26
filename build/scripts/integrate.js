// Copyright Titanium I.T. LLC.

import repo from "../util/repo.cjs";
import branches from "../config/branches.cjs";
import pathLib from "node:path";
import Colors from "../util/colors.cjs";

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
		console.log(Colors.brightGreen.inverse("\n   SUCCESS   \n"));
	}
	catch (err) {
		process.stdout.write(
			Colors.brightRed.inverse("\n   FAILED   \n") +
			Colors.brightRed(`${err.message}\n\n`)
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
	console.log(Colors.brightWhite.underline("\n" + message));
}