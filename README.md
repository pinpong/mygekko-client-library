![NPM](https://img.shields.io/npm/l/mygekko-client-library)
![npm](https://img.shields.io/npm/v/mygekko-client-library)
![npm](https://img.shields.io/npm/dy/mygekko-client-library)
![GitHub issues](https://img.shields.io/github/issues/pinpong/mygekko-client-library)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/pinpong/mygekko-client-library/deploy)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/pinpong/mygekko-client-library/code_check)

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
  const blindsTrends = client.blinds.getTrends(
    '2023-01-01T00:00:00+01:00',
    '2023-01-06T00:00:00+01:00',
    500
  );
  console.log(blindsTrends);
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
  const blindsTrends = client.blinds.getTrends(
    '2023-01-01T00:00:00+01:00',
    '2023-01-06T00:00:00+01:00',
    500
  );
  console.log(blindsTrends);
} catch (e) {
  console.log(e);
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests.
```sh
yarn install && yarn prepare
```
