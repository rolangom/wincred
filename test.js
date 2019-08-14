"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const util_1 = require("util");
const exec = util_1.promisify(require('child_process').exec);
const _1 = require(".");
function createCredentialTest(target) {
    return exec(`cmdkey /generic:${target} /user:test /pass:test`);
}
function deleteCredentialTest(target) {
    return exec(`cmdkey /delete ${target}`);
}
async function test() {
    const target = `test${Date.now()}`;
    await createCredentialTest(target);
    const cred = await _1.getCredential(target);
    assert.deepStrictEqual(cred, { username: 'test', password: 'test' }, 'Invalid Credential.');
    await deleteCredentialTest(target);
}
function run() {
    test()
        .then(() => console.log('Test succesful!'), err => console.error('Error found', err));
}
run();
