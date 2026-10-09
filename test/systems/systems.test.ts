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
