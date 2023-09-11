import { BaseSystemType } from '../base/types';

export type Trend = BaseSystemType & {
  trendsVariables: TrendVariable[] | null;
};

export enum TrendState {
  'off' = 0,
  'on' = 1,
}

export enum TrendType {
  'logic' = 0,
  'dIn' = 1,
  'dOut' = 2,
  'aIn' = 3,
  'aOut' = 4,
  'aIn2_10' = 5,
  'pt100' = 6,
  'pt1000' = 7,
}

export type TrendVariable = {
  currentState: TrendState | null;
  type: TrendType | null;
  name: string | null;
  value: number | null;
  unit: string | null;
};
