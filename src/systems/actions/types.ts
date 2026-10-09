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
  'off' = 0,
  'on' = 1,
}

/**
 * The action start condition states.
 * @group Systems
 */
export enum ActionStartConditionState {
  'off' = 0,
  'on' = 1,
}
