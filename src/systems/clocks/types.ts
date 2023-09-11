import { BaseSystemType } from '../base/types';

export type Clock = BaseSystemType & {
  currentState: ClockState | null;
  startCondition: StartConditionState | null;
};

export enum ClockState {
  'off' = 0,
  'on' = 1,
  'onCoincidence' = 2,
}

export enum StartConditionState {
  'off' = 0,
  'on' = 1,
}
