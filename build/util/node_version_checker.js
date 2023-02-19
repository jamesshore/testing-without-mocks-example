// Copyright (c) 2013-2017 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.

import Colors from "./colors.js";
import { readFileSync } from "node:fs";

export function checkNodeVersion() {
	console.log("Checking Node.js version: .");

	const packageJson = JSON.parse(readFileSync("package.json", "utf-8"));

	const expectedVersion = "v" + packageJson.engines.node;
	const actualVersion = process.version;

	if (actualVersion !== expectedVersion) {
		console.log(
			"\n" +
			Colors.brightYellow.inverse("CAUTION: Different Node version.\n") +
			Colors.brightYellow("This codebase was created for Node " + expectedVersion + ", but you have " + actualVersion + ".\n" +
			"If it doesn't work, try installing Node " + expectedVersion + ".") +
			"\n"
		);
	}

};


