import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Stove = BaseSystemType & {
  /** The current temperature as 20-1000 C° */
  temperature: number | null;
  /** The current flap opening level as 0-100 % */
  flapOpeningLevel: number | null;
  /** The current state */
  currentState: StovesState | null;
  /** The current working mode */
  workingState: StoveWorkingState | null;
};

/**
 * The stove states.
 * @group Systems
 */
export enum StovesState {
  'stoveIdle' = 0,
  'closeDoor' = 5,
  'enkindleRecognized' = 7,
  'activeTempReached' = 9,
  'residueFinished' = 11,
  'stoveCooledOff' = 13,
}

/**
 * The stove working states.
 * @group Systems
 */
export enum StoveWorkingState {
  'idle' = 0,
  'active' = 1,
}
