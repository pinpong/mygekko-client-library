import { BaseSystemType } from '../base/types';

export type HeatingCircuit = BaseSystemType & {
  deviceModel: HeatingCircuitDeviceModel | null;
  flowTemperature: number | null;
  returnFlowTemperature: number | null;
  dewPoint: number | null;
  pumpWorkingLevel: number | null;
  coolingModeState: HeatingCircuitCoolingMode | null;
  flowTemperatureSetPoint: number | null;
  valveOpeningLevel: number | null;
  currentState: HeatingCircuitState | null;
};

export enum HeatingCircuitDeviceModel {
  'individual' = 0,
  'buderus' = 1,
  'stiebel' = 2,
  'vaillant' = 3,
}

export enum HeatingCircuitCoolingMode {
  'off' = 0,
  'on' = 1,
}

export enum HeatingCircuitState {
  'off' = 0,
  'on' = 1,
  'auto' = 2,
}
