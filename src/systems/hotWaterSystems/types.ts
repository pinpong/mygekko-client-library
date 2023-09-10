import { BaseSystem } from "../base/types";

export type HotWaterSystem = BaseSystem & {
  deviceModel?: HotWaterSystemDeviceModel;
  coolingModeState?: HotWaterCoolingModeState;
  waterTemperatureSetPoint?: number;
  waterTemperatureTop?: number;
  waterTemperatureBottom?: number;
  collectorTemperature?: number;
  currentState?: HotWaterSystemState;
};

export enum HotWaterSystemState {
  "off" = 0,
  "on" = 1,
}

export enum HotWaterSystemDeviceModel {
  "individual" = 0,
  "buderus" = 1,
  "stiebel" = 2,
  "tecalor" = 3,
  "vaillant" = 4,
}

export enum HotWaterCoolingModeState {
  "off" = 0,
  "on" = 1,
}
