import { BaseSystem } from "../base/types";

export type Sauna = BaseSystem & {
  workingMode?: SaunaWorkingMode;
  currentState?: SaunaState;
  errorState?: SaunaErrorState;
  roomTemperature?: number;
  roomTemperatureSetPoint?: number;
  burnerTemperature?: number;
  roomRelativeHumidityLevel?: number;
  roomRelativeHumiditySetPointLevel?: number;
};

export enum SaunaWorkingMode {
  "off" = 0,
  "onOrFinished" = 1,
  "bio" = 2,
}

export enum SaunaState {
  "off" = 0,
  "on" = 1,
}

export enum SaunaErrorState {
  "noError" = 0,
  "error" = 1,
}
