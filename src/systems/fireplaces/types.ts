import { BaseSystem } from '../base/types';

export type Fireplace = BaseSystem & {
  temperature?: number;
  flapOpeningLevel?: number;
  currentState?: FireplaceState;
  workingState?: FireplaceWorkingState;
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
