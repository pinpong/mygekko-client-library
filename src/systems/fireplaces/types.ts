import { BaseSystemType } from '../base/types';

export type Fireplace = BaseSystemType & {
  temperature: number | null;
  flapOpeningLevel: number | null;
  currentState: FireplaceState | null;
  workingState: FireplaceWorkingState | null;
};

export enum FireplaceState {
  'stoveIdle' = 0,
  'closeDoor' = 5,
  'enkindleRecognized' = 7,
  'activeTempReached' = 9,
  'residueFinished' = 11,
  'stoveCooledOff' = 13,
}

export enum FireplaceWorkingState {
  'idle' = 0,
  'active' = 1,
}
