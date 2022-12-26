// Copyright Titanium I.T. LLC.
import path from 'path';
import { fileURLToPath } from 'url';

export function pathToFile(moduleUrl, relativeFilePath) {
	const modulePath = fileURLToPath(moduleUrl);
	return path.resolve(path.dirname(modulePath), relativeFilePath);
}
