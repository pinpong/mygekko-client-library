import { BaseSystemType } from '../base/types';

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

/** The how water circulation pump types */
export enum HotWaterCirculationPumpType {
  'onOff' = 0,
  'pwm' = 1,
  'percentage',
}

/** The how water circulation states */
export enum HotWaterCirculationState {
  'off' = 0,
  'on' = 1,
}
