import axios from 'axios';

import { CLIENT_ERROR_MESSAGES, LocalClient, SystemType } from '../../src';
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
  await client.vents.setDehumidificationState('item0', 1);
  await client.wallBoxes.setChargePower('item0', 11);
  await client.changeRequest(SystemType.lights, 'item0', 'X1');

  expect(mock.commands).toEqual([
    { system: 'blinds', itemId: 'item0', value: 'P50', documented: true },
    { system: 'multirooms', itemId: 'item1', value: 'N-1', documented: true },
    { system: 'lights', itemId: 'item0', value: 'TW30', documented: true },
    { system: 'vents', itemId: 'item0', value: 'D1', documented: true },
    { system: 'emobils', itemId: 'item0', value: 'CS11', documented: false },
    { system: 'lights', itemId: 'item0', value: 'X1', documented: false },
  ]);
  expect(mock.handle('/api/v1/var/energymanager/item0/scmd/set?value=1&')).toEqual({
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
  mock.failWith = 471;
  await expect(client.lights.getItems()).rejects.toThrow(
    CLIENT_ERROR_MESSAGES.SERVICE_NOT_REGISTERED_OR_EXPIRED
  );
});

test('repeats status requests on timeouts', async () => {
  const mock = new MockGekko();
  const client = await mock.createClient();

  expect(axios.get).toHaveBeenLastCalledWith(expect.any(String), { timeout: 2000 });

  mock.timeouts = 2;
  expect(await client.lights.getItems()).toHaveLength(29);

  mock.timeouts = 3;
  await expect(client.lights.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.TIMEOUT);
  expect(mock.timeouts).toBe(0);

  mock.timeouts = 1;
  await expect(client.lights.setState('item0', 1)).rejects.toThrow(CLIENT_ERROR_MESSAGES.TIMEOUT);
  expect(mock.commands).toEqual([]);
});

test('uses the configured timeout and attempts', async () => {
  const mock = new MockGekko();
  mock.install();
  const client = new LocalClient({
    ip: 'mock',
    username: 'test',
    password: 'test',
    timeout: 500,
    attempts: 1,
  });
  await client.initialize();

  expect(axios.get).toHaveBeenLastCalledWith(expect.any(String), { timeout: 500 });

  mock.timeouts = 1;
  await expect(client.lights.getItems()).rejects.toThrow(CLIENT_ERROR_MESSAGES.TIMEOUT);
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
