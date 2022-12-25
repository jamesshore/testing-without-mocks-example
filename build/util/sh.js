// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
"use strict";

const child_process = require("child_process");
const { cyan } = require("../util/colors");

exports.runAsync = function(command, args) {
	const argsString = args.map(arg => {
		arg = arg.replaceAll('"', '\\"');
		if (arg.includes(" ")) return `"${arg}"`;
		else return arg;
	}).join(" ");
	console.log(cyan(`» ${command} ${argsString}`));

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