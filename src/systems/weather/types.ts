import { BaseSystemType } from '../base/types';

export type WeatherItem = BaseSystemType & {
  /** The current twilight value in lux (lx) */
  twilight: number | null;
  /** The current relative humidity level */
  humidity: number | null;
  /** The current brightness value in kilo lux (kLx) */
  brightness: number | null;
  /** The current brightness value from the west sensor in kilo lux (kLx) */
  brightnessWest: number | null;
  /** The current brightness value from the east sensor in kilo lux (kLx) */
  brightnessEast: number | null;
  /** The current value of the wind in meter/second (m/s) */
  wind: number | null;
  /** The current value of the temperature in degrees celsius (°C) */
  temperature: number | null;
  /** The current value of the accumulated rain in liter/hour (l/h) */
  rain: number | null;
};
