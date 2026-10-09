import axios from 'axios';

import { CLIENT_ERROR_MESSAGES, LocalClient, RemoteClient } from '../../src';
import { MockGekko } from '../mock/mockGekko';

afterEach(() => {
  jest.restoreAllMocks();
});

test('remote client', async () => {
  const mock = new MockGekko();
  mock.install();
  const client = new RemoteClient({ username: 'test', gekkoId: 'test', apiKey: 'test' });

  await client.initialize();
  expect(jest.mocked(axios.get).mock.calls[0][0]).toBe(
    'https://live.my-gekko.com/api/v1/var?username=test&key=test&gekkoid=test'
  );
  expect(client.connectionType).toBe('remote');

  mock.failWith = 403;
  await expect(client.blinds.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.BAD_LOGIN);
});

test('local client', async () => {
  const mock = new MockGekko();
  mock.install();
  const client = new LocalClient({ ip: 'mock', username: 'test', password: 'test' });

  await client.initialize();
  expect(jest.mocked(axios.get).mock.calls[0][0]).toBe(
    'http://mock/api/v1/var?username=test&password=test'
  );
  expect(client.connectionType).toBe('local');

  mock.failWith = 403;
  await expect(client.blinds.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.BAD_LOGIN);
});
