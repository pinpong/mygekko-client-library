## Installation

```sh
yarn add mygekko-client-library
```

### Using the client library

This is a very simple example. This creates a remote client and retrieves the details of all blinds:

```js
import { RemoteClient } from 'mygekko-client-library';

const client = new RemoteClient({
  username: 'test@test.com',
  gekkoId: 'XXXX-XXXX-XXXX-XXXX',
  apiKey: 'damnSecure',
});

try {
  const blinds = client.blinds.getAll();
  console.log(blinds);
  await client.blinds.setPosition('item0', 75);
} catch (e) {
  console.log(e);
}
```

And this creates a local client and retrieves the details of all blinds:

```js
import { LocalClient } from 'mygekko-client-library';

const client = new LocalClient({
  ip: '127.0.1',
  username: 'user',
  password: 'damnSecure',
});

try {
  const blinds = client.blinds.getAll();
  console.log(blinds);
  await client.blinds.setPosition('item0', 75);
} catch (e) {
  console.log(e);
}
```
