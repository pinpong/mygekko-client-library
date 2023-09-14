import { BaseSystemType } from '../base/types';

export type Action = BaseSystemType & {
  currentState: ActionState | null;
  startCondition: ActionStartConditionState | null;
  runtime: number | null;
};

export enum ActionState {
  'locked' = 0,
  'open' = 1,
  'keepOpen' = 2,
}

export enum ActionStartConditionState {
  'off' = 0,
  'on' = 1,
}
