import { BaseSystemType } from '../base/types';

export type HotWaterCirculation = BaseSystemType & {
  pumpType: HotWaterCirculationPumpType | null;
  currentState: HotWaterCirculationState | null;
  returnWaterTemperature: number | null;
  returnWaterTemperatureSetPoint: number | null;
};

export enum HotWaterCirculationPumpType {
  'onOff' = 0,
  'pwm' = 1,
  'percentage',
}

export enum HotWaterCirculationState {
  'off' = 0,
  'on' = 1,
}
