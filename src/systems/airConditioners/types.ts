import { BaseSystemType } from '../base/types';

/** @group Systems */
export type AirConditioner = BaseSystemType & {
  /** The supply air temperature -100-100 as C° */
  supplyAirTemperature: number | null;
  /** The supply air set point temperature -100-100 as C° */
  supplyAirTemperatureSetPoint: number | null;
  /** The exhaust air temperature -100-100 as C° */
  exhaustAirTemperature: number | null;
  /** The exhaust air set point temperature -100-100 as C° */
  exhaustAirTemperatureSetPoint: number | null;
  /** The outside air temperature -100-100 as C° */
  outsideAirTemperature: number | null;
  /** The outgoing air temperature -100-100 as C° */
  outgoingAirTemperature: number | null;
  /** The supply relative humidity level 0-100 as % */
  supplyRelativeHumidityLevel: number | null;
  /** The supply relative humidity set point level 0-100 as % */
  supplyRelativeHumiditySetPointLevel: number | null;
  /** The exhaust relative humidity level 0-100 as % */
  exhaustRelativeHumidityLevel: number | null;
  /** The exhaust relative humidity set point level 0-100 as % */
  exhaustRelativeHumiditySetPointLevel: number | null;
  /** The air quality 0-100 as % */
  airQualityLevel: number | null;
  /** The air quality 0-100 as % */
  airQualitySetPointLevel: number | null;
  /** The supply pressure 0-... As Pa */
  supplyPressure: number | null;
  /** The supply pressure set point 0-... As Pa */
  supplyPressureSetPoint: number | null;
  /** The exhaust pressure 0-... As Pa */
  exhaustPressure: number | null;
  /** The exhaust pressure set point 0-... As Pa */
  exhaustPressureSetPoint: number | null;
  /** The working level set point level 0-100 as % */
  workingLevelSetPointLevel: number | null;
  /** The supply state */
  supplyState: AirConditionerSupplyState | null;
  /** The supply working level set point level 0-100 as % */
  supplyWorkingLevel: number | null;
  /** The supply flap opening level 0-100 as % */
  supplyFlapOpeningLevel: number | null;
  /** The exhaust state */
  exhaustState: AirConditionerExhaustState | null;
  /** The exhaust working level 0-100 as % */
  exhaustWorkingLevel: number | null;
  /** The exhaust flap opening level 0-100 as % */
  exhaustFlapOpeningLevel: number | null;
  /** The current state */
  currentState: AirConditionerState | null;
  /** The current working mode */
  workingMode: AirConditionerWorkingMode | null;
};

/**
 * The air conditioner supply states.
 * @group Systems
 */
export enum AirConditionerSupplyState {
  'off' = 0,
  'on' = 1,
}

/**
 * The air conditioner exhaust states.
 * @group Systems
 */
export enum AirConditionerExhaustState {
  'off' = 0,
  'on' = 1,
}

/**
 * The air conditioner states.
 * @group Systems
 */
export enum AirConditionerState {
  'off' = 0,
  'on' = 1,
}

/**
 * The air conditioner working modes.
 * @group Systems
 */
export enum AirConditionerWorkingMode {
  'off' = 0,
  'heating' = 1,
  'cooling' = 2,
  'auto' = 3,
}
