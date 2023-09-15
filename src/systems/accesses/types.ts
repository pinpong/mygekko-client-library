import { BaseSystemType } from '../base/types';

export type Access = BaseSystemType & {
  /** The current state */
  currentState: AccessState | null;
  /** The start condition state */
  startCondition: AccessStartConditionState | null;
  /** The runtime percentage 0-100 as % */
  gateRuntimePercentage: number | null;
  /** The access type */
  accessType: AccessType | null;
};

/** The access states */
export enum AccessState {
  'close' = 0,
  'open' = 1,
  'keepOpen' = 2,
}

/** The access start condition states */
export enum AccessStartConditionState {
  'off' = 0,
  'on' = 1,
}

/** The access types */
export enum AccessType {
  'door' = 0,
  'gate' = 1,
  'barrier' = 2,
}
