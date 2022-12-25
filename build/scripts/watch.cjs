#!/usr/local/bin/node

// Automatically runs build when files change.
//
// Thanks to Davide Alberto Molin for inspiring this code.
// See https://www.letscodejavascript.com/v3/comments/live/7 for details.

const build = require("./build.cjs");
const gaze = require("gaze");
const pathLib = require("path");
const paths = require("../config/paths.cjs");
const sound = require("sound-play");
const sh = require("../util/sh.cjs");
const { cyan, brightRed } = require("../util/colors.cjs");

const watchColor = cyan;
const errorColor = brightRed.inverse;
const buildScript = pathLib.resolve(__dirname, "../scripts/run_build.cjs");

const args = process.argv.slice(2);
let buildRunning = false;
let buildQueued = false;
let buildStartedAt;

process.stdout.write("Starting file watcher: ");
gaze(paths.watchRestartFiles(), (err, watcher) => {
	if (err) {
		console.log(errorColor("WATCH ERROR:"), err);
		return;
	}
	watcher.on("all", () => {
		console.log(watchColor("*** Build files changed"));
		restart();
	});
});

gaze(paths.watchFiles(), function(err, watcher) {
	if (err) {
		console.log(errorColor("WATCH ERROR:"), err);
		return;
	}
	console.log(".\n");

	watcher.on("changed", triggerBuild.bind(null, "changed"));
	watcher.on("deleted", cleanAndRestart.bind(null, "deleted"));
	watcher.on("added", restart.bind(null, "added"));
	triggerBuild();    // Always run after startup
});


async function triggerBuild(event, filepath) {
	try {
		logEvent(event, filepath);
		if (!buildRunning) await runBuild();
		else queueAnotherBuild();
	}
	catch (err) {
		console.log(err);
	}
}

async function runBuild() {
	do {
		buildQueued = false;
		buildRunning = true;
		buildStartedAt = Date.now();
		console.log(watchColor(`\n\n\n\n*** BUILD> ${args.join(" ")}`));

		const { code } = await sh.runAsync("node", [ buildScript, ...args ]);
		alertBuildResult(code);

		buildRunning = false;
	} while (buildQueued);
}

function queueAnotherBuild() {
	if (buildQueued) return;
	if (debounce()) return;

	console.log(watchColor("*** Build queued"));
	buildQueued = true;

	function debounce() {
		const msSinceLastBuild = Date.now() - buildStartedAt;
		return msSinceLastBuild < 100;
	}
}

function alertBuildResult(exitCode) {
	playSoundAsync(pathForCode(exitCode));

	function pathForCode(exitCode) {
		switch (exitCode) {
			case 0: return "../sounds/success.wav";
			case 1: return "../sounds/lint_error.wav";
			case 2: return "../sounds/fail.wav";
			default: throw new Error(`Unrecognized exit code from build: ${exitCode}`);
		}
	}
}

async function cleanAndRestart(event, filepath) {
	await build.runAsync([ "clean" ]);
	restart();
}

function restart(event, filepath) {
	if (event !== undefined) logEvent(event, filepath);
	process.exit(0);
	// watch.sh will detect that process exited cleanly and restart it
}

function logEvent(event, filepath) {
	if (filepath === undefined) return;

	const truncatedPath = pathLib.basename(pathLib.dirname(filepath)) + "/" + pathLib.basename(filepath);
	console.log(watchColor(`*** ${event.toUpperCase()}: ${truncatedPath}`));
}

async function playSoundAsync(filename) {
	try {
		const path = pathLib.resolve(__dirname, filename);
		await sound.play(path, 0.3);
	}
	catch (err) {
		// If something goes wrong, just ignore it
	}
}
