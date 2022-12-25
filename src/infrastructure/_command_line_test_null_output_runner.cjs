// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./command_line.cjs");

CommandLine.createNull().writeOutput("this output should never be seen");