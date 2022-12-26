// Copyright Titanium I.T. LLC.

import CommandLine from "./command_line.js";

const commandLine = CommandLine.create();
const args = commandLine.args();
process.stdout.write(JSON.stringify(args));