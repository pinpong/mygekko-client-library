import {
  ActionState,
  BlindState,
  CLIENT_ERROR_MESSAGES,
  LightState,
  LocalClient,
  PoolWorkingMode,
  RoomTemperatureWorkingModeStandard,
  SystemType,
} from '../../src';
import { MockGekko } from '../mock/mockGekko';

/**
 * Creates an initialized client answering with the given config and status.
 * @param config - The system config of the device.
 * @param status - The status values by system.
 */
function createClient(config: object, status: object): Promise<LocalClient> {
  return new MockGekko({ config: { globals: {}, ...config }, trend: {}, status }).createClient();
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('global systems', async () => {
  const client = await createClient(
    {
      globals: {
        network: { gekkoname: {}, language: {}, version: {}, hardware: {} },
        alarm: { sumstate: {} },
        meteo: { twilight: {}, humidity: {}, brightness: {}, wind: {}, temperature: {}, rain: {} },
      },
    },
    {
      globals: {
        network: {
          gekkoname: { value: 'Demo' },
          language: { value: '2' },
          version: { value: '680000' },
          hardware: { value: 'Slide 2 (XXAAXXAACCAA)' },
        },
        alarm: { sumstate: { value: '2' } },
        meteo: {
          twilight: { value: '224.399994' },
          humidity: { value: '82.000000' },
          brightness: { value: '0.200000' },
          brightnessw: { value: '0.224000' },
          brightnesso: { value: '0.210000' },
          wind: { value: '0.780000' },
          temperature: { value: '14.100000' },
          rain: { value: '0.000000' },
        },
      },
    }
  );

  expect(await client.gekkoInfo.getItem()).toMatchObject({
    gekkoName: 'Demo',
    language: 2,
    version: 680000,
    hardware: 'Slide 2 (XXAAXXAACCAA)',
  });
  expect(await client.globalAlarm.getItem()).toMatchObject({ state: 2 });
  expect(await client.weather.getItem()).toMatchObject({
    twilight: 224.399994,
    humidity: 82,
    brightness: 0.2,
    brightnessWest: 0.224,
    brightnessEast: 0.21,
    wind: 0.78,
    temperature: 14.1,
    rain: 0,
  });
});

test('wall boxes', async () => {
  const client = await createClient(
    { emobils: { item0: { name: 'Wallbox Garage' } } },
    {
      emobils: {
        item0: {
          sumstate: { value: '1;1;0;11.00;0.00;11.00;0;;0s;0.00;0;;;39;;' },
          user1_sumstate: { value: '1221.34' },
          user2_sumstate: { value: '23421.98;' },
          user3_sumstate: { value: '0' },
        },
      },
    }
  );

  expect(await client.wallBoxes.getItems()).toMatchObject([
    {
      itemId: 'item0',
      name: 'Wallbox Garage',
      page: null,
      pluggedState: 1,
      chargeState: 1,
      currentChargingPower: 11,
      chargeDurationTime: '0s',
      sumState: 0,
      wallBoxUser: [
        { id: 1, totalEnergy: 1221.34 },
        { id: 2, totalEnergy: 23421.98 },
        { id: 3, totalEnergy: 0 },
      ],
    },
  ]);
});

test('status value positions', async () => {
  const client = await createClient(
    {
      loads: { item0: { name: 'Steckdose' } },
      roomtemps: { item0: { name: 'Wohnzimmer', page: 'EG' } },
      saunas: { item0: { name: 'Sauna', page: 'Wellness' } },
      energycosts: { item0: { name: 'Haus', page: 'Energie' } },
    },
    {
      loads: { item0: { sumstate: { value: '2;1' } } },
      roomtemps: { item0: { sumstate: { value: '22.10;22.00;;8;;3.00;0;1;35;974;23.2;0;' } } },
      saunas: { item0: { sumstate: { value: '1;1;0;0;75.8;80.00;115.75;79.50;80.0' } } },
      energycosts: {
        item0: {
          sumstate: {
            value:
              '1.02;11.84;821.35;25427.30;10.00;kWh;kW;4570.00;7192.00;83.00;0.00;0.00;0.00;0.00;932.00;0;3641.82;18422.60;01.01.2022 12:00:00;',
          },
        },
      },
    }
  );

  expect(await client.loads.getItems()).toMatchObject([{ currentState: 2, sumState: 1 }]);
  expect(await client.roomTemperatures.getItems()).toMatchObject([
    {
      coolingModeState: 0,
      sumState: 1,
      relativeHumidity: 35,
      airQualityLevel: 974,
      floorTemperature: 23.2,
    },
  ]);
  expect(await client.saunas.getItems()).toMatchObject([
    {
      workingMode: 1,
      currentState: 1,
      sumState: 0,
      errorState: 0,
      roomTemperature: 75.8,
      roomTemperatureSetPoint: 80,
      burnerTemperature: 115.75,
      roomRelativeHumidityLevel: 79.5,
      roomRelativeHumiditySetPointLevel: 80,
    },
  ]);
  expect(await client.energyCosts.getItems()).toMatchObject([
    {
      totalEnergyYesterday18h24h: 932,
      sumState: 0,
      totalEnergyThisYear: 3641.82,
      totalEnergyInPeriod: 18422.6,
      startDateTotalEnergyInPeriod: '01.01.2022 12:00:00',
      counterDirection: null,
    },
  ]);
});

test('heating circuits', async () => {
  const client = await createClient(
    { heatingcircuits: { item0: { name: 'Fussboden' }, item1: { name: 'Radiatoren' } } },
    {
      heatingcircuits: {
        item0: { sumstate: { value: '1;45.00;100.00;1;50;100.00;0;' } },
        item1: { sumstate: { value: '1;45.00;38.50;12.00;100.00;1;50;100.00;0;1;' } },
      },
    }
  );

  expect(await client.heatingCircuits.getItems()).toMatchObject([
    {
      deviceModel: 1,
      flowTemperature: 45,
      returnFlowTemperature: null,
      dewPoint: null,
      pumpWorkingLevel: 100,
      coolingModeState: 1,
      flowTemperatureSetPoint: 50,
      valveOpeningLevel: 100,
      sumState: 0,
      currentState: null,
    },
    {
      deviceModel: 1,
      flowTemperature: 45,
      returnFlowTemperature: 38.5,
      dewPoint: 12,
      pumpWorkingLevel: 100,
      coolingModeState: 1,
      flowTemperatureSetPoint: 50,
      valveOpeningLevel: 100,
      sumState: 0,
      currentState: 1,
    },
  ]);
});

test('commands', async () => {
  const mock = new MockGekko();
  const client = await mock.createClient();

  await client.actions.setState('item0', ActionState.off);
  await client.actions.setState('item0', ActionState.on);
  await client.pools.setWorkingMode('item0', PoolWorkingMode.bathing);
  await client.pools.setFilterCleaning('item0', 3);
  await client.roomTemperatures.setWorkingMode('item0', RoomTemperatureWorkingModeStandard.off);

  expect(mock.commands).toEqual([
    { system: 'actions', itemId: 'item0', value: '-1', documented: true },
    { system: 'actions', itemId: 'item0', value: '1', documented: true },
    { system: 'pools', itemId: 'item0', value: 'M2', documented: true },
    { system: 'pools', itemId: 'item0', value: 'C3', documented: true },
    { system: 'roomtemps', itemId: 'item0', value: 'M1', documented: true },
  ]);
});

test('toggle, reset and set point commands', async () => {
  const mock = new MockGekko();
  const client = await mock.createClient();

  await client.lights.toggle('item0');
  await client.blinds.toggle('item0');
  await client.loads.toggle('item0');
  await client.actions.toggle('item0');
  await client.multiRooms.toggle('item1');
  await client.vents.toggle('item0');
  await client.energyCosts.resetPeriod('item0');
  await client.logics.setSetPoint('item0', 44.7);
  await client.analyses.setSetPoint('item0', 21);
  await client.wallBoxes.resetUserHistory('item0', 4);

  expect(mock.commands.map(({ system, value, documented }) => [system, value, documented])).toEqual(
    [
      ['lights', 'T', true],
      ['blinds', 'T', true],
      ['loads', 'T', true],
      ['actions', 'T', true],
      ['multirooms', 'T', true],
      ['vents', 'T', true],
      ['energycosts', 'RP', true],
      ['alarms_logics', 'S44.7', true],
      ['trends', 'S21', true],
      ['emobils', 'R4', true],
    ]
  );
});

test('global systems with missing values', async () => {
  const client = await createClient(
    { globals: { network: {}, alarm: {}, meteo: {} } },
    {
      globals: {
        network: { gekkoname: { value: 'Demo' } },
        alarm: {},
        meteo: { brightness: { value: '0.200000' }, temperature: { value: '14.100000' } },
      },
    }
  );

  expect(await client.gekkoInfo.getItem()).toMatchObject({
    gekkoName: 'Demo',
    language: null,
    version: null,
    hardware: null,
  });
  expect(await client.globalAlarm.getItem()).toMatchObject({ state: null });
  expect(await client.weather.getItem()).toMatchObject({
    twilight: null,
    humidity: null,
    brightness: 0.2,
    brightnessWest: null,
    brightnessEast: null,
    wind: null,
    temperature: 14.1,
    rain: null,
  });
});

test('groups', async () => {
  const mock = new MockGekko();
  const client = await mock.createClient();

  expect(await client.lights.getGroups()).toEqual([
    { itemId: 'group0', name: 'Alle', page: null, sumState: null, state: 1 },
    { itemId: 'group1', name: 'EG', page: null, sumState: null, state: 1 },
    { itemId: 'group2', name: 'OG', page: null, sumState: null, state: 0 },
    { itemId: 'group3', name: 'Aussenbereich', page: null, sumState: null, state: 1 },
  ]);
  expect(await client.energyCosts.getGroups()).toEqual([
    { itemId: 'group0', name: 'Grp 1', page: null, sumState: null, state: null },
  ]);
  expect(await client.loads.getGroups()).toEqual([]);

  await client.lights.setState('group0', LightState.off);
  await client.blinds.setState('group0', BlindState.holdUp);

  expect(mock.commands).toEqual([
    { system: 'lights', itemId: 'group0', value: '0', documented: true },
    { system: 'blinds', itemId: 'group0', value: '2', documented: true },
  ]);
});

test('supported systems', async () => {
  const client = await createClient(
    { globals: { meteo: {}, network: {}, alarm: {} }, lights: { item0: {} }, emobils: {} },
    {}
  );

  expect(client.supportedSystems).toEqual([
    SystemType.weather,
    SystemType.lights,
    SystemType.wallBoxes,
  ]);
});

test('rejects a response that is no device config', async () => {
  const mock = new MockGekko({ config: { error: 'not a gekko' }, trend: {}, status: {} });

  await expect(mock.createClient()).rejects.toThrow(CLIENT_ERROR_MESSAGES.INVALID_CONFIG);
});

test('access state, alarm zones, dim level and items without status', async () => {
  const client = await createClient(
    {
      accessdoors: { item0: { name: 'Haustür' } },
      alarmsystem: {
        item0: { name: 'Alarmanlage', zone1: 'EG', zone2: 'OG' },
        item1: { name: 'Nebengebäude' },
      },
      lights: {
        item0: { name: 'Sofa' },
        item1: { name: 'Tisch' },
        item2: { name: 'Flur' },
      },
    },
    {
      accessdoors: { item0: { sumstate: { value: '0;0;1;40;0' } } },
      alarmsystem: {
        item0: { sumstate: { value: '0;1;0;0;0;1;3;1;' } },
        item1: { sumstate: { value: '0;1;0;0;1;0;0;1;' } },
      },
      lights: {
        item0: { sumstate: { value: '1;130.00;;;0' } },
        item1: { sumstate: { value: '1;-5.00;;;0' } },
      },
    }
  );

  expect(await client.accesses.getItems()).toMatchObject([
    { currentState: 0, sumState: 0, accessState: 1, gateRuntimePercentage: 40, accessType: 0 },
  ]);
  expect(await client.alarmSystems.getItems()).toMatchObject([
    {
      alarmDevices: [
        { zone: 'EG', deviceStatus: 1, sharpState: 0, systemState: 0 },
        { zone: 'OG', deviceStatus: 0, sharpState: 1, systemState: 3 },
      ],
    },
    { alarmDevices: [{ zone: '1' }, { zone: '2' }] },
  ]);
  expect(await client.lights.getItems()).toMatchObject([
    { itemId: 'item0', dimLevel: 100 },
    { itemId: 'item1', dimLevel: 0 },
    { itemId: 'item2', name: 'Flur', currentState: null, dimLevel: null, sumState: null },
  ]);
});

test('command values are rounded to one decimal', async () => {
  const mock = new MockGekko();
  const client = await mock.createClient();

  await client.roomTemperatures.setTemperatureAdjust('item0', 21.6 + 0.1);
  await client.roomTemperatures.setTemperaturSetPoint('item0', 22.449);
  await client.blinds.setPosition('item0', 33.333);
  await client.lights.setDimLevel('item0', 50);
  await client.wallBoxes.setChargePower('item0', 11 + 0.2);
  await client.lights.setColor('item0', 16711697);

  expect(mock.commands.map(({ value }) => value)).toEqual([
    'K21.7',
    'S22.4',
    'P33.3',
    'D50',
    'CS11.2',
    'C16711697',
  ]);
});

test('trend requests check the trend config', async () => {
  const client = await createClient({ lights: { item0: { name: 'Licht' } } }, {});

  await expect(
    client.getTrendByItemId(SystemType.lights, 'item0', 'trend0', '2026-01-01', '2026-01-02', 10)
  ).rejects.toThrow(CLIENT_ERROR_MESSAGES.TREND_NOT_SUPPORTED);
});

test('text values missing in the status are null', async () => {
  const client = await createClient(
    {
      emobils: { item0: { name: 'Wallbox' } },
      multirooms: { item0: { name: 'Radio' } },
      energycosts: { item0: { name: 'Haus' } },
      trends: { item0: { name: 'Temperaturen' } },
    },
    {
      emobils: { item0: { sumstate: { value: '1;1;0;' } } },
      multirooms: { item0: { sumstate: { value: '1;50;' } } },
      energycosts: { item0: { sumstate: { value: '1.02;' } } },
      trends: { item0: { sumstate: { value: '1;0;' } } },
    }
  );

  expect(await client.wallBoxes.getItems()).toMatchObject([
    { chargeUserName: null, chargeDurationTime: null, currentChargingEnergy: null },
  ]);
  const [multiRoom] = await client.multiRooms.getItems();
  expect(multiRoom.currentAudioTitle).toBe(null);
  expect(multiRoom.playList?.every(({ name }) => name === null)).toBe(true);
  expect(await client.energyCosts.getItems()).toMatchObject([
    { energyUnit: null, powerUnit: null, startDateTotalEnergyInPeriod: null },
  ]);
  const [analysis] = await client.analyses.getItems();
  expect(analysis.analysisVariables?.map(({ name, unit }) => [name, unit])).toEqual([
    [null, null],
    [null, null],
    [null, null],
    [null, null],
  ]);
});
