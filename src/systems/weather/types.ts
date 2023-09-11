import { BaseSystem } from '../base/types';

export type WeatherItem = BaseSystem & {
  twilight?: number;
  humidity?: number;
  brightness?: number;
  brightnessWest?: number;
  brightnessEast?: number;
  wind?: number;
  temperature?: number;
  rain?: number;
};
