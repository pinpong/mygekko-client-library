import { MockGekko } from '../mock/mockGekko';

afterEach(() => {
  jest.restoreAllMocks();
});

test.each([
  'accesses',
  'actions',
  'airConditioners',
  'alarmSystems',
  'analyses',
  'blinds',
  'cameras',
  'clocks',
  'controlCircuits',
  'energyCosts',
  'energyManagers',
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
  'smsEmails',
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
