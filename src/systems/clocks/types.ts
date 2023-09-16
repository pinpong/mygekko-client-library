import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Clock = BaseSystemType & {
  /** The current state */
  currentState: ClockState | null;
  /** The current start condition state */
  startCondition: ClockStartConditionState | null;
};

/**
 * The clock states.
 * @group Systems
 */
export enum ClockState {
  'off' = 0,
  'on' = 1,
  'onCoincidence' = 2,
}

/**
 * The clock start conditions states.
 * @group Systems
 */
export enum ClockStartConditionState {
  'off' = 0,
  'on' = 1,
}
