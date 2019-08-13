"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const target = `test${Date.now()}`;
        yield createCredentialTest(target);
        const cred = yield _1.getCredential(target);
        assert.deepStrictEqual(cred, { username: 'test', password: 'test' }, 'Invalid Credential.');
        yield deleteCredentialTest(target);
    });
}
function run() {
    test()
        .then(() => console.log('Test succesful!'), err => console.error('Error found', err));
}
run();
//# sourceMappingURL=test.js.map