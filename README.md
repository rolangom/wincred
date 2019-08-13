﻿# wincred

This node.js package is used to get credentials from the "Windows Credential Manager" using a Python3 script.
So, you need to have installed python>=3 and node>=8.

This package is based on this gist python script: https://gist.github.com/mrh1997/717b14f5783b49ca14310419fa7f03f6

How to install it using npm:

    npm i wincred -S

How to use it?

```javascript
import { getCredential } from 'wincred';

async function run() {
	const cred = await getCredential('credentialTarget'/*, 'c:/path-to/pythonLaucher' */); // optional, 'python' as default
	//... use the credential as { username: string, password: string }
}
```