import { BaseSystemType } from '../base/types';

/** @group Systems */
export type WeatherItem = BaseSystemType & {
  /** The current twilight value as 0-100000 lux */
  twilight: number | null;
  /** The current relative humidity level as 0-100 % */
  humidity: number | null;
  /** The current brightness value as 0-100000 kilo lux */
  brightness: number | null;
  /** The current brightness value from the west sensor as 0-100000 kilo lux */
  brightnessWest: number | null;
  /** The current brightness value from the east sensor as 0-100000 kilo lux */
  brightnessEast: number | null;
  /** The current value of the wind as 0-100000 meter per second */
  wind: number | null;
  /** The current value of the temperature as -100-100 °C */
  temperature: number | null;
  /** The current value of the accumulated rain as 0-100 liter per hour */
  rain: number | null;
};
