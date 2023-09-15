import { BaseSystemType } from '../base/types';

export type HeatingCircuit = BaseSystemType & {
  /** The device model */
  deviceModel: HeatingCircuitDeviceModel | null;
  /** The current flow temperature as 0-100 C° */
  flowTemperature: number | null;
  /** The current return flow temperature as 0-100 C° */
  returnFlowTemperature: number | null;
  /** The dew point as 0-100 C° */
  dewPoint: number | null;
  /** The current pump working level as 0-100 % */
  pumpWorkingLevel: number | null;
  /** The current cooling state */
  coolingModeState: HeatingCircuitCoolingMode | null;
  /** The current flow temperature set point temperature as 0-100 C° */
  flowTemperatureSetPoint: number | null;
  /** The current valve opening level as 0-100 % */
  valveOpeningLevel: number | null;
  /** The current state */
  currentState: HeatingCircuitState | null;
};

/** The heating circuits device models */
export enum HeatingCircuitDeviceModel {
  'individual' = 0,
  'buderus' = 1,
  'stiebel' = 2,
  'vaillant' = 3,
}

/** The heating circuits cooling modes */
export enum HeatingCircuitCoolingMode {
  'off' = 0,
  'on' = 1,
}

/** The heating circuits states */
export enum HeatingCircuitState {
  'off' = 0,
  'on' = 1,
  'auto' = 2,
}
