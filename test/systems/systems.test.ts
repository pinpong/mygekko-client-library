import axios from 'axios';

import { LocalClient } from '../../src';

/**
 * Creates an initialized client answering with the given config and statuses.
 * @param config - The system config of the device.
 * @param statuses - The status responses by system type.
 */
async function createClient(
  config: object,
  statuses: { [systemType: string]: object }
): Promise<LocalClient> {
  jest.spyOn(axios, 'get').mockImplementation(async (url: string) => {
    const endpoint = new URL(url).pathname.replace('/api/v1', '');
    if (endpoint === '/var') {
      return { data: config };
    }
    if (endpoint === '/trend') {
      return { data: {} };
    }
    return { data: statuses[endpoint.slice('/var/'.length, -'/status'.length)] };
  });

  const client = new LocalClient({ ip: 'demo', username: 'test', password: 'test' });
  await client.initialize();
  return client;
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
      'globals/network': {
        gekkoname: { value: 'Demo' },
        language: { value: '2' },
        version: { value: '680000' },
        hardware: { value: 'Slide 2 (XXAAXXAACCAA)' },
      },
      'globals/alarm': { sumstate: { value: '2' } },
      'globals/meteo': {
        twilight: { value: '224.399994' },
        humidity: { value: '82.000000' },
        brightness: { value: '0.200000' },
        brightnessw: { value: '0.224000' },
        brightnesso: { value: '0.210000' },
        wind: { value: '0.780000' },
        temperature: { value: '14.100000' },
        rain: { value: '0.000000' },
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
