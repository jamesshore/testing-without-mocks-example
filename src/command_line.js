// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class CommandLine {

	static create() {
		return new CommandLine();
	}

	arg() {
		return process.argv[1];
	}

};