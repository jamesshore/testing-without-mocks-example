// Copyright Titanium I.T. LLC.
import { OutputListener } from "./output_listener.js";

interface Process {
	get argv(): string[];
	get stdout(): {
		write(text: string): void;
	};
}

export interface CommandLineResponses {
	args?: string[];
}

export type CommandLineOutput = string;

export class CommandLine {

	declare _listener: OutputListener<CommandLineOutput>;

	static create() {
		return new CommandLine(process);
	}

	static createNull({
		args = [],
	}: CommandLineResponses = {}) {
		return new CommandLine(new StubbedProcess(args));
	}

	constructor(readonly _process : Process) {
		this._listener = new OutputListener();
	}

	args() {
		return this._process.argv.slice(2);
	}

	writeOutput(text: string) {
		this._process.stdout.write(text);
		this._listener.emit(text);
	}

	trackOutput() {
		return this._listener.trackOutput();
	}

}


class StubbedProcess implements Process {

	constructor(readonly _args: string[]) {
	}

	get argv() {
		return [ "stubbed_process_node", "stubbed_process_script.js", ...this._args ];
	}

	get stdout() {
		return {
			write() {},
		};
	}

}