import axios, { AxiosError } from 'axios';

import { CLIENT_ERROR_MESSAGES, ClientError, LocalClient, RemoteClient } from '../../src';
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

test('encodes the credentials', async () => {
  new MockGekko().install();

  await new LocalClient({ ip: 'mock', username: 'user name&#%?', password: 'test' }).initialize();
  expect(jest.mocked(axios.get).mock.calls[0][0]).toBe(
    'http://mock/api/v1/var?username=user%20name%26%23%25%3F&password=test'
  );

  jest.mocked(axios.get).mockClear();
  await new RemoteClient({
    username: 'user@example.com',
    gekkoId: 'K999-AAAA-BBBB',
    apiKey: 'a&b=c',
  }).initialize();
  expect(jest.mocked(axios.get).mock.calls[0][0]).toBe(
    'https://live.my-gekko.com/api/v1/var?username=user%40example.com&key=a%26b%3Dc&gekkoid=K999-AAAA-BBBB'
  );
});

test('stays uninitialized if the trend config cannot be loaded', async () => {
  const mock = new MockGekko();
  mock.install();
  const answer = jest.mocked(axios.get).getMockImplementation();
  let failing = true;
  jest.mocked(axios.get).mockImplementation(async (url, config) => {
    if (failing && url.includes('/trend?')) {
      throw new AxiosError('timeout exceeded', 'ECONNABORTED', undefined, {});
    }
    return answer?.(url, config);
  });
  const client = new LocalClient({ ip: 'mock', username: 'test', password: 'test' });

  await expect(client.initialize()).rejects.toThrow(CLIENT_ERROR_MESSAGES.TIMEOUT);
  expect(client.supportedSystems).toEqual([]);

  failing = false;
  await client.initialize();
  expect(client.supportedSystems).toContain('lights');
});

test('rescan loads the config again and keeps the old one on a failure', async () => {
  const client = new LocalClient({ ip: 'mock', username: 'test', password: 'test' });
  await expect(client.rescan()).rejects.toThrow(CLIENT_ERROR_MESSAGES.SYSTEM_NOT_INITIALIZED);

  new MockGekko({ config: { globals: {}, lights: {} }, trend: {}, status: {} }).install();
  await client.initialize();
  expect(client.supportedSystems).toEqual(['lights']);

  jest.restoreAllMocks();
  const mock = new MockGekko({ config: { globals: {}, blinds: {} }, trend: {}, status: {} });
  mock.install();
  mock.failWith = 503;
  await expect(client.rescan()).rejects.toThrow(CLIENT_ERROR_MESSAGES.SERVICE_NOT_AVAILABLE);
  expect(client.supportedSystems).toEqual(['lights']);

  mock.failWith = null;
  await client.rescan();
  expect(client.supportedSystems).toEqual(['blinds']);
});

test('a connection problem keeps the original error as cause', async () => {
  const mock = new MockGekko();
  const client = await mock.createClient();

  mock.refused = ['mock'];
  const error = await client.lights.getItems().catch((reason: unknown) => reason);

  expect(error).toBeInstanceOf(ClientError);
  expect(error).toMatchObject({
    message: CLIENT_ERROR_MESSAGES.NO_CONNECTION,
    cause: { code: 'ECONNREFUSED' },
  });
});
