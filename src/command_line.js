// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class CommandLine {

	static create() {
		return new CommandLine(process, console);
	}

	static createNull(arg) {
		return new CommandLine(new NullProcess(arg), new NullConsole());
	}

	constructor(proc, cons) {
		this._process = proc;
		this._console = cons;
	}

	arg() {
		return this._process.argv[2];
	}

	output(data) {
		this._console.log(data);
		this._lastOutput = data;
	}

	getLastOutput() {
		return this._lastOutput;
	}

};


//*** Nulls

class NullProcess {
	constructor(arg) {
		this._arg = arg;
	}
	get argv() {
		return [ undefined, undefined, this._arg ];
	}
}

class NullConsole {
	log() {}
}