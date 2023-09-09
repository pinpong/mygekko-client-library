import { BaseSystem } from "../base/types";

export type Action = BaseSystem & {
  currentState?: ActionState;
  startCondition?: StartConditionState;
  runtime?: number;
};

export enum ActionState {
  "locked" = 0,
  "open" = 1,
  "keepOpen" = 2,
}

export enum StartConditionState {
  "off" = 0,
  "on" = 1,
}
