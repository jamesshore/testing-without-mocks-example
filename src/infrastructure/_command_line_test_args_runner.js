// Copyright Titanium I.T. LLC.
import CommandLine from "./command_line.js";

const args = CommandLine.create().args();
process.stdout.write(JSON.stringify(args));