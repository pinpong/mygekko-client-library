import { BaseSystemType } from '../base/types';

export type Analysis = BaseSystemType & {
  /** The current variables */
  analysisVariables: AnalysisVariable[] | null;
};

/** The analysis states */
export enum AnalysisState {
  'off' = 0,
  'on' = 1,
}

/** The analysis types */
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

/** The analysis variable */
export type AnalysisVariable = {
  /** The current analysis state */
  currentState: AnalysisState | null;
  /** The type */
  type: AnalysisType | null;
  /** The analysis name */
  name: string | null;
  /** The analysis value */
  value: number | null;
  /** The analysis unit */
  unit: string | null;
};
