// Copyright Titanium I.T. LLC.

import CommandLine from "./infrastructure/command_line.cjs";
import rot13 from "./logic/rot13.cjs";
import App from "./app.cjs";

const commandLine = CommandLine.create();
App.create(commandLine, rot13).run();