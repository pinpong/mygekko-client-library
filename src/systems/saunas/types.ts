import { BaseSystemType } from '../base/types';

export type Sauna = BaseSystemType & {
  workingMode: SaunaWorkingMode | null;
  currentState: SaunaState | null;
  errorState: SaunaErrorState | null;
  roomTemperature: number | null;
  roomTemperatureSetPoint: number | null;
  burnerTemperature: number | null;
  roomRelativeHumidityLevel: number | null;
  roomRelativeHumiditySetPointLevel: number | null;
};

export enum SaunaWorkingMode {
  'off' = 0,
  'onOrFinished' = 1,
  'bio' = 2,
}

export enum SaunaState {
  'off' = 0,
  'on' = 1,
}

export enum SaunaErrorState {
  'noError' = 0,
  'error' = 1,
}
