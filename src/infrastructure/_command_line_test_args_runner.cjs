// Copyright Titanium I.T. LLC.

const commandLine = require("./command_line.cjs").create();

const args = commandLine.args();
process.stdout.write(JSON.stringify(args));