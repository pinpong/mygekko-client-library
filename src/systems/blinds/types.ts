import { BaseSystem } from "../base/types";

export type Blind = BaseSystem & {
  currentState?: BlindState;
  position?: number;
  rotationLevel?: number;
  rotationRange?: RotationRange;
};

export enum BlindState {
  "holdDown" = -2,
  "movingDown" = -1,
  "stop" = 0,
  "movingUp" = 1,
  "holdUp" = 2,
}

export enum RotationRange {
  "ninety" = 90,
  "hundredEighty" = 180,
}
