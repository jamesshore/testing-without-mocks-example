// Copyright Titanium I.T. LLC.

import nodeVersionChecker from "../util/node_version_checker.cjs";
import build from "./build.cjs";

nodeVersionChecker.check();

build.runAsync(process.argv.slice(2)).then((failedTask) => {
	if (failedTask === null) process.exit(0);
	else if (failedTask === "lint") process.exit(1);
	else process.exit(2);
});
