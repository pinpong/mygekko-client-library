import { BaseSystemType } from '../base/types';

export type Blind = BaseSystemType & {
  /** The current state */
  currentState: BlindState | null;
  /** The current position 0-100 as % */
  position: number | null;
  /** The current rotation level 0-100 as % */
  rotationLevel: number | null;
  /** The current rotation range */
  rotationRange: RotationRange | null;
};

/** The blind states */
export enum BlindState {
  'holdDown' = -2,
  'movingDown' = -1,
  'stop' = 0,
  'movingUp' = 1,
  'holdUp' = 2,
}

/** The blind rotations ranges */
export enum RotationRange {
  'ninety' = 90,
  'hundredEighty' = 180,
}
