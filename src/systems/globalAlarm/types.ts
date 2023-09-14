import { BaseSystemType } from '../base/types';

export type GlobalAlarmItem = BaseSystemType & {
  state: GlobalAlarmState | null;
};

export enum GlobalAlarmState {
  'ok' = 0,
  'unacknowledged' = 1,
  'acknowledged' = 2,
  'alarm' = 3,
}
