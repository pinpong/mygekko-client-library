import { BaseSystemType } from '../base/types';

export type Pool = BaseSystemType & {
  /** The current working mode */
  workingMode: PoolWorkingMode | null;
  /** The current filter state */
  filteringState: FilteringState | null;
  /** The current backwash state */
  backwashState: BackWashState | null;
  /** The current water temperature as 0-100 C° */
  waterTemperature: number | null;
};

/** The pool working modes */
export enum PoolWorkingMode {
  'off' = 0,
  'restMode' = 1,
  'bathing' = 2,
}

/** The pool filtering states */
export enum FilteringState {
  'off' = 0,
  'on' = 1,
}

/** The pool backwash states */
export enum BackWashState {
  'off' = 0,
  'on' = 1,
}
