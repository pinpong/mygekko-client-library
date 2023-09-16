import { BaseSystemType } from '../base/types';

/** @group Systems */
export type RoomTemperature = BaseSystemType & {
  /** The current temperature as -100-100 C° */
  temperature: number | null;
  /** The current set point temperature as -100-100 C° */
  temperatureSetPoint: number | null;
  /** The current valve opening level as 0-100 % */
  valveOpeningLevel: number | null;
  /** The current working mode */
  workingMode: RoomTemperatureWorkingModeStandard | RoomTemperatureWorkingModeKnx | null;
  /** Reserved */
  reserved: string | null;
  /** The current temperature adjust as -100-100 C° */
  temperatureAdjustment: number | null;
  /** The current cooling mode state */
  coolingModeState: RoomTemperatureCoolingState | null;
  /** The current relative humidity as 0-100 % */
  relativeHumidity: number | null;
  /** The current air quality as co2 0-100 % | quality as 0-100 % | voc as 0,100000 ppm */
  airQualityLevel: number | null;
  /** The current floor temperature as -100-100 C° */
  floorTemperature: number | null;
  /** The device model */
  deviceModel: RoomTemperatureDeviceModel | null;
};

/**
 * The room temperature standard device working modes.
 * @group Systems
 */
export enum RoomTemperatureWorkingModeStandard {
  'off' = 0,
  'comfort' = 8,
  'reduced' = 16,
  'manual' = 64,
  'standby' = 256,
}

/**
 * The room temperature knx device working modes.
 * @group Systems
 */
export enum RoomTemperatureWorkingModeKnx {
  'auto' = 0,
  'comfort' = 1,
  'standby' = 2,
  'economy' = 3,
  'buildingProtection' = 4,
}

/**
 * The room temperature cooling state.
 * @group Systems
 */
export enum RoomTemperatureCoolingState {
  'off' = 0,
  'on' = 1,
}

/**
 * The room temperature device model.
 * @group Systems
 */
export enum RoomTemperatureDeviceModel {
  'standard' = 0,
  'knx' = 1,
}
