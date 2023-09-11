import { BaseSystem } from '../base/types';

export type Pool = BaseSystem & {
  workingMode?: PoolWorkingMode;
  filteringState?: FilteringState;
  backwashState?: BackWashState;
  waterTemperature?: number;
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
