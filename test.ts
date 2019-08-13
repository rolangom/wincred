﻿import * as assert from 'assert';
import { promisify } from 'util';
const exec = promisify(require('child_process').exec);
import { getCredential, ICredential } from '.';


function createCredentialTest(target: string): Promise<void> {
	return exec(`cmdkey /generic:${target} /user:test /pass:test`) as Promise<void>;
}

function deleteCredentialTest(target: string): Promise<void> {
	return exec(`cmdkey /delete ${target}`) as Promise<void>;
}

async function test() {
	const target = `test${Date.now()}`;
	await createCredentialTest(target);
	const cred = await getCredential(target);
	assert.deepStrictEqual(cred, { username: 'test', password: 'test' }, 'Invalid Credential.');
	await deleteCredentialTest(target);
}

function run() {
	test()
		.then(
			() => console.log('Test succesful!'),
			err => console.error('Error found', err)
		);
}

run();