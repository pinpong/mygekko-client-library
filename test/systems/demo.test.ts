import { MockGekko } from '../mock/mockGekko';

afterEach(() => {
  jest.restoreAllMocks();
});

test.each([
  'accesses',
  'actions',
  'airConditioner',
  'alarmSystem',
  'analyses',
  'blinds',
  'cameras',
  'clocks',
  'controlCircuits',
  'energyCosts',
  'energyManager',
  'heatingCircuits',
  'heatingSystems',
  'hotWaterCirculations',
  'hotWaterSystems',
  'lights',
  'loads',
  'logics',
  'multiRooms',
  'pools',
  'roomTemperatures',
  'saunas',
  'smsEmail',
  'stoves',
  'vents',
  'wallBoxes',
] as const)('%s', async (system) => {
  const client = await new MockGekko().createClient();

  expect(await client[system].getItems()).toMatchSnapshot();
});

test.each(['gekkoInfo', 'globalAlarm', 'weather'] as const)('%s', async (system) => {
  const client = await new MockGekko().createClient();

  expect(await client[system].getItem()).toMatchSnapshot();
});
