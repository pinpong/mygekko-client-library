import { BaseSystemType } from '../base/types';

export type GlobalAlarmItem = BaseSystemType & {
  /** The global alarm state of myGEKKO device */
  state: GlobalAlarmState | null;
};

/** The global alarm state of myGEKKO device */
export enum GlobalAlarmState {
  'ok' = 0,
  'unacknowledged' = 1,
  'acknowledged' = 2,
  'alarm' = 3,
}
