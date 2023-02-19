// Copyright Titanium I.T. LLC.
import OutputListener from "./output_listener.js";

export default class CommandLine {

	static create() {
		return new CommandLine(process);
	}

	static createNull({
		args = [],
	} = {}) {
		return new CommandLine(new StubbedProcess(args));
	}

	constructor(proc) {
		this._process = proc;
		this._listener = new OutputListener();
	}

	args() {
		return this._process.argv.slice(2);
	}

	writeOutput(text) {
		this._process.stdout.write(text);
		this._listener.emit(text);
	}

	trackOutput() {
		return this._listener.trackOutput();
	}

}


class StubbedProcess {

	constructor(args) {
		this._args = args;
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