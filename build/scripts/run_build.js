// Copyright Titanium I.T. LLC.
"use strict";

const build = require("./build");

build.runAsync(process.argv.slice(2)).then((failedTask) => {
	if (failedTask === null) process.exit(0);
	else process.exit(1);
});
