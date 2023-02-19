// Copyright Titanium I.T. LLC.

import { checkNodeVersion } from "../util/node_version_checker.js";
import { runBuildAsync } from "./build.js";

checkNodeVersion();

runBuildAsync(process.argv.slice(2)).then((failedTask) => {
	if (failedTask === null) process.exit(0);
	else if (failedTask === "lint" || failedTask === "compile") process.exit(1);
	else process.exit(2);
});
