import { BaseSystemType } from '../base/types';

export type WeatherItem = BaseSystemType & {
  twilight: number | null;
  humidity: number | null;
  brightness: number | null;
  brightnessWest: number | null;
  brightnessEast: number | null;
  wind: number | null;
  temperature: number | null;
  rain: number | null;
};
