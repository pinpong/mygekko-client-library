import { BaseSystemType } from '../base/types';

export type Clock = BaseSystemType & {
  currentState: ClockState | null;
  startCondition: ClockStartConditionState | null;
};

export enum ClockState {
  'off' = 0,
  'on' = 1,
  'onCoincidence' = 2,
}

export enum ClockStartConditionState {
  'off' = 0,
  'on' = 1,
}
