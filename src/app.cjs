// Copyright Titanium I.T. LLC.

const rot13 = require("./logic/rot13.cjs");

module.exports = class App {

	static create(commandLine) {
		return new App(commandLine);
	}

	constructor(commandLine) {
		this._commandLine = commandLine;
	}

	run() {
		const args = this._commandLine.args();
		if (args.length === 0) {
			this._commandLine.writeOutput("Usage: run text_to_transform\n");
			return;
		}
		if (args.length !== 1) {
			this._commandLine.writeOutput("too many arguments\n");
			return;
		}

		const input = args[0];
		const output = rot13.transform(input);
		this._commandLine.writeOutput(output + "\n");
	}

};