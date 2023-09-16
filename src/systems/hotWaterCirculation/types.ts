import { BaseSystemType } from '../base/types';

/** @group Systems */
export type HotWaterCirculation = BaseSystemType & {
  /** The pump type */
  pumpType: HotWaterCirculationPumpType | null;
  /** The current state */
  currentState: HotWaterCirculationState | null;
  /** The current return water temperature as 0-100 C° */
  returnWaterTemperature: number | null;
  /** The current return water flow temperature as 0-100 C° */
  returnWaterTemperatureSetPoint: number | null;
};

/**
 * The how water circulation pump types.
 * @group Systems
 */
export enum HotWaterCirculationPumpType {
  'onOff' = 0,
  'pwm' = 1,
  'percentage',
}

/**
 * The how water circulation states.
 * @group Systems
 */
export enum HotWaterCirculationState {
  'off' = 0,
  'on' = 1,
}
