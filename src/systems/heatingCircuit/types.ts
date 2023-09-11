import { BaseSystem } from '../base/types';

export type HeatingCircuit = BaseSystem & {
  deviceModel?: HeatingCircuitDeviceModel;
  flowTemperature?: number;
  returnFlowTemperature?: number;
  dewPoint?: number;
  pumpWorkingLevel?: number;
  coolingModeState?: HeatingCircuitCoolingMode;
  flowTemperatureSetPoint?: number;
  valveOpeningLevel?: number;
  currentState?: HeatingCircuitState;
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
