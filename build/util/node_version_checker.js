// Copyright (c) 2013-2017 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

const { brightYellow } = require("./colors");

exports.check = function() {
	console.log("Checking Node.js version: .");

	const expectedVersion = "v" + require("../../package.json").engines.node;
	const actualVersion = process.version;

	if (actualVersion !== expectedVersion) {
		console.log(
			"\n" +
			brightYellow.inverse("CAUTION: Different Node version.\n") +
			brightYellow("This codebase was created for Node " + expectedVersion + ", but you have " + actualVersion + ".\n" +
			"If it doesn't work, try installing Node " + expectedVersion + ".") +
			"\n"
		);
	}

};


