import { BaseSystemType } from '../base/types';

export type Pool = BaseSystemType & {
  workingMode: PoolWorkingMode | null;
  filteringState: FilteringState | null;
  backwashState: BackWashState | null;
  waterTemperature: number | null;
};

export enum PoolWorkingMode {
  'off' = 0,
  'restMode' = 1,
  'bathing' = 2,
}

export enum FilteringState {
  'off' = 0,
  'on' = 1,
}

export enum BackWashState {
  'off' = 0,
  'on' = 1,
}
