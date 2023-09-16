import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Action = BaseSystemType & {
  /** The current state */
  currentState: ActionState | null;
  /** The current start condition */
  startCondition: ActionStartConditionState | null;
};

/**
 * The action states.
 * @group Systems
 */
export enum ActionState {
  'locked' = 0,
  'open' = 1,
  'keepOpen' = 2,
}

/**
 * The action start condition states.
 * @group Systems
 */
export enum ActionStartConditionState {
  'off' = 0,
  'on' = 1,
}
