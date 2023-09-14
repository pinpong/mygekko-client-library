import { BaseSystemType } from '../base/types';

export type AirConditioner = BaseSystemType & {
  supplyAirTemperature: number | null;
  supplyAirTemperatureSetPoint: number | null;
  exhaustAirTemperature: number | null;
  exhaustAirTemperatureSetPoint: number | null;
  outsideAirTemperature: number | null;
  outgoingAirTemperature: number | null;
  supplyRelativeHumidityLevel: number | null;
  supplyRelativeHumiditySetPointLevel: number | null;
  exhaustRelativeHumidityLevel: number | null;
  exhaustRelativeHumiditySetPointLevel: number | null;
  airQualityLevel: number | null;
  airQualitySetPointLevel: number | null;
  supplyPressureValue: number | null;
  supplyPressureSetPointValue: number | null;
  exhaustPressureValue: number | null;
  exhaustPressureSetPointValue: number | null;
  workingLevelSetPointLevel: number | null;
  supplyState: AirConditionerSupplyState | null;
  supplyWorkingLevel: number | null;
  supplyFlapOpeningLevel: number | null;
  exhaustState: AirConditionerExhaustState | null;
  exhaustWorkingLevel: number | null;
  exhaustFlapOpeningLevel: number | null;
  currentState: AirConditionerState | null;
  workingMode: AirConditionerWorkingMode | null;
};

export enum AirConditionerSupplyState {
  'off' = 0,
  'on' = 1,
}

export enum AirConditionerExhaustState {
  'off' = 0,
  'on' = 1,
}

export enum AirConditionerState {
  'off' = 0,
  'on' = 1,
}

export enum AirConditionerWorkingMode {
  'off' = 0,
  'heating' = 1,
  'cooling' = 2,
  'auto' = 3,
}
