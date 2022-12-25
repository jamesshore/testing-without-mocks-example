// Copyright Titanium I.T. LLC.

const commandLine = require("./infrastructure/command_line.cjs").create();
const rot13 = require("./logic/rot13.cjs");
const App = require("./app.cjs");

App.create(commandLine, rot13).run();