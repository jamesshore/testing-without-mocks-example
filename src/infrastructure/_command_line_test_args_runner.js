// Copyright Titanium I.T. LLC.
"use strict";

const commandLine = require("./command_line").create();

const args = commandLine.args();
process.stdout.write(JSON.stringify(args));