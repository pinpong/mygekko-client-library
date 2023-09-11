import { BaseSystem } from '../base/types';

export type Clock = BaseSystem & {
  currentState?: ClockState;
  startCondition: StartConditionState;
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
