import { BaseSystemType } from '../base/types';

export type HotWaterSystem = BaseSystemType & {
  deviceModel: HotWaterSystemDeviceModel | null;
  coolingModeState: HotWaterCoolingModeState | null;
  waterTemperatureSetPoint: number | null;
  waterTemperatureTop: number | null;
  waterTemperatureBottom: number | null;
  collectorTemperature: number | null;
  currentState: HotWaterSystemState | null;
};

export enum HotWaterSystemState {
  'off' = 0,
  'on' = 1,
}

export enum HotWaterSystemDeviceModel {
  'individual' = 0,
  'buderus' = 1,
  'stiebel' = 2,
  'tecalor' = 3,
  'vaillant' = 4,
}

export enum HotWaterCoolingModeState {
  'off' = 0,
  'on' = 1,
}
