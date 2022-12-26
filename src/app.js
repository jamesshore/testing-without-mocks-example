// Copyright Titanium I.T. LLC.
import * as rot13 from "./logic/rot13.js";
import CommandLine from "./infrastructure/command_line.js";

export default class App {

	static create() {
		return new App(CommandLine.create());
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

}
