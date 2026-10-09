import { discoverData, MockGekko } from '../mock/mockGekko';

const discover = discoverData();

/**
 * Lists the paths of all values of an item, e.g. `alarmDevices.0.type`.
 * @param value - The value to walk.
 * @param path - The path of the value.
 */
function leaves(value: unknown, path = ''): [string, unknown][] {
  if (typeof value !== 'object' || value === null) {
    return [[path, value]];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    leaves(child, path ? `${path}.${key}` : key)
  );
}

afterEach(() => {
  jest.restoreAllMocks();
});

// every position of the status holds its own small fraction, so the snapshot shows which field reads it
test.each([
  ['accesses', 'accessdoors'],
  ['actions', 'actions'],
  ['alarmSystems', 'alarmsystem'],
  ['analyses', 'trends'],
  ['blinds', 'blinds'],
  ['cameras', 'cams'],
  ['clocks', 'clocks'],
  ['energyCosts', 'energycosts'],
  ['energyManagers', 'energymanager'],
  ['hotWaterSystems', 'hotwater_systems'],
  ['lights', 'lights'],
  ['loads', 'loads'],
  ['logics', 'alarms_logics'],
  ['multiRooms', 'multirooms'],
  ['pools', 'pools'],
  ['roomTemperatures', 'roomtemps'],
  ['smsEmails', 'smsemail'],
  ['vents', 'vents'],
] as const)('%s reads the values in the order of the device format', async (property, system) => {
  const itemId = Object.keys(discover[system]).find((key) => key.startsWith('item')) ?? '';
  const format = discover[system][itemId]['sumstate'].format ?? '';
  const fields = format
    .split(';')
    .map((field) => field.trim().split(' ')[0])
    .filter((field) => field.length);
  const client = await new MockGekko({
    config: { globals: {}, [system]: { item0: { name: 'item' } } },
    trend: {},
    status: {
      [system]: {
        item0: { sumstate: { value: fields.map((_, i) => `${(i + 1) / 100};`).join('') } },
      },
    },
  }).createClient();

  const [item] = await client[property].getItems();
  const values = leaves(item);

  expect(
    fields.map((field, i) => {
      const read = values
        .filter(([, value]) => Number(value) === (i + 1) / 100)
        .map(([path]) => path);
      return `${i} ${field} <- ${read.join(', ') || '-'}`;
    })
  ).toMatchSnapshot();
});
