import { BaseSystemType } from '../base/types';

/**
 * @group Systems
 */
/** @group Systems */
export type Access = BaseSystemType & {
  /** The current state */
  currentState: AccessState | null;
  /** The state of the access itself */
  accessState: AccessDoorState | null;
  /** The runtime percentage 0-100 as % */
  gateRuntimePercentage: number | null;
  /** The access type */
  accessType: AccessType | null;
};

/**
 * The access states.
 * @group Systems
 */
export enum AccessState {
  'close' = 0,
  'open' = 1,
  'keepOpen' = 2,
}

/**
 * The states of the access itself.
 * @group Systems
 */
export enum AccessDoorState {
  'closed' = 0,
  'open' = 1,
}

/**
 * The access types.
 * @group Systems
 */
export enum AccessType {
  'door' = 0,
  'gate' = 1,
  'barrier' = 2,
}
