import { BaseSystem } from "../base/types";

export type AirConditioner = BaseSystem & {
  supplyAirTemperature?: number;
  supplyAirTemperatureSetPoint?: number;
  exhaustAirTemperature?: number;
  exhaustAirTemperatureSetPoint?: number;
  outsideAirTemperature?: number;
  outgoingAirTemperature?: number;
  supplyRelativeHumidityLevel?: number;
  supplyRelativeHumiditySetPointLevel?: number;
  exhaustRelativeHumidityLevel?: number;
  exhaustRelativeHumiditySetPointLevel?: number;
  airQualityLevel?: number;
  airQualitySetPointLevel?: number;
  supplyPressureValue?: number;
  supplyPressureSetPointValue?: number;
  exhaustPressureValue?: number;
  exhaustPressureSetPointValue?: number;
  workingLevelSetPointLevel?: number;
  supplyState?: AirConditionerSupplyState;
  supplyWorkingLevel?: number;
  supplyFlapOpeningLevel?: number;
  exhaustState?: AirConditionerExhaustState;
  exhaustWorkingLevel?: number;
  exhaustFlapOpeningLevel?: number;
  currentState?: AirConditionerState;
  workingMode?: AirConditionerWorkingMode;
};

export enum AirConditionerSupplyState {
  "off" = 0,
  "on" = 1,
}

export enum AirConditionerExhaustState {
  "off" = 0,
  "on" = 1,
}

export enum AirConditionerState {
  "off" = 0,
  "on" = 1,
}

export enum AirConditionerWorkingMode {
  "off" = 0,
  "heating" = 1,
  "cooling" = 2,
  "auto" = 3,
}
