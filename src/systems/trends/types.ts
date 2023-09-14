import { BaseSystemType } from '../base/types';

export type Analysis = BaseSystemType & {
  analysisVariables: AnalysisVariable[] | null;
};

export enum AnalysisState {
  'off' = 0,
  'on' = 1,
}

export enum AnalysisType {
  'logic' = 0,
  'dIn' = 1,
  'dOut' = 2,
  'aIn' = 3,
  'aOut' = 4,
  'aIn2_10' = 5,
  'pt100' = 6,
  'pt1000' = 7,
}

export type AnalysisVariable = {
  currentState: AnalysisState | null;
  type: AnalysisType | null;
  name: string | null;
  value: number | null;
  unit: string | null;
};
