import { BaseSystem } from "../base/types";

export type HotWaterCirculation = BaseSystem & {
  pumpType?: HotWaterCirculationPumpType;
  currentState?: HotWaterCirculationState;
  returnWaterTemperature?: number;
  returnWaterTemperatureSetPoint?: number;
};

export enum HotWaterCirculationPumpType {
  "onOff" = 0,
  "pwm" = 1,
  "percentage",
}

export enum HotWaterCirculationState {
  "off" = 0,
  "on" = 1,
}
