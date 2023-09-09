import { BaseSystem } from "../base/types";

export type GlobalAlarmItem = BaseSystem & {
  state?: GlobalAlarmState;
};

export enum GlobalAlarmState {
  "ok" = 0,
  "unacknowledged" = 1,
  "acknowledged" = 2,
  "alarm" = 3,
}
