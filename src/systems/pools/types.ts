import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Pool = BaseSystemType & {
  /** The current working mode */
  workingMode: PoolWorkingMode | null;
  /** The current filter state */
  filteringState: PoolFilteringState | null;
  /** The current backwash state */
  backwashState: PoolBackWashState | null;
  /** The current water temperature as 0-100 C° */
  waterTemperature: number | null;
};

/**
 * The pool working modes.
 * @group Systems
 */
export enum PoolWorkingMode {
  'off' = 0,
  'restMode' = 1,
  'bathing' = 2,
}

/**
 * The pool filtering states.
 * @group Systems
 */
export enum PoolFilteringState {
  'off' = 0,
  'on' = 1,
}

/**
 * The pool backwash states.
 * @group Systems
 */
export enum PoolBackWashState {
  'off' = 0,
  'on' = 1,
}
