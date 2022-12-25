#!/usr/local/bin/node

// Automatically restarts server when files change.
//
// Thanks to Davide Alberto Molin for inspiring this code.
// See https://www.letscodejavascript.com/v3/comments/live/7 for details.

"use strict";

require("../util/node_version_checker").check();

const gaze = require("gaze");
const pathLib = require("path");
const spawn = require("child_process").spawn;
const paths = require("../config/paths");
const sound = require("sound-play");
const { cyan, brightRed } = require("../util/colors");

const watchColor = cyan;
const errorColor = brightRed.inverse;

const COMMAND = "node";
const SERVE_JS = "src/serve.js";
const SERVE_FULL_PATH = pathLib.resolve(__dirname, "../..", SERVE_JS);
const COMMAND_ARGS = process.argv.slice(2);

let child = null;

process.stdout.write("Starting file watcher: ");
gaze(paths.watchFiles(), function(err, watcher) {
	if (err) {
		console.log(errorColor("WATCH ERROR:"), err);
		return;
	}
	console.log(".\nWill restart server when files change.\n");

	watcher.on("all", (event, filepath) => {
		logEvent(event, filepath);
		kill(run);
	});
	run();
});

function run() {
	if (child) return;

	console.log(watchColor(`> ${COMMAND} ${SERVE_JS} ${COMMAND_ARGS.join(" ")}`));
	child = spawn(COMMAND, [ SERVE_FULL_PATH, ...COMMAND_ARGS ], { stdio: "inherit" });
	child.on("exit", function() {
		console.log(watchColor(`${COMMAND} exited\n`));
		child = null;
	});
}

function kill(callback) {
	if (child === null) return callback();

	console.log(watchColor(`> kill ${COMMAND}`));
	child.kill();
	child.on("exit", callback);
}

function logEvent(event, filepath) {
	if (filepath === undefined) return;

	const truncatedPath = pathLib.basename(pathLib.dirname(filepath)) + "/" + pathLib.basename(filepath);
	console.log(watchColor(`${event.toUpperCase()}: ${truncatedPath}`));
}

