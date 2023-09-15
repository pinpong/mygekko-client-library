import { BaseSystemType } from '../base/types';

export type Clock = BaseSystemType & {
  /** The current state */
  currentState: ClockState | null;
  /** The current start condition state */
  startCondition: ClockStartConditionState | null;
};

/** The clock states */
export enum ClockState {
  'off' = 0,
  'on' = 1,
  'onCoincidence' = 2,
}

/** The clock start conditions states */
export enum ClockStartConditionState {
  'off' = 0,
  'on' = 1,
}
