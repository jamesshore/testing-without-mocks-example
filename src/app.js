// Copyright Titanium I.T. LLC.

import { transform } from "./logic/rot13.js";

export default class App {

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
		const output = transform(input);
		this._commandLine.writeOutput(output + "\n");
	}

}