import { BaseSystemType } from '../base/types';

/** @group Systems */
export type HeatingSystem = BaseSystemType & {
  /** The device model */
  deviceModel: HeatingSystemDeviceModel | null;
  /** The current cooling mode state */
  coolingModeState: HeatingSystemCoolingState | null;
  /** The current flow temperature as 0-100 C° */
  flowTemperature: number | null;
  /** The current flow set point temperature as 0-100 C° */
  flowTemperatureSetPoint: number | null;
  /** The current  state */
  currentState: HeatingSystemState | null;
};

/**
 * The heating system device models.
 * @group Systems
 */
export enum HeatingSystemDeviceModel {
  'individual' = 0,
  'buderus' = 1,
  'stiebel' = 2,
  'tecalor' = 3,
  'vaillant' = 4,
}

/**
 * The heating system cooling states.
 * @group Systems
 */
export enum HeatingSystemCoolingState {
  'off' = 0,
  'on' = 1,
}

/**
 * The heating system states.
 * @group Systems
 */
export enum HeatingSystemState {
  'off' = 0,
  'on' = 1,
}
