// Copyright Titanium I.T. LLC.
import path from 'path';
import { fileURLToPath } from 'url';

export function pathToFile(moduleUrl: string, relativeFilePath: string): string {
	const modulePath = fileURLToPath(moduleUrl);
	return path.resolve(path.dirname(modulePath), relativeFilePath);
}
