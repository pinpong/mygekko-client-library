import axios from 'axios';

import { CLIENT_ERROR_MESSAGES, CombinedClient } from '../../src';
import { MockGekko } from '../mock/mockGekko';

const local = { ip: 'mock', username: 'test', password: 'test' };
const remote = { username: 'test', gekkoId: 'test', apiKey: 'test' };

/**
 * Returns the hosts of the requests sent so far and forgets them.
 */
function requestedHosts(): string[] {
  const hosts = jest.mocked(axios.get).mock.calls.map(([url]) => new URL(url).hostname);
  jest.mocked(axios.get).mockClear();
  return hosts;
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('uses the local api while the device is reachable', async () => {
  const mock = new MockGekko();
  mock.install();
  const client = new CombinedClient({ local, remote });

  expect(client.connectionType).toBe(null);
  await client.initialize();
  expect(await client.lights.getItems()).toHaveLength(29);

  expect(client.connectionType).toBe('local');
  expect(requestedHosts()).toEqual(['mock', 'mock', 'mock']);
});

test('falls back to the remote api and tries the local api again later', async () => {
  const mock = new MockGekko();
  mock.install();
  const now = jest.spyOn(Date, 'now').mockReturnValue(0);
  const client = new CombinedClient({ local, remote });
  await client.initialize();
  requestedHosts();

  mock.unreachable = ['mock'];
  expect(await client.lights.getItems()).toHaveLength(29);
  expect(client.connectionType).toBe('remote');
  expect(requestedHosts()).toEqual(['mock', 'live.my-gekko.com']);

  await client.lights.setState('item0', 1);
  expect(requestedHosts()).toEqual(['live.my-gekko.com']);

  now.mockReturnValue(61000);
  await client.lights.getItems();
  expect(requestedHosts()).toEqual(['mock', 'live.my-gekko.com']);

  mock.unreachable = [];
  now.mockReturnValue(122000);
  await client.lights.getItems();
  expect(client.connectionType).toBe('local');
  expect(requestedHosts()).toEqual(['mock']);
});

test('does not send a command that timed out over the other access', async () => {
  const mock = new MockGekko();
  mock.install();
  const client = new CombinedClient({ local, remote });
  await client.initialize();
  requestedHosts();

  mock.unreachable = ['mock'];
  await expect(client.lights.toggle('item0')).rejects.toThrow(CLIENT_ERROR_MESSAGES.TIMEOUT);
  expect(requestedHosts()).toEqual(['mock']);
  expect(mock.commands).toEqual([]);

  await client.lights.toggle('item0');
  expect(requestedHosts()).toEqual(['live.my-gekko.com']);
  expect(mock.commands).toHaveLength(1);
});

test('sends a command over the other access if the connection is refused', async () => {
  const mock = new MockGekko();
  mock.install();
  const client = new CombinedClient({ local, remote });
  await client.initialize();
  requestedHosts();

  mock.refused = ['mock'];
  await client.lights.toggle('item0');
  expect(requestedHosts()).toEqual(['mock', 'live.my-gekko.com']);
  expect(mock.commands).toHaveLength(1);

  mock.refused = ['mock', 'live.my-gekko.com'];
  await expect(client.lights.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.NO_CONNECTION);
});

test('uses the configured retry interval', async () => {
  const mock = new MockGekko();
  mock.install();
  const now = jest.spyOn(Date, 'now').mockReturnValue(0);
  const client = new CombinedClient({ local, remote, retryInterval: 5000 });
  await client.initialize();
  mock.unreachable = ['mock'];
  await client.lights.getItems();
  requestedHosts();

  now.mockReturnValue(4000);
  await client.lights.getItems();
  expect(requestedHosts()).toEqual(['live.my-gekko.com']);

  now.mockReturnValue(5001);
  await client.lights.getItems();
  expect(requestedHosts()).toEqual(['mock', 'live.my-gekko.com']);
});

test('does not fall back on a http error', async () => {
  const mock = new MockGekko();
  mock.install();
  const client = new CombinedClient({ local, remote });
  await client.initialize();
  requestedHosts();

  mock.failWith = 403;
  await expect(client.lights.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.BAD_LOGIN);
  expect(requestedHosts()).toEqual(['mock']);
});

test('reports the connection error if no route is reachable', async () => {
  const mock = new MockGekko();
  mock.install();
  const client = new CombinedClient({ local, remote, attempts: 2 });
  await client.initialize();
  requestedHosts();

  mock.unreachable = ['mock', 'live.my-gekko.com'];
  await expect(client.lights.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.TIMEOUT);
  expect(requestedHosts()).toEqual(['mock', 'live.my-gekko.com', 'live.my-gekko.com']);

  await expect(client.lights.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.TIMEOUT);
  expect(requestedHosts()).toEqual(['mock', 'live.my-gekko.com', 'live.my-gekko.com']);
});

test('works with a single access and requires one', async () => {
  const mock = new MockGekko();
  mock.install();

  const onlyRemote = new CombinedClient({ remote });
  await onlyRemote.initialize();
  expect(onlyRemote.connectionType).toBe('remote');

  const onlyLocal = new CombinedClient({ local });
  await onlyLocal.initialize();
  expect(onlyLocal.connectionType).toBe('local');

  expect(() => new CombinedClient({})).toThrow(CLIENT_ERROR_MESSAGES.MISSING_ACCESS);
});
