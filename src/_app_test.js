// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const App = require("./app.js");
const CommandLine = require("./command_line.js");

describe("ROT-13 App", function() {

	it("encodes hello", function() {
		const cli = CommandLine.createNull("my_cli_arg");
		const app = new App(cli);

		app.run();
		assert.equal(cli.getLastOutput(), "zl_pyv_net");
	});

});