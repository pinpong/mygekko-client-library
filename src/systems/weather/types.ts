import { BaseSystemType } from '../base/types';

/** @group Systems */
export type WeatherItem = BaseSystemType & {
  /** The current twilight value as 0-100000 lux */
  twilight: number | null;
  /** The current relative humidity level as 0-100 % */
  humidity: number | null;
  /** The current brightness value from the south sensor as 0-100000 kilo lux */
  brightness: number | null;
  /** The current brightness value from the west sensor as 0-100000 kilo lux */
  brightnessWest: number | null;
  /** The current brightness value from the east sensor as 0-100000 kilo lux */
  brightnessEast: number | null;
  /** The current value of the wind as kilometer per hour */
  wind: number | null;
  /** The current value of the temperature as -100-100 °C */
  temperature: number | null;
  /** The current value of the accumulated rain as 0-100 liter per hour */
  rain: number | null;
  /** The units of the values as reported by the myGEKKO device */
  units: WeatherUnits;
};

/** @group Systems */
export type WeatherUnits = {
  /** The twilight unit, e.g. `lx` */
  twilight: string | null;
  /** The humidity unit, e.g. `%` */
  humidity: string | null;
  /** The brightness unit, e.g. `kLx` */
  brightness: string | null;
  /** The brightness unit of the west sensor, e.g. `kLx` */
  brightnessWest: string | null;
  /** The brightness unit of the east sensor, e.g. `kLx` */
  brightnessEast: string | null;
  /** The wind unit, always `km/h` as the value is converted */
  wind: string | null;
  /** The temperature unit, e.g. `°C` */
  temperature: string | null;
  /** The rain unit, e.g. `l/h` */
  rain: string | null;
};
