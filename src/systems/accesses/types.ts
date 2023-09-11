import { BaseSystemType } from '../base/types';

export type Access = BaseSystemType & {
  currentState: AccessState | null;
  startCondition: StartConditionState | null;
  gateRuntimePercentage: number | null;
  accessType: AccessType | null;
};

export enum AccessState {
  'close' = 0,
  'open' = 1,
  'keepOpen' = 2,
}

export enum StartConditionState {
  'off' = 0,
  'on' = 1,
}

export enum AccessType {
  'door' = 0,
  'gage' = 1,
  'barrier' = 2,
}
