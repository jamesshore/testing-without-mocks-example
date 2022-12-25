// Copyright Titanium I.T. LLC.

const build = require("./build.cjs");

build.runAsync(process.argv.slice(2)).then((failedTask) => {
	if (failedTask === null) process.exit(0);
	else process.exit(1);
});
