import { CLIENT_ERROR_MESSAGES, LocalClient } from '../../src';
import { MockGekko } from './mockGekko';

afterEach(() => {
  jest.restoreAllMocks();
});

test('answers config and status requests', () => {
  const mock = new MockGekko();

  expect(mock.handle('/api/v1/var?username=test&password=test')).toMatchObject({
    status: 200,
    data: { lights: { item0: { name: 'Stehlampe' } } },
  });
  expect(mock.handle('/api/v1/var/lights/status?')).toMatchObject({
    status: 200,
    data: { item0: { sumstate: { value: '0;;;;0' } } },
  });
  expect(mock.handle('/api/v1/var/lights/item0/status?')).toEqual({
    status: 200,
    data: { sumstate: { value: '0;;;;0' } },
  });
  expect(mock.handle('/api/v1/var/globals/network/status?')).toMatchObject({
    status: 200,
    data: { gekkoname: { value: 'Demo' } },
  });
  expect(mock.handle('/api/v1/var/lights/item99/status?')).toEqual({ status: 404, data: '' });
  expect(mock.handle('/api/v1/unknown?')).toEqual({ status: 404, data: '' });
});

test('records commands', async () => {
  const mock = new MockGekko();
  const client = await mock.createClient();

  await client.blinds.setPosition('item0', 50);
  await client.multiRooms.setPreviousSong('item1');
  await client.lights.setTunableWhiteLevel('item0', 30);

  expect(mock.commands).toEqual([
    { system: 'blinds', itemId: 'item0', value: 'P50', documented: true },
    { system: 'multirooms', itemId: 'item1', value: 'N-1', documented: true },
    { system: 'lights', itemId: 'item0', value: 'TW30', documented: false },
  ]);
  expect(mock.handle('/api/v1/var/energycosts/item0/scmd/set?value=1&')).toEqual({
    status: 404,
    data: '',
  });
});

test('fails with a http status', async () => {
  const mock = new MockGekko();
  const client = await mock.createClient();

  mock.failWith = 410;
  await expect(client.lights.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.GEKKO_OFFLINE);
  mock.failWith = 429;
  await expect(client.lights.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.TO_MANY_REQUEST);
});

test('serves the mock as http server', async () => {
  const mock = new MockGekko();
  const server = await mock.listen();
  const address = server.address();

  try {
    const client = new LocalClient({
      ip: `127.0.0.1:${typeof address === 'object' ? address?.port : address}`,
      username: 'test',
      password: 'test',
    });
    await client.initialize();

    expect(await client.lights.getItems()).toHaveLength(29);
    await client.loads.setState('item0', 1);
    expect(mock.commands).toEqual([
      { system: 'loads', itemId: 'item0', value: '1', documented: true },
    ]);

    mock.failWith = 403;
    await expect(client.lights.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.BAD_LOGIN);
  } finally {
    server.close();
  }
});
