// Copyright (c) 2012-2018 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

import eslint from "eslint";
import fs from "node:fs";
import { promisify } from "node:util";
import { Legacy } from "@eslint/eslintrc";
const { ConfigArrayFactory } = Legacy;

const linter = new eslint.Linter();

export function validateSource(sourceCode, options, description) {
	description = description ? description + " " : "";

	const configArrayFactory = new ConfigArrayFactory();
	const configArray = configArrayFactory.create(options);

	const messages = linter.verify(sourceCode, configArray);
	const pass = (messages.length === 0);

	if (pass) {
		process.stdout.write(".");
	}
	else {
		console.log("\n" + description + "failed");
		messages.forEach(function(error) {
			const code = eslint.SourceCode.splitLines(sourceCode)[error.line - 1];
			if (error.line !== 0) console.log(error.line + ": " + code?.trim());
			console.log("   " + error.message);
		});
	}
	return pass;
}

export async function validateFileAsync(filename, options) {
	const sourceCode = await promisify(fs.readFile)(filename, "utf8");
	return validateSource(sourceCode, options, filename);
}
