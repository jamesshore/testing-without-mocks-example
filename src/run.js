// Copyright Titanium I.T. LLC.

import CommandLine from "./infrastructure/command_line.js";
import App from "./app.js";

const commandLine = CommandLine.create();
App.create(commandLine).run();