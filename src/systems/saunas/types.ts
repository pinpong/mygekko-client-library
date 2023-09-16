import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Sauna = BaseSystemType & {
  /** The current working mode */
  workingMode: SaunaWorkingMode | null;
  /** The current state */
  currentState: SaunaState | null;
  /** The current sauna error state */
  errorState: SaunaErrorState | null;
  /** The current room temperature as 0-100 C° */
  roomTemperature: number | null;
  /** The current room set point temperature as 0-1000 C° */
  roomTemperatureSetPoint: number | null;
  /** The current burner temperature as 0-1000 C° */
  burnerTemperature: number | null;
  /** The current relative humidity as 0-100 % */
  roomRelativeHumidityLevel: number | null;
  /** The current relative humidity set point as 0-100 % */
  roomRelativeHumiditySetPointLevel: number | null;
};

/**
 * The sauna working modes.
 * @group Systems
 */
export enum SaunaWorkingMode {
  'off' = 0,
  'onOrFinished' = 1,
  'bio' = 2,
}

/**
 * The sauna states.
 * @group Systems
 */
export enum SaunaState {
  'off' = 0,
  'on' = 1,
}

/**
 * The sauna error states.
 * @group Systems
 */
export enum SaunaErrorState {
  'noError' = 0,
  'error' = 1,
}
