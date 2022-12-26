// Copyright Titanium I.T. LLC.

import CommandLine from "./infrastructure/command_line.js";
import rot13 from "./logic/rot13.js";
import App from "./app.js";

const commandLine = CommandLine.create();
App.create(commandLine, rot13).run();