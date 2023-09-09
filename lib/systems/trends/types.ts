import { BaseSystem } from "../base/types";

export type Trend = BaseSystem & {
  trendsVariables?: TrendVariable[];
};

export enum TrendState {
  "off" = 0,
  "on" = 1,
}

export enum TrendType {
  "logic" = 0,
  "dIn" = 1,
  "dOut" = 2,
  "aIn" = 3,
  "aOut" = 4,
  "aIn2_10" = 5,
  "pt100" = 6,
  "pt1000" = 7,
}

export type TrendVariable = {
  currentState?: TrendState;
  type?: TrendType;
  name?: string;
  value?: number;
  unit?: string;
};
