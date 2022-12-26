// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

import child_process from "node:child_process";
import Colors from "./colors.js";

export function runAsync(command, args) {
	const argsString = args.map(arg => {
		arg = arg.replaceAll('"', '\\"');
		if (arg.includes(" ")) return `"${arg}"`;
		else return arg;
	}).join(" ");
	console.log(Colors.cyan(`» ${command} ${argsString}`));

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
}

export function runInteractive(command, args) {
	return spawnAsync(command, args, { stdio: "inherit" });
}

export function runSilentlyAsync(command, args) {
	return spawnAsync(command, args, { stdio: "ignore" });
}

function spawnAsync(command, args, options) {
	return new Promise((resolve, reject) => {
		const child = child_process.spawn(command, args, options);
		child.on("error", reject);
		child.on("exit", (code) => { resolve({ code }); });
	});
}