import { BaseSystemType } from '../base/types';

/** @group Systems */
export type GlobalAlarmItem = BaseSystemType & {
  /** The global alarm state of myGEKKO device */
  state: GlobalAlarmState | null;
};

/**
 * The global alarm state of myGEKKO device.
 * @group Systems
 */
export enum GlobalAlarmState {
  'ok' = 0,
  'unacknowledged' = 1,
  'acknowledged' = 2,
  'alarm' = 3,
}
