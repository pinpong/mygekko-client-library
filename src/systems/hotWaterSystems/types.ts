import { BaseSystemType } from '../base/types';

export type HotWaterSystem = BaseSystemType & {
  /** The device model */
  deviceModel: HotWaterSystemDeviceModel | null;
  /** The current cooling mode state */
  coolingModeState: HotWaterSystemCoolingModeState | null;
  /** The current water set point temperature as -100-100 C° */
  waterTemperatureSetPoint: number | null;
  /** The current water top temperature as -100-100 C° */
  waterTemperatureTop: number | null;
  /** The current water bottom temperature as -100-100 C° */
  waterTemperatureBottom: number | null;
  /** The current collector temperature as -100-100 C° */
  collectorTemperature: number | null;
  /** The current state */
  currentState: HotWaterSystemState | null;
};

/** The hot water system states */
export enum HotWaterSystemState {
  'off' = 0,
  'on' = 1,
}

/** The hot water system device models */
export enum HotWaterSystemDeviceModel {
  'individual' = 0,
  'buderus' = 1,
  'stiebel' = 2,
  'tecalor' = 3,
  'vaillant' = 4,
}

/** The hot water system cooling mode states */
export enum HotWaterSystemCoolingModeState {
  'off' = 0,
  'on' = 1,
}
