// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
"use strict";

const child_process = require("child_process");

exports.runAsync = function(command, args) {
	console.log(`> ${command} ${args.join(" ")}`);
	return new Promise((resolve, reject) => {
		let stdout = "";
		const child = child_process.spawn(command, args);
		child.stdout.on("data", (data) => {
			stdout += data;
			process.stdout.write(data);
		});
		child.stderr.on("data", (data) => {
			process.stderr.write(data);
		});
		child.on("error", reject);
		child.on("exit", (code) => {
			resolve({ code, stdout });
		});
	});
};

exports.runInteractive = function(command, args) {
	return spawnAsync(command, args, { stdio: "inherit" });
};

exports.runSilentlyAsync = function(command, args) {
	return spawnAsync(command, args, { stdio: "ignore" });
};

function spawnAsync(command, args, options) {
	return new Promise((resolve, reject) => {
		const child = child_process.spawn(command, args, options);
		child.on("error", reject);
		child.on("exit", (code) => { resolve({ code }); });
	});
}