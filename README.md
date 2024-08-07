![NPM](https://img.shields.io/npm/l/mygekko-client-library)
![npm](https://img.shields.io/npm/v/mygekko-client-library)
![npm](https://img.shields.io/npm/dy/mygekko-client-library)
![GitHub issues](https://img.shields.io/github/issues/pinpong/mygekko-client-library)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/pinpong/mygekko-client-library/deploy_release.yml?label=lint)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/pinpong/mygekko-client-library/deploy_release.yml?label=release%20build)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/pinpong/mygekko-client-library/deploy_docs.yml?label=release%20docs)

## Documentation

For more detailed documentation see [docs](https://pinpong.github.io/mygekko-client-library)

## Installation

```sh
yarn add mygekko-client-library
```

### Using the client library

This is a very simple example. This creates a remote client and retrieves the details of all blinds:

```js
import { RemoteClient } from 'mygekko-client-library';

const client = new RemoteClient({
  username: '<your-mygekko-user-email>',
  gekkoId: '<your-gekko-id>',
  apiKey: '<your-mygekko-api-remote-key>',
});

try {
  const blinds = client.blinds.getItems();
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
  ip: '<your-mygekko-ip-address>',
  username: '<your-mygekko-username>',
  password: '<your-mygekko-password>',
});

try {
  const blinds = client.blinds.getItems();
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
