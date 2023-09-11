import { BaseSystemType } from '../base/types';

export type RoomTemperature = BaseSystemType & {
  temperature: number | null;
  temperatureSetPoint: number | null;
  valveOpeningLevel: number | null;
  workingMode: RoomTemperatureWorkingModeStandard | RoomTemperatureWorkingModeKnx | null;
  reserved: string | null;
  temperatureAdjustment: number | null;
  coolingModeState: RoomTemperatureCoolingState | null;
  relativeHumidity: number | null;
  airQualityLevel: number | null;
  floorTemperature: number | null;
  deviceModel: RoomTemperatureDeviceModel | null;
};

export enum RoomTemperatureWorkingModeStandard {
  'off' = 0,
  'comfort' = 8,
  'reduced' = 16,
  'manual' = 64,
  'standby' = 256,
}

export enum RoomTemperatureWorkingModeKnx {
  'auto' = 0,
  'comfort' = 1,
  'standby' = 2,
  'economy' = 3,
  'buildingProtection' = 4,
}

export enum RoomTemperatureCoolingState {
  'off' = 0,
  'on' = 1,
}

export enum RoomTemperatureDeviceModel {
  'standard' = 0,
  'knx' = 1,
}
