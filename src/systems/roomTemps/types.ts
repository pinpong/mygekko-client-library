import { BaseSystem } from "../base/types";

export type RoomTemperature = BaseSystem & {
  temperature?: number;
  temperatureSetPoint?: number;
  valveOpeningLevel?: number;
  workingMode?:
    | RoomTemperatureWorkingModeStandard
    | RoomTemperatureWorkingModeKnx;
  reserved?: string;
  temperatureAdjustment?: number;
  coolingModeState?: RoomTemperatureCoolingState;
  relativeHumidity?: number;
  airQualityLevel?: number;
  floorTemperature?: number;
  deviceModel?: RoomTemperatureDeviceModel;
};

export enum RoomTemperatureWorkingModeStandard {
  "off" = 0,
  "comfort" = 8,
  "reduced" = 16,
  "manual" = 64,
  "standby" = 256,
}

export enum RoomTemperatureWorkingModeKnx {
  "auto" = 0,
  "comfort" = 1,
  "standby" = 2,
  "economy" = 3,
  "buildingProtection" = 4,
}

export enum RoomTemperatureCoolingState {
  "off" = 0,
  "on" = 1,
}

export enum RoomTemperatureDeviceModel {
  "standard" = 0,
  "knx" = 1,
}
