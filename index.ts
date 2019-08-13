﻿
import * as path from 'path';
import { promisify } from 'util';
const exec = promisify(require('child_process').exec);

export interface ICredential { username: string, password: string }

const appRoot: string = path.resolve(__dirname);

function buildCredential(credStr: string): ICredential {
	const [username, password] = credStr.split(':');
	return {
		username,
		password,
	};
}

export function getCredential(target: string, pythonLancher: string = 'python'): Promise<ICredential> {
	const script = `${pythonLancher} ${appRoot}\\wincred.py ${target}`;
	return exec(script)
		.then(result => result.stdout.trim())
		.then(buildCredential);
}

export default getCredential;

