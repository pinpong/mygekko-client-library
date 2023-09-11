import { BaseSystemType } from '../base/types';

export type HeatingSystem = BaseSystemType & {
  deviceModel: HeatingSystemDeviceModel | null;
  coolingModeState: HeatingSystemCoolingState | null;
  flowTemperatureValue: number | null;
  flowTemperatureSetPoint: number | null;
  currentState: HeatingSystemState | null;
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
