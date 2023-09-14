import { BaseSystemType } from '../base/types';

export type Stove = BaseSystemType & {
  temperature: number | null;
  flapOpeningLevel: number | null;
  currentState: StovesState | null;
  workingState: StoveWorkingState | null;
};

export enum StovesState {
  'stoveIdle' = 0,
  'closeDoor' = 5,
  'enkindleRecognized' = 7,
  'activeTempReached' = 9,
  'residueFinished' = 11,
  'stoveCooledOff' = 13,
}

export enum StoveWorkingState {
  'idle' = 0,
  'active' = 1,
}
