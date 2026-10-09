![NPM](https://img.shields.io/npm/l/mygekko-client-library)
![npm](https://img.shields.io/npm/v/mygekko-client-library)
![npm](https://img.shields.io/npm/dy/mygekko-client-library)
![GitHub issues](https://img.shields.io/github/issues/pinpong/mygekko-client-library)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/pinpong/mygekko-client-library/code_check.yml?label=lint)
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
  await client.initialize();
  const blinds = await client.blinds.getItems();
  console.log(blinds);
  await client.blinds.setPosition('item0', 75);
  const blindsTrends = await client.blinds.getTrends(
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
  await client.initialize();
  const blinds = await client.blinds.getItems();
  console.log(blinds);
  await client.blinds.setPosition('item0', 75);
} catch (e) {
  console.log(e);
}
```

### Local and remote access in one client

The combined client uses the local api first and falls back to the remote api while the device is not reachable locally. Both accesses are optional, at least one is required:

```js
import { CombinedClient } from 'mygekko-client-library';

const client = new CombinedClient({
  local: { ip: '<your-mygekko-ip-address>', username: '<username>', password: '<password>' },
  remote: { username: '<your-mygekko-user-email>', gekkoId: '<your-gekko-id>', apiKey: '<key>' },
});

await client.initialize();
console.log(client.connectionType); // 'local' or 'remote'
```

An access that was not reachable is skipped for `retryInterval` milliseconds (60000 by default) and tried again afterwards. A http error such as a wrong password does not cause a fallback.

### Request options

| Option          | Client                    | Default                 | Meaning                                                       |
| --------------- | ------------------------- | ----------------------- | ------------------------------------------------------------- |
| `timeout`       | local, remote, per access | 2000 local, 5000 remote | Milliseconds until a request is given up                      |
| `attempts`      | local, remote, combined   | 3                       | Attempts of a status request on a timeout or connection error |
| `retryInterval` | combined                  | 60000                   | Milliseconds until an access that failed is tried again       |

With both accesses the attempts apply to the access tried last, the one before is tried once. A command is never repeated, it may have been executed although the response got lost. For the same reason a command that timed out is not sent over the other access, the request rejects with `request/timeout`.

### Systems, items and groups

```js
import { LightState } from 'mygekko-client-library';

console.log(client.supportedSystems); // the systems the device has

const lights = await client.lights.getItems();
const groups = await client.lights.getGroups();

await client.lights.setDimLevel('item0', 50);
await client.lights.toggle('item0');
await client.lights.setState('group0', LightState.off);
```

A value the device does not report is `null`, a text the device reports empty stays empty. Numbers in commands are rounded to one decimal, the resolution of the device. A group takes only a few of the commands of its system, mostly off and on.

### Helpers

- `client.vents.getWorkingModes(deviceModel)` and `client.roomTemperatures.getWorkingModes(deviceModel)` return the working modes of a device model, the same number means something different per model.
- `client.vents.isLevelSupported(vent)`, `isLevelOffSupported(vent)`, `isBypassSupported(vent)` and `isCoolingSupported(vent)` tell which commands a vent device model takes.
- `rgbToDecimal`, `hexToDecimal`, `decimalToHexColor`, `rgbToHex` and `tunableWhiteToHex` convert light colors.

### Errors

Requests reject with a `ClientError`, its message is one of `CLIENT_ERROR_MESSAGES`, e.g. `auth/bad-login` (403), `auth/gekko-offline` (410), `request/tom-many-request` (429), `request/timeout` and `request/no-connection`. The original error of a connection problem is kept as `cause`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests.

The tests run against an emulated device, `test/mock/mockGekko.ts`. It answers config, status and command requests from `test/fixtures/demo.json`, records the commands and can fail with a http status or a timeout. `test/fixtures/discover.json` is the config of a real device, `test/systems/formats.test.ts` checks the parsers against its formats.

### Development setup

Use the Node.js version from `.nvmrc`.

```sh
yarn install
yarn lefthook install # activate git hooks (install scripts of dependencies are disabled)
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org) and are checked by commitlint.
Releases are created by semantic-release from these messages when changes are merged into `main`.
