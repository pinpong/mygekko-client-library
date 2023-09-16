import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Blind = BaseSystemType & {
  /** The current state */
  currentState: BlindState | null;
  /** The current position 0-100 as % */
  position: number | null;
  /** The current rotation level 0-100 as % */
  rotationLevel: number | null;
  /** The current rotation range */
  rotationRange: BlindRotationRange | null;
};

/**
 * The blind states.
 * @group Systems
 */
export enum BlindState {
  'holdDown' = -2,
  'movingDown' = -1,
  'stop' = 0,
  'movingUp' = 1,
  'holdUp' = 2,
}

/**
 * The blind rotations ranges.
 * @group Systems
 */
export enum BlindRotationRange {
  'ninety' = 90,
  'hundredEighty' = 180,
}
