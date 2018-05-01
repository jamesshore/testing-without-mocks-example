// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./command_line.js");

module.exports = class App {

	constructor(cli = CommandLine.create()) {
		this._cli = cli;
	}

	run() {
		const data = this._cli.arg();
		this._cli.output(rot13(data));
	}

};

// Courtesy of https://stackoverflow.com/a/617685
function rot13(data) {
	return data.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
}