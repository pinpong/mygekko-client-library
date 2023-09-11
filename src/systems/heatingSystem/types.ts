import { BaseSystem } from '../base/types';

export type HeatingSystem = BaseSystem & {
  deviceModel?: HeatingSystemDeviceModel;
  coolingModeState?: HeatingSystemCoolingState;
  flowTemperatureValue?: number;
  flowTemperatureSetPoint?: number;
  currentState?: HeatingSystemState;
};

export enum HeatingSystemDeviceModel {
  'individual' = 0,
  'buderus' = 1,
  'stiebel' = 2,
  'tecalor' = 3,
  'vaillant' = 4,
}

export enum HeatingSystemCoolingState {
  'off' = 0,
  'on' = 1,
}

export enum HeatingSystemState {
  'off' = 0,
  'on' = 1,
}
