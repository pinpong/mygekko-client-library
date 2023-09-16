import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Analysis = BaseSystemType & {
  /** The current variables */
  analysisVariables: AnalysisVariable[] | null;
};

/**
 * The analysis states.
 * @group Systems
 */
export enum AnalysisState {
  'off' = 0,
  'on' = 1,
}

/**
 * The analysis types.
 * @group Systems
 */
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
/** @group Systems */
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
