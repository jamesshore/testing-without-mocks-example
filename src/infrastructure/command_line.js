// Copyright Titanium I.T. LLC.
import OutputTracker from "./output_tracker.js";
import EventEmitter from "node:events";

const OUTPUT_EVENT = "output";

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
		this._emitter = new EventEmitter();
	}

	args() {
		return this._process.argv.slice(2);
	}

	writeOutput(text) {
		this._process.stdout.write(text);
		this._emitter.emit(OUTPUT_EVENT, text);
	}

	trackOutput() {
		return OutputTracker.create(this._emitter, OUTPUT_EVENT);
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