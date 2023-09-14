import { BaseSystemType } from '../base/types';

export type Blind = BaseSystemType & {
  currentState: BlindState | null;
  position: number | null;
  rotationLevel: number | null;
  rotationRange: RotationRange | null;
};

export enum BlindState {
  'holdDown' = -2,
  'movingDown' = -1,
  'stop' = 0,
  'movingUp' = 1,
  'holdUp' = 2,
}

export enum RotationRange {
  'ninety' = 90,
  'hundredEighty' = 180,
}
