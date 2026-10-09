import { MockGekko } from '../mock/mockGekko';

const meteo = {
  twilight: { format: 'float[0.00,100000.00](lx)' },
  humidity: { format: 'float[0.00,100.00](%)' },
  brightness: { format: 'float[0.00,100000.00](kLx)' },
  brightnessw: { format: 'float[0.00,100000.00](kLx)' },
  brightnesso: { format: 'float[0.00,100000.00](kLx)' },
  wind: { format: 'float[0.00,100000.00](m/s)' },
  temperature: { format: 'float[-100.00,100.00](°C)' },
  rain: { format: 'float[0.00,100.00](l/h)' },
};

const status = {
  globals: {
    meteo: {
      twilight: { value: '120.00' },
      wind: { value: '10.00' },
    },
  },
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('getItem exposes the units of the meteo values', async () => {
  const client = await new MockGekko({
    config: { globals: { meteo } },
    trend: {},
    status,
  }).createClient();

  expect(await client.weather.getItem()).toMatchObject({
    twilight: 120,
    wind: 36,
    units: {
      twilight: 'lx',
      humidity: '%',
      brightness: 'kLx',
      brightnessWest: 'kLx',
      brightnessEast: 'kLx',
      wind: 'km/h',
      temperature: '°C',
      rain: 'l/h',
    },
  });
});

test('getItem returns null units without a format', async () => {
  const client = await new MockGekko({
    config: { globals: { meteo: { twilight: {} } } },
    trend: {},
    status,
  }).createClient();

  expect(await client.weather.getItem()).toMatchObject({
    twilight: 120,
    units: { twilight: null, brightness: null, wind: 'km/h' },
  });
});
