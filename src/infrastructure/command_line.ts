// Copyright Titanium I.T. LLC.
import { OutputListener, OutputTracker } from "./output_listener.js";

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

	private readonly _listener: OutputListener<CommandLineOutput>;

	static create(): CommandLine {
		return new CommandLine(process);
	}

	static createNull({
		args = [],
	}: CommandLineResponses = {}): CommandLine {
		return new CommandLine(new StubbedProcess(args));
	}

	constructor(private readonly _process : Process) {
		this._listener = new OutputListener();
	}

	args(): readonly string[] {
		return this._process.argv.slice(2);
	}

	writeOutput(text: string): void {
		this._process.stdout.write(text);
		this._listener.emit(text);
	}

	trackOutput(): OutputTracker<CommandLineOutput> {
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