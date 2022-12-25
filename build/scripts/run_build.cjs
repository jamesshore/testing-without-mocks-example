// Copyright Titanium I.T. LLC.

require("../util/node_version_checker.cjs").check();

const build = require("./build.cjs");

build.runAsync(process.argv.slice(2)).then((failedTask) => {
	if (failedTask === null) process.exit(0);
	else if (failedTask === "lint") process.exit(1);
	else process.exit(2);
});
